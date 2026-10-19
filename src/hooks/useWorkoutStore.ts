import { createContext, createElement, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EXERCISES_BY_ID } from '../data/seedData';
import {
  clearActive,
  loadActive,
  loadSessions,
  loadUnit,
  saveActive,
  saveSession,
  saveUnit,
} from '../storage/workoutStorage';
import { ActiveWorkout, ExerciseLog, SetLog, SplitType, WeightUnit, WorkoutSession } from '../types';
import { bestSetFor, makeId } from '../utils/workout';

export interface WorkoutStore {
  /** false until storage has been read; avoid rendering workout UI before then */
  ready: boolean;
  active: ActiveWorkout | null;
  history: WorkoutSession[];
  unit: WeightUnit;
  setUnit: (unit: WeightUnit) => void;

  startWorkout: (split: SplitType) => void;
  discardWorkout: () => void;
  /** Saves completed sets only. Resolves null if there was nothing completed to save. */
  finishWorkout: () => Promise<WorkoutSession | null>;

  /** Starts a workout automatically if none is active. */
  addExercise: (exerciseId: string) => void;
  removeExercise: (exerciseId: string) => void;
  hasExercise: (exerciseId: string) => boolean;

  addSet: (exerciseId: string) => void;
  updateSet: (
    exerciseId: string,
    setId: string,
    patch: Partial<Pick<SetLog, 'reps' | 'weightKg' | 'addedWeightKg' | 'rpe'>>,
  ) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;

  getBestSet: (exerciseId: string) => SetLog | undefined;
}

const Ctx = createContext<WorkoutStore | null>(null);

/** New uncompleted set, optionally pre-filled from a template (RPE is never copied). */
const newSet = (
  setNumber: number,
  from?: Pick<SetLog, 'weightKg' | 'addedWeightKg' | 'reps'>,
): SetLog => ({
  id: makeId(),
  setNumber,
  reps: from?.reps ?? 0,
  weightKg: from?.weightKg ?? 0,
  ...(from?.addedWeightKg ? { addedWeightKg: from.addedWeightKg } : {}),
  completed: false,
});

const renumber = (sets: SetLog[]): SetLog[] => sets.map((s, i) => ({ ...s, setNumber: i + 1 }));

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<ActiveWorkout | null>(null);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [unit, setUnitState] = useState<WeightUnit>('kg');

  // Hydrate from AsyncStorage once.
  useEffect(() => {
    let cancelled = false;
    Promise.all([loadSessions(), loadActive(), loadUnit()])
      .then(([sessions, act, u]) => {
        if (cancelled) return;
        setHistory(sessions);
        setActive(act);
        setUnitState(u);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist the in-progress workout so a crash or app kill doesn't lose it.
  useEffect(() => {
    if (!ready) return;
    (active ? saveActive(active) : clearActive()).catch(() => undefined);
  }, [active, ready]);

  const setUnit = useCallback((u: WeightUnit) => {
    setUnitState(u);
    saveUnit(u).catch(() => undefined);
  }, []);

  const startWorkout = useCallback((split: SplitType) => {
    setActive((prev) => prev ?? { id: makeId(), splitType: split, startedAt: Date.now(), exercises: [] });
  }, []);

  const discardWorkout = useCallback(() => setActive(null), []);

  const finishWorkout = useCallback(async (): Promise<WorkoutSession | null> => {
    if (!active) return null;
    const exercises: ExerciseLog[] = active.exercises
      .map((e) => ({ ...e, sets: renumber(e.sets.filter((s) => s.completed)) }))
      .filter((e) => e.sets.length > 0);
    if (exercises.length === 0) return null;

    const session: WorkoutSession = {
      id: active.id,
      date: new Date(active.startedAt).toISOString(),
      splitType: active.splitType,
      exercises,
      durationSeconds: Math.round((Date.now() - active.startedAt) / 1000),
    };
    await saveSession(session);
    setHistory((h) => [...h.filter((x) => x.id !== session.id), session]);
    setActive(null);
    return session;
  }, [active]);

  const addExercise = useCallback(
    (exerciseId: string) => {
      const exercise = EXERCISES_BY_ID[exerciseId];
      if (!exercise) return;
      setActive((prev) => {
        const base: ActiveWorkout =
          prev ?? { id: makeId(), splitType: exercise.category, startedAt: Date.now(), exercises: [] };
        if (base.exercises.some((e) => e.exerciseId === exerciseId)) return base;
        // Pre-fill the first set from the last best so progression is one tap away.
        const best = bestSetFor(history, exerciseId);
        const log: ExerciseLog = {
          exerciseId,
          sets: [newSet(1, best)],
        };
        return { ...base, exercises: [...base.exercises, log] };
      });
    },
    [history],
  );

  const mapExercise = useCallback((exerciseId: string, fn: (e: ExerciseLog) => ExerciseLog) => {
    setActive((prev) =>
      prev
        ? { ...prev, exercises: prev.exercises.map((e) => (e.exerciseId === exerciseId ? fn(e) : e)) }
        : prev,
    );
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
    setActive((prev) =>
      prev ? { ...prev, exercises: prev.exercises.filter((e) => e.exerciseId !== exerciseId) } : prev,
    );
  }, []);

  const hasExercise = useCallback(
    (exerciseId: string) => !!active?.exercises.some((e) => e.exerciseId === exerciseId),
    [active],
  );

  const addSet = useCallback(
    (exerciseId: string) => {
      const best = bestSetFor(history, exerciseId);
      mapExercise(exerciseId, (e) => {
        const last = e.sets[e.sets.length - 1];
        const next = newSet(e.sets.length + 1, last ?? best);
        return { ...e, sets: [...e.sets, next] };
      });
    },
    [history, mapExercise],
  );

  const updateSet = useCallback<WorkoutStore['updateSet']>(
    (exerciseId, setId, patch) =>
      mapExercise(exerciseId, (e) => ({
        ...e,
        sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)),
      })),
    [mapExercise],
  );

  const deleteSet = useCallback(
    (exerciseId: string, setId: string) =>
      mapExercise(exerciseId, (e) => ({ ...e, sets: renumber(e.sets.filter((s) => s.id !== setId)) })),
    [mapExercise],
  );

  const toggleSetComplete = useCallback(
    (exerciseId: string, setId: string) =>
      mapExercise(exerciseId, (e) => ({
        ...e,
        sets: e.sets.map((s) => (s.id === setId ? { ...s, completed: !s.completed } : s)),
      })),
    [mapExercise],
  );

  const getBestSet = useCallback((exerciseId: string) => bestSetFor(history, exerciseId), [history]);

  const value = useMemo<WorkoutStore>(
    () => ({
      ready,
      active,
      history,
      unit,
      setUnit,
      startWorkout,
      discardWorkout,
      finishWorkout,
      addExercise,
      removeExercise,
      hasExercise,
      addSet,
      updateSet,
      deleteSet,
      toggleSetComplete,
      getBestSet,
    }),
    [
      ready, active, history, unit, setUnit, startWorkout, discardWorkout, finishWorkout, addExercise,
      removeExercise, hasExercise, addSet, updateSet, deleteSet, toggleSetComplete, getBestSet,
    ],
  );

  return createElement(Ctx.Provider, { value }, children);
}

export function useWorkoutStore(): WorkoutStore {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWorkoutStore must be used inside <WorkoutProvider>');
  return v;
}
