import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExerciseMedia } from '../components/ExerciseMedia';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { getCues } from '../data/exerciseCues';
import { EXERCISES_BY_ID } from '../data/seedData';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, splitColors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetail'>;

export default function ExerciseDetailScreen({ route }: Props) {
  const exercise = EXERCISES_BY_ID[route.params.exerciseId];
  const { hasExercise: has, addExercise: add, removeExercise: remove } = useWorkoutStore();

  if (!exercise) {
    return (
      <View style={[styles.root, styles.missing]}>
        <Text style={styles.muted}>Exercise not found.</Text>
      </View>
    );
  }

  const added = has(exercise.id);
  const accent = splitColors[exercise.category];

  return (
    <SafeAreaView style={styles.root} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ExerciseMedia exerciseId={exercise.id} variant="player" style={styles.hero} />

        <Text style={styles.title}>{exercise.name}</Text>

        <View style={styles.tags}>
          <Tag icon="target" label={exercise.muscleTarget} color={accent} />
          <Tag icon="dumbbell" label={exercise.equipment} color={colors.accentAlt} />
          <Tag icon="calendar-week" label={exercise.category} color={colors.textMuted} />
        </View>

        <Text style={styles.sectionTitle}>Form cues</Text>
        {getCues(exercise.id).map((cue, i) => (
          <View key={i} style={styles.cueRow}>
            <View style={[styles.cueNum, { backgroundColor: accent + '26' }]}>
              <Text style={[styles.cueNumText, { color: accent }]}>{i + 1}</Text>
            </View>
            <Text style={styles.cueText}>{cue}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={() => (added ? remove(exercise.id) : add(exercise.id))}
          style={({ pressed }) => [
            styles.cta,
            added && styles.ctaAdded,
            pressed && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={added ? 'Remove from today\'s workout' : 'Add to today\'s workout'}
        >
          <MaterialCommunityIcons
            name={added ? 'check' : 'plus'}
            size={22}
            color={added ? colors.accent : colors.onAccent}
          />
          <Text style={[styles.ctaText, added && { color: colors.accent }]}>
            {added ? 'Added to Today\'s Workout' : 'Add to Today\'s Workout'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Tag({
  icon,
  label,
  color,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.tag, { borderColor: color + '66' }]}>
      <MaterialCommunityIcons name={icon} size={14} color={color} />
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  missing: { alignItems: 'center', justifyContent: 'center' },
  muted: { color: colors.textMuted },
  content: { padding: 16, gap: 14 },
  hero: { width: '100%', aspectRatio: 3 / 2, borderRadius: radius.lg },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: { fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 6 },
  cueRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  cueNum: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  cueNumText: { fontWeight: '800', fontSize: 13 },
  cueText: { flex: 1, color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
  cta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  ctaAdded: { backgroundColor: 'transparent' },
  ctaText: { color: colors.onAccent, fontSize: 16, fontWeight: '800' },
});
