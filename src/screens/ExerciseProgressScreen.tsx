import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-chart-kit';
import { ExercisePicker } from '../components/ExercisePicker';
import { EXERCISES_BY_ID } from '../data/seedData';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, splitColors } from '../theme';
import { formatShortDate, getExerciseRecords, getExerciseStats } from '../utils/progress';
import { toDisplayWeight } from '../utils/workout';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseProgress'>;
type Metric = 'weight' | 'volume' | 'reps';

const MAX_POINTS = 12;

export default function ExerciseProgressScreen({ route }: Props) {
  const { history, unit } = useWorkoutStore();
  const { width } = useWindowDimensions();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [metric, setMetric] = useState<Metric>('weight');

  // Default to the most recently trained exercise, if any.
  const [selectedId, setSelectedId] = useState<string | undefined>(() => {
    if (route.params?.exerciseId) return route.params.exerciseId;
    const latest = [...history].sort((a, b) => b.date.localeCompare(a.date))[0];
    return latest?.exercises[0]?.exerciseId;
  });

  const exercise = selectedId ? EXERCISES_BY_ID[selectedId] : undefined;
  const stats = useMemo(() => (selectedId ? getExerciseStats(history, selectedId) : []), [history, selectedId]);
  const records = useMemo(() => (selectedId ? getExerciseRecords(history, selectedId) : { totalReps: 0 }), [history, selectedId]);

  const isBW = !!exercise?.isBodyweight;
  const hasWeighted = stats.some((s) => s.maxWeightKg > 0);
  // Unweighted bodyweight work is tracked in reps; weight charts only make sense once load was added.
  const metrics: Metric[] = isBW ? (hasWeighted ? ['reps', 'weight'] : ['reps']) : ['weight', 'volume'];
  const activeMetric: Metric = metrics.includes(metric) ? metric : metrics[0];
  const metricLabel: Record<Metric, string> = {
    weight: isBW ? 'Added weight' : 'Max weight',
    volume: 'Volume',
    reps: 'Total reps',
  };

  const recent = stats.slice(-MAX_POINTS);
  const values = recent.map((s) =>
    activeMetric === 'reps'
      ? s.totalReps
      : toDisplayWeight(activeMetric === 'weight' ? s.maxWeightKg : s.volumeKg, unit),
  );
  const step = Math.ceil(recent.length / 5);
  const labels = recent.map((s, i) => (i % step === 0 ? formatShortDate(s.date) : ''));

  const accent = exercise ? splitColors[exercise.category] : colors.accent;
  const hex = accent.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',');

  const w = (kg: number) => `${toDisplayWeight(kg, unit)} ${unit}`;

  return (
    <SafeAreaView style={styles.root} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={styles.selector}
          accessibilityRole="button"
          accessibilityLabel="Choose exercise"
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.selectorLabel}>Exercise</Text>
            <Text style={styles.selectorValue}>{exercise?.name ?? 'Select an exercise'}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={24} color={colors.textMuted} />
        </Pressable>

        {!exercise ? (
          <Text style={styles.empty}>Pick an exercise to see your progress.</Text>
        ) : stats.length === 0 ? (
          <Text style={styles.empty}>
            {isBW
              ? `No completed sets logged for ${exercise.name} yet.`
              : `No weighted sets logged for ${exercise.name} yet. Complete a set with a weight above zero and it will appear here.`}
          </Text>
        ) : (
          <>
            <View style={styles.cards}>
              {isBW && !hasWeighted ? (
                <>
                  <SummaryCard
                    icon="counter"
                    label="Total reps"
                    value={String(records.totalReps)}
                    sub={`${stats.length} workout${stats.length === 1 ? '' : 's'}`}
                    color={colors.accent}
                  />
                  <SummaryCard
                    icon="trophy-outline"
                    label="Best set"
                    value={records.pr ? `${records.pr.reps} reps` : '—'}
                    sub={records.pr ? formatShortDate(records.pr.date) : undefined}
                    color={colors.accentAlt}
                  />
                </>
              ) : (
                <>
                  <SummaryCard
                    icon="calculator-variant"
                    label={isBW ? 'Est. 1RM (added)' : 'Estimated 1RM'}
                    value={records.e1rm ? `${isBW ? '+' : ''}${w(records.e1rm.valueKg)}` : '—'}
                    sub={
                      records.e1rm
                        ? `from ${isBW ? '+' : ''}${w(records.e1rm.weightKg)} × ${records.e1rm.reps}`
                        : undefined
                    }
                    color={colors.accent}
                  />
                  <SummaryCard
                    icon="trophy-outline"
                    label="Personal record"
                    value={records.pr ? `${isBW ? '+' : ''}${w(records.pr.weightKg)}` : '—'}
                    sub={records.pr ? `${records.pr.reps} reps · ${formatShortDate(records.pr.date)}` : undefined}
                    color={colors.accentAlt}
                  />
                </>
              )}
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Over time</Text>
                {metrics.length > 1 && (
                  <View style={styles.toggle}>
                    {metrics.map((m) => (
                      <Pressable
                        key={m}
                        onPress={() => setMetric(m)}
                        style={[styles.toggleBtn, activeMetric === m && styles.toggleOn]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: activeMetric === m }}
                      >
                        <Text style={[styles.toggleText, activeMetric === m && styles.toggleTextOn]}>
                          {metricLabel[m]}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {recent.length < 2 ? (
                <Text style={styles.empty}>Log this exercise in at least two workouts to see a trend.</Text>
              ) : (
                <LineChart
                  data={{ labels, datasets: [{ data: values }] }}
                  width={width - 32 - 24}
                  height={220}
                  yAxisSuffix={activeMetric === 'reps' ? '' : ` ${unit}`}
                  fromZero
                  bezier
                  withInnerLines
                  withOuterLines={false}
                  chartConfig={{
                    backgroundGradientFrom: colors.surface,
                    backgroundGradientTo: colors.surface,
                    decimalPlaces: 0,
                    color: (o = 1) => `rgba(${rgb},${o})`,
                    labelColor: (o = 1) => `rgba(148,163,184,${o})`,
                    propsForDots: { r: '4', strokeWidth: '2', stroke: accent },
                    propsForBackgroundLines: { stroke: colors.border },
                  }}
                  style={{ borderRadius: radius.md, marginLeft: -8 }}
                />
              )}
              <Text style={styles.footnote}>
                {activeMetric === 'weight'
                  ? isBW
                    ? 'Heaviest added weight per workout'
                    : 'Heaviest completed set per workout'
                  : activeMetric === 'volume'
                    ? 'Sum of weight × reps per workout'
                    : 'Total reps per workout'}
                {stats.length > MAX_POINTS ? ` · last ${MAX_POINTS} workouts` : ''}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <ExercisePicker
        visible={pickerOpen}
        selectedId={selectedId}
        onSelect={(e) => {
          setSelectedId(e.id);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </SafeAreaView>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <View style={styles.summary}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      {sub ? <Text style={styles.summarySub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14 },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 14,
  },
  selectorLabel: { color: colors.textMuted, fontSize: 12, textTransform: 'uppercase' },
  selectorValue: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 2 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  cards: { flexDirection: 'row', gap: 12 },
  summary: {
    flex: 1,
    gap: 4,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
  },
  summaryLabel: { color: colors.textMuted, fontSize: 12, textTransform: 'uppercase', marginTop: 4 },
  summaryValue: { fontSize: 24, fontWeight: '800' },
  summarySub: { color: colors.textMuted, fontSize: 12 },
  chartCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 12,
    gap: 10,
    overflow: 'hidden',
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  toggle: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: 999, padding: 3 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  toggleOn: { backgroundColor: colors.accentAlt },
  toggleText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  toggleTextOn: { color: '#fff' },
  footnote: { color: colors.textMuted, fontSize: 12 },
});
