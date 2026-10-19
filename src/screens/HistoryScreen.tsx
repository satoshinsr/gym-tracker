import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EXERCISES_BY_ID } from '../data/seedData';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, splitColors } from '../theme';
import { WeightUnit, WorkoutSession } from '../types';
import { ExportFormat, exportWorkoutData } from '../utils/exportData';
import { dayKey, formatDayHeading, formatTime } from '../utils/progress';
import {
  completedSetCount,
  formatDuration,
  formatSetLine,
  formatVolume,
  totalVolumeKg,
} from '../utils/workout';

interface Section {
  key: string;
  title: string;
  data: WorkoutSession[];
}

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function HistoryScreen({ navigation }: Props) {
  const { history, unit } = useWorkoutStore();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const runExport = useCallback(async (format: ExportFormat) => {
    try {
      const result = await exportWorkoutData(format);
      if (result === 'empty') Alert.alert('Nothing to export', 'Finish a workout first, then back it up here.');
      else if (result === 'unavailable') Alert.alert('Sharing unavailable', 'This device cannot open the share sheet.');
    } catch {
      Alert.alert('Export failed', 'Could not create the backup file. Please try again.');
    }
  }, []);

  const chooseExport = useCallback(() => {
    Alert.alert('Backup / Export Data', 'JSON keeps everything for backup. CSV opens in Excel or Numbers.', [
      { text: 'Export JSON', onPress: () => runExport('json') },
      { text: 'Export CSV', onPress: () => runExport('csv') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [runExport]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={chooseExport}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Backup or export data"
        >
          <MaterialCommunityIcons name="export-variant" size={24} color={colors.textMuted} />
        </Pressable>
      ),
    });
  }, [navigation, chooseExport]);

  const sections = useMemo<Section[]>(() => {
    const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
    const out: Section[] = [];
    for (const s of sorted) {
      const key = dayKey(s.date);
      const last = out[out.length - 1];
      if (last && last.key === key) last.data.push(s);
      else out.push({ key, title: formatDayHeading(s.date), data: [s] });
    }
    return out;
  }, [history]);

  return (
    <SafeAreaView style={styles.root} edges={['left', 'right', 'bottom']}>
      <SectionList
        sections={sections}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="history" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptyText}>Finish a workout and it will show up here.</Text>
          </View>
        }
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        renderItem={({ item }) => (
          <HistoryCard
            session={item}
            unit={unit}
            expanded={!!open[item.id]}
            onToggle={() => setOpen((p) => ({ ...p, [item.id]: !p[item.id] }))}
          />
        )}
      />
    </SafeAreaView>
  );
}

function HistoryCard({
  session,
  unit,
  expanded,
  onToggle,
}: {
  session: WorkoutSession;
  unit: WeightUnit;
  expanded: boolean;
  onToggle: () => void;
}) {
  const color = splitColors[session.splitType];
  const volume = totalVolumeKg(session.exercises);
  const sets = completedSetCount(session.exercises);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onToggle}
        style={styles.cardHeader}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${session.splitType} workout, ${sets} sets, ${formatVolume(volume, unit)}`}
      >
        <View style={[styles.chip, { backgroundColor: color + '26' }]}>
          <Text style={[styles.chipText, { color }]}>{session.splitType}</Text>
        </View>
        <View style={styles.stats}>
          <Stat label="Volume" value={formatVolume(volume, unit)} />
          <Stat label="Sets" value={String(sets)} />
          {session.durationSeconds !== undefined && (
            <Stat label="Time" value={formatDuration(session.durationSeconds)} />
          )}
        </View>
        <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.textMuted} />
      </Pressable>

      {expanded && (
        <View style={styles.detail}>
          <Text style={styles.time}>Started {formatTime(session.date)}</Text>
          {session.exercises.map((log) => (
            <View key={log.exerciseId} style={styles.exBlock}>
              <Text style={styles.exName}>{EXERCISES_BY_ID[log.exerciseId]?.name ?? 'Unknown exercise'}</Text>
              {log.sets.map((s) => (
                <View key={s.id} style={styles.setRow}>
                  <Text style={styles.setNum}>Set {s.setNumber}</Text>
                  <Text style={styles.setVal}>
                    {formatSetLine(s, unit, EXERCISES_BY_ID[log.exerciseId]?.isBodyweight)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, paddingBottom: 32, flexGrow: 1 },
  sectionTitle: { color: colors.textMuted, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginTop: 12, marginBottom: 8 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  chipText: { fontWeight: '800' },
  stats: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  statLabel: { color: colors.textMuted, fontSize: 11, textTransform: 'uppercase' },
  statValue: { color: colors.text, fontSize: 15, fontWeight: '700' },
  detail: { paddingHorizontal: 14, paddingBottom: 14, gap: 12, borderTopWidth: 1, borderTopColor: colors.border },
  time: { color: colors.textMuted, fontSize: 12, marginTop: 10 },
  exBlock: { gap: 4 },
  exName: { color: colors.text, fontWeight: '700', fontSize: 15 },
  setRow: { flexDirection: 'row', justifyContent: 'space-between' },
  setNum: { color: colors.textMuted },
  setVal: { color: colors.text, fontWeight: '600' },
  emptyWrap: { alignItems: 'center', marginTop: 80, gap: 8 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  emptyText: { color: colors.textMuted },
});
