import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EXERCISES } from '../data/seedData';
import { colors, radius, splitColors } from '../theme';
import { Exercise } from '../types';

interface Props {
  visible: boolean;
  selectedId?: string;
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

/** Full-screen searchable list of every exercise in the database. */
export function ExercisePicker({ visible, selectedId, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EXERCISES;
    return EXERCISES.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.muscleTarget.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q),
    );
  }, [query]);

  const close = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose exercise</Text>
          <Pressable onPress={close} hitSlop={10} accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={26} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={22} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name, muscle or split"
            placeholderTextColor={colors.textMuted}
            style={styles.search}
            autoCorrect={false}
          />
        </View>
        <FlatList
          data={data}
          keyExtractor={(e) => e.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 8 }}
          ListEmptyComponent={<Text style={styles.empty}>No exercises match.</Text>}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setQuery('');
                onSelect(item);
              }}
              style={[styles.row, item.id === selectedId && { borderColor: colors.accent }]}
              accessibilityRole="button"
            >
              <View style={[styles.dot, { backgroundColor: splitColors[item.category] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.category} · {item.muscleTarget}
                </Text>
              </View>
              {item.id === selectedId && <MaterialCommunityIcons name="check" size={20} color={colors.accent} />}
            </Pressable>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  search: { flex: 1, color: colors.text, paddingVertical: 12, fontSize: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { color: colors.text, fontSize: 16, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 40 },
});
