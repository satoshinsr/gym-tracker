import { EXERCISES_BY_ID } from '../data/seedData';
import { WorkoutSession } from '../types';
import { setLoadKg } from './workout';

/**
 * Epley estimated 1RM: weight * (1 + reps / 30).
 * A single rep is already a 1RM, so it is returned as-is.
 */
export const epley = (weight: number, reps: number): number =>
  reps <= 1 ? weight : weight * (1 + reps / 30);

export interface ExerciseSessionStat {
  sessionId: string;
  date: string;
  /** Heaviest effective load (for bodyweight lifts: the heaviest added weight, 0 if unweighted). */
  maxWeightKg: number;
  volumeKg: number;
  /** Estimated 1RM of the (added) load; 0 when no weight was used. */
  e1rmKg: number;
  totalReps: number;
  maxReps: number;
}

export interface ExerciseRecords {
  /** Best set by load, then reps. For unweighted bodyweight work this is simply the most reps (weightKg 0). */
  pr?: { weightKg: number; reps: number; date: string };
  /** Only set when a weighted set exists. */
  e1rm?: { valueKg: number; weightKg: number; reps: number; date: string };
  /** Lifetime reps across completed sets; the headline number for unweighted bodyweight exercises. */
  totalReps: number;
}

/**
 * A completed set counts when it has reps and either carries load or belongs to a
 * bodyweight exercise (where zero added weight is a valid, rep-tracked set).
 */
const countsToward = (bodyweight: boolean, completed: boolean, reps: number, load: number): boolean =>
  completed && reps > 0 && (load > 0 || bodyweight);

/** One entry per session that contains qualifying sets of the exercise (oldest first). */
export function getExerciseStats(history: WorkoutSession[], exerciseId: string): ExerciseSessionStat[] {
  const bodyweight = !!EXERCISES_BY_ID[exerciseId]?.isBodyweight;
  const stats: ExerciseSessionStat[] = [];
  for (const session of history) {
    let maxWeightKg = 0;
    let volumeKg = 0;
    let e1rmKg = 0;
    let totalReps = 0;
    let maxReps = 0;
    for (const log of session.exercises) {
      if (log.exerciseId !== exerciseId) continue;
      for (const s of log.sets) {
        const load = setLoadKg(s);
        if (!countsToward(bodyweight, s.completed, s.reps, load)) continue;
        maxWeightKg = Math.max(maxWeightKg, load);
        volumeKg += load * s.reps;
        if (load > 0) e1rmKg = Math.max(e1rmKg, epley(load, s.reps));
        totalReps += s.reps;
        maxReps = Math.max(maxReps, s.reps);
      }
    }
    if (totalReps > 0) {
      stats.push({ sessionId: session.id, date: session.date, maxWeightKg, volumeKg, e1rmKg, totalReps, maxReps });
    }
  }
  return stats.sort((a, b) => a.date.localeCompare(b.date));
}

export function getExerciseRecords(history: WorkoutSession[], exerciseId: string): ExerciseRecords {
  const bodyweight = !!EXERCISES_BY_ID[exerciseId]?.isBodyweight;
  const out: ExerciseRecords = { totalReps: 0 };
  for (const session of history) {
    for (const log of session.exercises) {
      if (log.exerciseId !== exerciseId) continue;
      for (const s of log.sets) {
        const load = setLoadKg(s);
        if (!countsToward(bodyweight, s.completed, s.reps, load)) continue;
        out.totalReps += s.reps;
        if (!out.pr || load > out.pr.weightKg || (load === out.pr.weightKg && s.reps > out.pr.reps)) {
          out.pr = { weightKg: load, reps: s.reps, date: session.date };
        }
        if (load > 0) {
          const est = epley(load, s.reps);
          if (!out.e1rm || est > out.e1rm.valueKg) {
            out.e1rm = { valueKg: est, weightKg: load, reps: s.reps, date: session.date };
          }
        }
      }
    }
  }
  return out;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export const dayKey = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export function formatDayHeading(iso: string): string {
  const d = new Date(iso);
  const diff = Math.round((startOfDay(new Date()) - startOfDay(d)) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export const formatShortDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
