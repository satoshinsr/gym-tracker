import React, { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExerciseMedia } from '../components/ExerciseMedia';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { getExercisesByCategory } from '../data/seedData';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, splitColors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseList'>;

export default function ExerciseListScreen({ navigation, route }: Props) {
  const { split } = route.params;
  const [query, setQuery] = useState('');
  const { hasExercise: has } = useWorkoutStore();
  const accent = splitColors[split];

  useLayoutEffect(() => {
    navigation.setOptions({ title: `${split} Day` });
  }, [navigation, split]);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = getExercisesByCategory(split);
    if (!q) return all;
    return all.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.muscleTarget.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q),
    );
  }, [query, split]);

  return (
    <SafeAreaView style={styles.root} edges={['left', 'right', 'bottom']}>
      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={22} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search exercise, muscle or equipment"
          placeholderTextColor={colors.textMuted}
          style={styles.search}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search exercises"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
            <MaterialCommunityIcons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={data}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.empty}>No exercises match "{query}".</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id })}
            style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel={item.name}
          >
            <ExerciseMedia exerciseId={item.id} variant="thumb" style={styles.thumb} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={[styles.chip, { backgroundColor: accent + '26' }]}>
                <Text style={[styles.chipText, { color: accent }]}>{item.muscleTarget}</Text>
              </View>
            </View>
            {has(item.id) ? (
              <MaterialCommunityIcons name="check-circle" size={22} color={colors.accent} />
            ) : (
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMuted} />
            )}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  search: { flex: 1, color: colors.text, paddingVertical: 12, fontSize: 16 },
  list: { padding: 16, paddingTop: 8, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  thumb: { width: 68, height: 68, borderRadius: radius.sm },
  info: { flex: 1, gap: 6, alignItems: 'flex-start' },
  name: { color: colors.text, fontSize: 17, fontWeight: '700' },
  chip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  chipText: { fontSize: 12, fontWeight: '700' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 40 },
});
