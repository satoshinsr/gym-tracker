import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NumberField } from '../components/NumberField';
import { ExerciseMedia } from '../components/ExerciseMedia';
import { RestTimerModal } from '../components/RestTimerModal';
import { RpePicker } from '../components/RpePicker';
import { defaultRestSeconds, EXERCISES_BY_ID } from '../data/seedData';
import { useElapsedSeconds } from '../hooks/useElapsed';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, splitColors } from '../theme';
import { ExerciseLog, WeightUnit } from '../types';
import {
  completedSetCount,
  formatDuration,
  formatSetBrief,
  formatVolume,
  fromDisplayWeight,
  setLoadKg,
  toDisplayWeight,
  totalVolumeKg,
} from '../utils/workout';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveWorkout'>;

export default function ActiveWorkoutScreen({ navigation }: Props) {
  const store = useWorkoutStore();
  const { active, unit } = store;
  const elapsed = useElapsedSeconds(active?.startedAt);
  const [rest, setRest] = useState({ visible: false, seconds: 90, token: 0 });

  // Called only on the uncompleted -> completed transition (see ExerciseCard).
  const startRest = (exerciseId: string) =>
    setRest((r) => ({ visible: true, seconds: defaultRestSeconds(exerciseId), token: r.token + 1 }));

  const volumeKg = useMemo(() => (active ? totalVolumeKg(active.exercises) : 0), [active]);
  const setsDone = active ? completedSetCount(active.exercises) : 0;

  if (!active) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <MaterialCommunityIcons name="dumbbell" size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No active workout</Text>
        <Pressable style={styles.primaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryText}>Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const finish = () => {
    if (setsDone === 0) {
      Alert.alert('No completed sets', 'Tick the "Done" box on sets you finished, or discard this workout.', [
        { text: 'Keep going', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => confirmDiscard() },
      ]);
      return;
    }
    Alert.alert(
      'Finish workout?',
      `Duration: ${formatDuration(elapsed)}\nCompleted sets: ${setsDone}\nTotal volume: ${formatVolume(volumeKg, unit)}`,
      [
        { text: 'Keep going', style: 'cancel' },
        {
          text: 'Finish',
          onPress: async () => {
            try {
              await store.finishWorkout();
              navigation.popToTop();
            } catch {
              Alert.alert('Could not save', 'Your workout is still active. Please try again.');
            }
          },
        },
      ],
    );
  };

  const confirmDiscard = () => {
    store.discardWorkout();
    navigation.popToTop();
  };

  const discard = () =>
    Alert.alert('Discard workout?', 'All sets from this session will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: confirmDiscard },
    ]);

  return (
    <SafeAreaView style={styles.root} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.timerCard}>
            <Text style={styles.timer} accessibilityLabel={`Elapsed time ${formatDuration(elapsed)}`}>
              {formatDuration(elapsed)}
            </Text>
            <View style={styles.stats}>
              <Stat label="Sets" value={String(setsDone)} />
              <Stat label="Volume" value={formatVolume(volumeKg, unit)} />
              <UnitToggle unit={unit} onChange={store.setUnit} />
            </View>
          </View>

          {active.exercises.map((log) => (
            <ExerciseCard key={log.exerciseId} log={log} onSetCompleted={startRest} />
          ))}

          <Pressable
            style={styles.addExercise}
            onPress={() => navigation.navigate('ExerciseList', { split: active.splitType })}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.accent} />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </Pressable>

          <Pressable onPress={discard} style={styles.discard} accessibilityRole="button">
            <Text style={styles.discardText}>Discard workout</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={finish}
            style={({ pressed }) => [styles.primaryBtn, styles.finishBtn, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="flag-checkered" size={20} color={colors.onAccent} />
            <Text style={styles.primaryText}>Finish Workout</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <RestTimerModal
        visible={rest.visible}
        initialSeconds={rest.seconds}
        startToken={rest.token}
        onClose={() => setRest((r) => ({ ...r, visible: false }))}
      />
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function UnitToggle({ unit, onChange }: { unit: WeightUnit; onChange: (u: WeightUnit) => void }) {
  return (
    <View style={styles.unitToggle}>
      {(['kg', 'lbs'] as const).map((u) => (
        <Pressable
          key={u}
          onPress={() => onChange(u)}
          style={[styles.unitBtn, unit === u && styles.unitBtnOn]}
          accessibilityRole="button"
          accessibilityState={{ selected: unit === u }}
        >
          <Text style={[styles.unitText, unit === u && styles.unitTextOn]}>{u}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ExerciseCard({ log, onSetCompleted }: { log: ExerciseLog; onSetCompleted: (exerciseId: string) => void }) {
  const store = useWorkoutStore();
  const { unit } = store;
  const [expanded, setExpanded] = useState(true);
  const [rpeSetId, setRpeSetId] = useState<string | null>(null);
  const exercise = EXERCISES_BY_ID[log.exerciseId];
  const best = store.getBestSet(log.exerciseId);
  if (!exercise) return null;

  const isBW = !!exercise.isBodyweight;
  const rpeSet = log.sets.find((s) => s.id === rpeSetId);
  const done = log.sets.filter((s) => s.completed).length;
  const accent = splitColors[exercise.category];

  const confirmRemove = () =>
    Alert.alert('Remove exercise?', `${exercise.name} and its sets will be removed from this workout.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => store.removeExercise(log.exerciseId) },
    ]);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={styles.cardHeader}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${exercise.name}, ${done} of ${log.sets.length} sets done`}
      >
        <ExerciseMedia exerciseId={exercise.id} variant="thumb" style={styles.thumb} />
        <View style={{ flex: 1 }}>
          <Text style={styles.exName} numberOfLines={1}>
            {exercise.name}
          </Text>
          <Text style={[styles.exMeta, done === log.sets.length && log.sets.length > 0 && { color: accent }]}>
            {done}/{log.sets.length} sets · {exercise.muscleTarget}
          </Text>
        </View>
        <Pressable onPress={confirmRemove} hitSlop={10} accessibilityLabel={`Remove ${exercise.name}`}>
          <MaterialCommunityIcons name="trash-can-outline" size={22} color={colors.textMuted} />
        </Pressable>
        <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.textMuted} />
      </Pressable>

      {expanded && (
        <View style={styles.sets}>
          <View style={styles.row}>
            <Text style={[styles.th, styles.colSet]}>Set</Text>
            <Text style={[styles.th, styles.colPrev]}>Prev (Best)</Text>
            <Text style={[styles.th, styles.colWeight]}>{isBW ? `+${unit}` : unit}</Text>
            <Text style={[styles.th, styles.colReps]}>Reps</Text>
            <Text style={[styles.th, styles.colRpe]}>RPE</Text>
            <Text style={[styles.th, styles.colDone]}>Done</Text>
            <View style={styles.colDel} />
          </View>

          {log.sets.map((set) => (
            <View key={set.id} style={[styles.row, set.completed && styles.rowDone]}>
              <Text style={[styles.setNum, styles.colSet]}>{set.setNumber}</Text>
              <Text style={[styles.prev, styles.colPrev]}>{best ? formatSetBrief(best, unit, isBW) : '—'}</Text>
              <View style={styles.colWeight}>
                <NumberField
                  decimal
                  highlight={set.completed}
                  placeholder={isBW ? 'BW' : '0'}
                  value={toDisplayWeight(isBW ? setLoadKg(set) : set.weightKg, unit)}
                  onCommit={(n) => {
                    const kg = fromDisplayWeight(n, unit);
                    // Bodyweight: the field is the added weight (0 = unweighted); fold any legacy weightKg into it.
                    store.updateSet(
                      log.exerciseId,
                      set.id,
                      isBW ? { addedWeightKg: kg, weightKg: 0 } : { weightKg: kg },
                    );
                  }}
                  accessibilityLabel={`Set ${set.setNumber} ${isBW ? 'added weight' : 'weight'} in ${unit}`}
                />
              </View>
              <View style={styles.colReps}>
                <NumberField
                  highlight={set.completed}
                  value={set.reps}
                  onCommit={(n) => store.updateSet(log.exerciseId, set.id, { reps: n })}
                  accessibilityLabel={`Set ${set.setNumber} reps`}
                />
              </View>
              <Pressable
                style={styles.colRpe}
                onPress={() => setRpeSetId(set.id)}
                hitSlop={4}
                accessibilityRole="button"
                accessibilityLabel={`Set ${set.setNumber} RPE${set.rpe !== undefined ? ` ${set.rpe}` : ' not set'}`}
              >
                <Text style={[styles.rpeText, set.rpe !== undefined && styles.rpeTextSet]}>
                  {set.rpe !== undefined ? set.rpe : '—'}
                </Text>
              </Pressable>
              <View style={styles.colDone}>
                <Pressable
                  onPress={() => {
                    store.toggleSetComplete(log.exerciseId, set.id);
                    if (!set.completed) onSetCompleted(log.exerciseId); // unchecking never starts rest
                  }}
                  style={[styles.check, set.completed && styles.checkOn]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: set.completed }}
                  accessibilityLabel={`Set ${set.setNumber} done`}
                  hitSlop={6}
                >
                  {set.completed && <MaterialCommunityIcons name="check" size={18} color={colors.onAccent} />}
                </Pressable>
              </View>
              <Pressable
                style={styles.colDel}
                onPress={() => store.deleteSet(log.exerciseId, set.id)}
                hitSlop={8}
                accessibilityLabel={`Delete set ${set.setNumber}`}
              >
                <MaterialCommunityIcons name="close" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}

          <Pressable
            onPress={() => store.addSet(log.exerciseId)}
            style={styles.addSet}
            accessibilityRole="button"
          >
            <Text style={styles.addSetText}>+ Add Set</Text>
          </Pressable>
        </View>
      )}

      <RpePicker
        visible={rpeSetId !== null}
        value={rpeSet?.rpe}
        onSelect={(rpe) => {
          if (rpeSetId) store.updateSet(log.exerciseId, rpeSetId, { rpe });
          setRpeSetId(null);
        }}
        onClose={() => setRpeSetId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  content: { padding: 16, gap: 12, paddingBottom: 24 },

  timerCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
  },
  timer: { color: colors.accent, fontSize: 44, fontWeight: '800', fontVariant: ['tabular-nums'] },
  stats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { color: colors.textMuted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '700' },
  unitToggle: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: 999, padding: 3 },
  unitBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  unitBtnOn: { backgroundColor: colors.accentAlt },
  unitText: { color: colors.textMuted, fontWeight: '700' },
  unitTextOn: { color: '#fff' },

  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  thumb: { width: 44, height: 44, borderRadius: radius.sm },
  exName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  exMeta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },

  sets: { paddingHorizontal: 12, paddingBottom: 12, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.sm, paddingVertical: 2 },
  rowDone: { backgroundColor: colors.accent + '22' },
  th: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' },
  colSet: { width: 24, textAlign: 'center' },
  colPrev: { width: 60, textAlign: 'center' },
  colWeight: { flex: 1.2 },
  colReps: { flex: 1 },
  colRpe: { width: 36, alignItems: 'center', justifyContent: 'center' },
  colDone: { width: 36, alignItems: 'center' },
  colDel: { width: 20, alignItems: 'center' },
  rpeText: { color: colors.border, fontSize: 14, fontWeight: '700' },
  rpeTextSet: { color: colors.accentAlt },
  setNum: { color: colors.text, fontWeight: '700' },
  prev: { color: colors.textMuted, fontSize: 12 },
  check: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  addSet: {
    marginTop: 4,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  addSetText: { color: colors.accentAlt, fontWeight: '700' },

  addExercise: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.accent,
  },
  addExerciseText: { color: colors.accent, fontWeight: '700', fontSize: 16 },
  discard: { alignItems: 'center', padding: 10 },
  discardText: { color: '#f87171', fontWeight: '600' },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishBtn: { flexDirection: 'row', gap: 8 },
  primaryText: { color: colors.onAccent, fontSize: 16, fontWeight: '800' },
});
