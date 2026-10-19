export type SplitType = 'Push' | 'Pull' | 'Legs';

/** A remote https URL, or a bundled asset from require('./file.gif'). */
export type MediaSource = string | number;

export interface ExerciseMediaEntry {
  /** Looping demonstration (GIF / animated WebP / APNG). */
  animationUri?: MediaSource;
  /** Small static first frame for lists. */
  thumbnailUri?: MediaSource;
}

export interface Exercise extends ExerciseMediaEntry {
  id: string;
  name: string;
  category: SplitType;
  muscleTarget: string;
  equipment: string;
  /** Body weight is part of the load (pull-ups, dips); logged weight is the added weight. */
  isBodyweight?: boolean;
  /** Multi-joint lift; drives the default rest (90s compound vs 60s isolation). */
  isCompound?: boolean;
}

export interface SetLog {
  id: string;
  setNumber: number;
  reps: number;
  /** Barbell/machine load. For bodyweight exercises this stays 0; see addedWeightKg. */
  weightKg: number;
  /** Extra weight on a bodyweight exercise (belt, vest); 0 or undefined = unweighted. */
  addedWeightKg?: number;
  /** Rate of perceived exertion, 6 to 10 in 0.5 steps. */
  rpe?: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  notes?: string;
}

export type WeightUnit = 'kg' | 'lbs';

/** A workout in progress. Weights are always stored in kg (see SetLog). */
export interface ActiveWorkout {
  id: string;
  splitType: SplitType;
  /** epoch ms; the timer is derived from this so it survives app restarts */
  startedAt: number;
  exercises: ExerciseLog[];
}

export interface WorkoutSession {
  id: string;
  /** ISO 8601 timestamp */
  date: string;
  splitType: SplitType;
  exercises: ExerciseLog[];
  durationSeconds?: number;
}
