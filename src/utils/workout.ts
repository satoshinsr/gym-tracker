import { ExerciseLog, SetLog, WeightUnit, WorkoutSession } from '../types';

export const KG_TO_LBS = 2.20462;

export const makeId = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** kg -> value shown in the chosen unit, rounded to 1 decimal. */
export const toDisplayWeight = (kg: number, unit: WeightUnit): number => {
  const v = unit === 'kg' ? kg : kg * KG_TO_LBS;
  return Math.round(v * 10) / 10;
};

export const fromDisplayWeight = (value: number, unit: WeightUnit): number =>
  unit === 'kg' ? value : value / KG_TO_LBS;

/** Effective load of a set: barbell/machine weight plus any weight added to a bodyweight lift. */
export const setLoadKg = (s: Pick<SetLog, 'weightKg' | 'addedWeightKg'>): number =>
  s.weightKg + (s.addedWeightKg ?? 0);

export const totalVolumeKg = (exercises: ExerciseLog[]): number =>
  exercises.reduce(
    (sum, e) => sum + e.sets.reduce((s, set) => s + (set.completed ? setLoadKg(set) * set.reps : 0), 0),
    0,
  );

export const completedSetCount = (exercises: ExerciseLog[]): number =>
  exercises.reduce((n, e) => n + e.sets.filter((s) => s.completed).length, 0);

/** Heaviest completed set (by effective load) across history; ties, including unweighted bodyweight sets, go to more reps. */
export function bestSetFor(history: WorkoutSession[], exerciseId: string): SetLog | undefined {
  let best: SetLog | undefined;
  for (const session of history) {
    for (const log of session.exercises) {
      if (log.exerciseId !== exerciseId) continue;
      for (const s of log.sets) {
        if (!s.completed) continue;
        const load = setLoadKg(s);
        const bestLoad = best ? setLoadKg(best) : 0;
        if (!best || load > bestLoad || (load === bestLoad && s.reps > best.reps)) {
          best = s;
        }
      }
    }
  }
  return best;
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

const withThousands = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatVolume = (kg: number, unit: WeightUnit): string =>
  `${withThousands(Math.round(toDisplayWeight(kg, unit)))} ${unit}`;

/** Compact "weight × reps"; bodyweight lifts read "BW × 8" or "+10 × 8". */
export const formatSetBrief = (set: SetLog, unit: WeightUnit, bodyweight = false): string => {
  const load = toDisplayWeight(setLoadKg(set), unit);
  const w = bodyweight ? (load > 0 ? `+${load}` : 'BW') : String(load);
  return `${w} × ${set.reps}`;
};

/** Full line for history: "+10 kg × 8 @ RPE 8.5" or "Bodyweight × 12". */
export const formatSetLine = (set: SetLog, unit: WeightUnit, bodyweight = false): string => {
  const load = toDisplayWeight(setLoadKg(set), unit);
  const w = bodyweight ? (load > 0 ? `+${load} ${unit}` : 'Bodyweight') : `${load} ${unit}`;
  return `${w} × ${set.reps}${set.rpe !== undefined ? ` @ RPE ${set.rpe}` : ''}`;
};
