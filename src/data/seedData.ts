import { Exercise, SplitType } from '../types';
import { EXERCISE_MEDIA } from './exerciseMedia';

interface Flags {
  /** Body weight is part of the load; the logged weight is the added weight. */
  bodyweight?: boolean;
  /** Multi-joint lift: 90s default rest instead of 60s. */
  compound?: boolean;
}

/** Illustrations are looked up by exercise id in components/exercise-illustrations. */
const ex = (
  id: string,
  name: string,
  category: SplitType,
  muscleTarget: string,
  equipment: string,
  { bodyweight, compound }: Flags = {},
): Exercise => ({
  id,
  name,
  category,
  muscleTarget,
  equipment,
  ...(bodyweight && { isBodyweight: true }),
  ...(compound && { isCompound: true }),
  ...EXERCISE_MEDIA[id], // animationUri / thumbnailUri when a demo exists
});

const C: Flags = { compound: true };
const BW_C: Flags = { bodyweight: true, compound: true };

export const EXERCISES: Exercise[] = [
  // ───────────── PUSH ─────────────
  // Chest
  ex('push-bench-press', 'Barbell Bench Press', 'Push', 'Chest', 'Barbell', C),
  ex('push-incline-bench-press', 'Incline Barbell Bench Press', 'Push', 'Upper Chest', 'Barbell', C),
  ex('push-decline-bench-press', 'Decline Barbell Bench Press', 'Push', 'Lower Chest', 'Barbell', C),
  ex('push-db-bench-press', 'Dumbbell Bench Press', 'Push', 'Chest', 'Dumbbells', C),
  ex('push-incline-db-press', 'Incline Dumbbell Press', 'Push', 'Upper Chest', 'Dumbbells', C),
  ex('push-cable-fly-high-low', 'Cable Fly (High-to-Low)', 'Push', 'Lower Chest', 'Cable'),
  ex('push-cable-fly-low-high', 'Cable Fly (Low-to-High)', 'Push', 'Upper Chest', 'Cable'),
  ex('push-pec-deck', 'Pec Deck', 'Push', 'Chest', 'Machine'),
  ex('push-dips', 'Chest Dips', 'Push', 'Chest / Triceps', 'Bodyweight', BW_C),
  ex('push-pushups', 'Push-Up', 'Push', 'Chest / Triceps', 'Bodyweight', BW_C),
  // Shoulders
  ex('push-overhead-press', 'Overhead Barbell Press', 'Push', 'Shoulders', 'Barbell', C),
  ex('push-seated-db-press', 'Seated Dumbbell Shoulder Press', 'Push', 'Shoulders', 'Dumbbells', C),
  ex('push-arnold-press', 'Arnold Press', 'Push', 'Shoulders', 'Dumbbells', C),
  ex('push-lateral-raise', 'Dumbbell Lateral Raise', 'Push', 'Side Delts', 'Dumbbells'),
  ex('push-cable-lateral-raise', 'Cable Lateral Raise', 'Push', 'Side Delts', 'Cable'),
  ex('push-machine-lateral-raise', 'Machine Lateral Raise', 'Push', 'Side Delts', 'Machine'),
  ex('push-front-raise', 'Dumbbell Front Raise', 'Push', 'Front Delts', 'Dumbbells'),
  // Triceps
  ex('push-tricep-pushdown', 'Tricep Rope Pushdown', 'Push', 'Triceps', 'Cable'),
  ex('push-straight-bar-pushdown', 'Straight-Bar Pushdown', 'Push', 'Triceps', 'Cable'),
  ex('push-skull-crushers', 'Skull Crushers', 'Push', 'Triceps', 'EZ Bar'),
  ex('push-overhead-cable-extension', 'Overhead Cable Triceps Extension', 'Push', 'Triceps (Long Head)', 'Cable'),
  ex('push-close-grip-bench', 'Close-Grip Bench Press', 'Push', 'Triceps / Chest', 'Barbell', C),

  // ───────────── PULL ─────────────
  // Back (vertical)
  ex('pull-pullup', 'Pull-Up', 'Pull', 'Lats', 'Bodyweight', BW_C),
  ex('pull-chinup', 'Chin-Up', 'Pull', 'Lats / Biceps', 'Bodyweight', BW_C),
  ex('pull-lat-pulldown', 'Wide-Grip Lat Pulldown', 'Pull', 'Lats', 'Cable', C),
  ex('pull-close-grip-pulldown', 'Close-Grip (V-Bar) Pulldown', 'Pull', 'Lats', 'Cable', C),
  ex('pull-straight-arm-pulldown', 'Straight-Arm Pulldown', 'Pull', 'Lats', 'Cable'),
  // Back (horizontal)
  ex('pull-barbell-row', 'Barbell Bent-Over Row', 'Pull', 'Mid Back', 'Barbell', C),
  ex('pull-db-row', 'Dumbbell Single-Arm Row', 'Pull', 'Lats / Mid Back', 'Dumbbells', C),
  ex('pull-seated-cable-row', 'Seated Cable Row', 'Pull', 'Mid Back', 'Cable', C),
  ex('pull-tbar-row', 'Chest-Supported T-Bar Row', 'Pull', 'Mid Back', 'Barbell', C),
  ex('pull-machine-row', 'Chest-Supported Machine Row', 'Pull', 'Mid Back', 'Machine', C),
  // Rear delts & traps
  ex('pull-face-pull', 'Face Pull', 'Pull', 'Rear Delts', 'Cable'),
  ex('pull-reverse-pec-deck', 'Reverse Pec Deck', 'Pull', 'Rear Delts', 'Machine'),
  ex('pull-barbell-shrug', 'Barbell Shrug', 'Pull', 'Traps', 'Barbell'),
  ex('pull-dumbbell-shrug', 'Dumbbell Shrug', 'Pull', 'Traps', 'Dumbbells'),
  // Biceps
  ex('pull-barbell-curl', 'Barbell Bicep Curl', 'Pull', 'Biceps', 'Barbell'),
  ex('pull-incline-db-curl', 'Incline Dumbbell Curl', 'Pull', 'Biceps (Long Head)', 'Dumbbells'),
  ex('pull-hammer-curl', 'Hammer Curl', 'Pull', 'Brachialis / Biceps', 'Dumbbells'),
  ex('pull-preacher-curl', 'Preacher Curl', 'Pull', 'Biceps (Short Head)', 'EZ Bar'),
  ex('pull-cable-curl', 'Cable Bicep Curl', 'Pull', 'Biceps', 'Cable'),

  // ───────────── LEGS ─────────────
  // Quads
  ex('legs-squat', 'Barbell Back Squat', 'Legs', 'Quads / Glutes', 'Barbell', C),
  ex('legs-front-squat', 'Front Squat', 'Legs', 'Quads', 'Barbell', C),
  ex('legs-goblet-squat', 'Goblet Squat', 'Legs', 'Quads / Glutes', 'Dumbbells', C),
  ex('legs-leg-press', 'Leg Press', 'Legs', 'Quads', 'Machine', C),
  ex('legs-hack-squat', 'Hack Squat', 'Legs', 'Quads', 'Machine', C),
  ex('legs-leg-extension', 'Leg Extension', 'Legs', 'Quads', 'Machine'),
  ex('legs-bulgarian-split-squat', 'Bulgarian Split Squat', 'Legs', 'Quads / Glutes', 'Dumbbells', C),
  ex('legs-lunge', 'Walking Lunge', 'Legs', 'Quads / Glutes', 'Dumbbells', C),
  ex('legs-step-up', 'Dumbbell Step-Up', 'Legs', 'Quads / Glutes', 'Dumbbells', C),
  // Hamstrings
  ex('legs-rdl', 'Romanian Deadlift', 'Legs', 'Hamstrings', 'Barbell', C),
  // Kept under its original id so logged history still resolves; it lives in Legs now.
  ex('pull-deadlift', 'Conventional Deadlift', 'Legs', 'Hamstrings / Back', 'Barbell', C),
  ex('legs-seated-leg-curl', 'Seated Leg Curl', 'Legs', 'Hamstrings', 'Machine'),
  ex('legs-leg-curl', 'Lying Leg Curl', 'Legs', 'Hamstrings', 'Machine'),
  // Glutes & calves
  ex('legs-hip-thrust', 'Barbell Hip Thrust', 'Legs', 'Glutes', 'Barbell', C),
  ex('legs-cable-kickback', 'Cable Glute Kickback', 'Legs', 'Glutes', 'Cable'),
  ex('legs-hip-abduction', 'Hip Abduction Machine', 'Legs', 'Glute Medius', 'Machine'),
  ex('legs-calf-raise', 'Standing Calf Raise', 'Legs', 'Calves', 'Machine'),
  ex('legs-seated-calf-raise', 'Seated Calf Raise', 'Legs', 'Calves (Soleus)', 'Machine'),
];

export const EXERCISES_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e]),
);

// Fail fast on a copy-paste mistake rather than silently shadowing an exercise.
if (Object.keys(EXERCISES_BY_ID).length !== EXERCISES.length) {
  throw new Error('seedData: duplicate exercise id');
}

export const COMPOUND_REST_SECONDS = 90;
export const ISOLATION_REST_SECONDS = 60;

/** 90s after compound lifts, 60s after isolation work (see Exercise.isCompound). */
export const defaultRestSeconds = (exerciseId: string): number =>
  EXERCISES_BY_ID[exerciseId]?.isCompound ? COMPOUND_REST_SECONDS : ISOLATION_REST_SECONDS;

export const getExercisesByCategory = (c: SplitType): Exercise[] =>
  EXERCISES.filter((e) => e.category === c);
