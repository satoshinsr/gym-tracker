import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, splitColors, splitIcons } from '../theme';
import { SplitType } from '../types';
import { useWorkoutStore } from '../hooks/useWorkoutStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const SPLITS: SplitType[] = ['Push', 'Pull', 'Legs'];

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function HomeScreen({ navigation }: Props) {
  const { active, history, startWorkout } = useWorkoutStore();

  const lastBySplit = useMemo(() => {
    const latest: Partial<Record<SplitType, string>> = {};
    for (const s of history) {
      const prev = latest[s.splitType];
      if (!prev || s.date > prev) latest[s.splitType] = s.date;
    }
    return latest;
  }, [history]);

  const onStart = (split: SplitType) => {
    if (active && active.splitType !== split) {
      Alert.alert(
        'Workout in progress',
        `You already have a ${active.splitType} workout running. Finish or discard it first.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Resume it', onPress: () => navigation.navigate('ActiveWorkout') },
        ],
      );
      return;
    }
    startWorkout(split);
    navigation.navigate('ActiveWorkout');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ready to lift?</Text>
        <Text style={styles.subtitle}>Pick today's split</Text>

        {active && (
          <Pressable
            style={styles.banner}
            onPress={() => navigation.navigate('ActiveWorkout')}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="timer-outline" size={20} color={colors.accent} />
            <Text style={[styles.bannerText, { flex: 1 }]}>
              {active.splitType} workout in progress · {active.exercises.length} exercise
              {active.exercises.length === 1 ? '' : 's'}
            </Text>
            <Text style={{ color: colors.accent, fontWeight: '800' }}>Resume</Text>
          </Pressable>
        )}

        {SPLITS.map((split) => {
          const color = splitColors[split];
          const last = lastBySplit[split];
          return (
            <Pressable
              key={split}
              onPress={() => navigation.navigate('ExerciseList', { split })}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`${split} day`}
            >
              <View style={[styles.iconWrap, { backgroundColor: color + '26' }]}>
                <MaterialCommunityIcons name={splitIcons[split]} size={30} color={color} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{split}</Text>
                <Text style={styles.cardMeta}>
                  {last ? `Last workout: ${formatDate(last)}` : 'No workouts yet'}
                </Text>
              </View>
              <Pressable
                onPress={() => onStart(split)}
                style={[styles.startBtn, { backgroundColor: color }]}
                accessibilityRole="button"
                accessibilityLabel={`Start ${split} workout`}
              >
                <Text style={styles.startText}>Start</Text>
              </Pressable>
            </Pressable>
          );
        })}

        <View style={styles.linkRow}>
          <Pressable
            style={styles.linkBtn}
            onPress={() => navigation.navigate('History')}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="history" size={22} color={colors.accentAlt} />
            <Text style={styles.linkText}>History</Text>
          </Pressable>
          <Pressable
            style={styles.linkBtn}
            onPress={() => navigation.navigate('ExerciseProgress')}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="chart-line" size={22} color={colors.accent} />
            <Text style={styles.linkText}>Progress</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 14 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 16, marginBottom: 6 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
  },
  bannerText: { color: colors.text, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 16,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  iconWrap: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1 },
  cardTitle: { color: colors.text, fontSize: 22, fontWeight: '700' },
  cardMeta: { color: colors.textMuted, marginTop: 2 },
  startBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  linkRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  linkBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  linkText: { color: colors.text, fontWeight: '700' },
  startText: { color: '#04130d', fontWeight: '800' },
});
