import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

interface Props {
  visible: boolean;
  value?: number;
  /** undefined clears the RPE */
  onSelect: (rpe: number | undefined) => void;
  onClose: () => void;
}

export const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10] as const;

/** Small bottom sheet to pick RPE 6 to 10 in 0.5 steps. */
export function RpePicker({ visible, value, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close RPE picker" />
      <View style={styles.sheet}>
        <Text style={styles.title}>Rate of perceived exertion</Text>
        <Text style={styles.hint}>6 = 4 reps left · 8 = 2 reps left · 10 = max effort</Text>
        <View style={styles.grid}>
          {RPE_VALUES.map((v) => (
            <Pressable
              key={v}
              onPress={() => onSelect(v)}
              style={[styles.chip, value === v && styles.chipOn]}
              accessibilityRole="button"
              accessibilityState={{ selected: value === v }}
              accessibilityLabel={`RPE ${v}`}
            >
              <Text style={[styles.chipText, value === v && styles.chipTextOn]}>{v}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={() => onSelect(undefined)} style={styles.clear} accessibilityRole="button">
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(2,6,23,0.6)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  title: { color: colors.text, fontSize: 17, fontWeight: '800' },
  hint: { color: colors.textMuted, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    width: '18%',
    flexGrow: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text, fontWeight: '800', fontSize: 16 },
  chipTextOn: { color: colors.onAccent },
  clear: { alignItems: 'center', paddingVertical: 12, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  clearText: { color: colors.textMuted, fontWeight: '700' },
});
