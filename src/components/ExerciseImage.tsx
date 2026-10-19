import React from 'react';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import { getIllustration } from './exercise-illustrations';
import { EXERCISES_BY_ID } from '../data/seedData';
import { colors, splitColors } from '../theme';

interface Props {
  exerciseId: string;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Offline exercise illustration. Rendered synchronously from bundled SVG, so there
 * is no network request, loading state or flicker. Unknown ids get a generic dumbbell.
 */
export function ExerciseImage({ exerciseId, width, height, borderRadius, style }: Props) {
  const exercise = EXERCISES_BY_ID[exerciseId];
  const Illustration = getIllustration(exerciseId, exercise?.equipment);
  const category = exercise?.category;
  const accent = category ? splitColors[category] : colors.accent;

  return (
    <View
      style={[
        { backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
        width !== undefined && { width },
        height !== undefined && { height },
        borderRadius !== undefined && { borderRadius },
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Illustration accent={accent} />
    </View>
  );
}
