import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { EXERCISES_BY_ID } from '../data/seedData';
import { WeightUnit, WorkoutSession } from '../types';
import { setLoadKg } from './workout';

// Same keys as src/storage/workoutStorage.ts
const SESSIONS_KEY = 'gym-tracker:sessions:v1';
const UNIT_KEY = 'gym-tracker:unit:v1';

export type ExportFormat = 'json' | 'csv';
export type ExportResult = 'shared' | 'empty' | 'unavailable';

const CSV_HEADER = ['Date', 'Split', 'ExerciseName', 'SetNumber', 'WeightKg', 'Reps', 'Completed', 'RPE'];

const csvCell = (v: string | number | boolean | undefined): string => {
  const s = v === undefined ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * One row per set. WeightKg is the effective load: for bodyweight lifts this is the
 * weight added to body weight (0 = unweighted).
 */
export function sessionsToCsv(sessions: WorkoutSession[]): string {
  const rows: string[] = [CSV_HEADER.join(',')];
  const ordered = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  for (const session of ordered) {
    for (const log of session.exercises) {
      const name = EXERCISES_BY_ID[log.exerciseId]?.name ?? log.exerciseId;
      for (const s of log.sets) {
        rows.push(
          [session.date, session.splitType, name, s.setNumber, setLoadKg(s), s.reps, s.completed, s.rpe]
            .map(csvCell)
            .join(','),
        );
      }
    }
  }
  // BOM so Excel opens the file as UTF-8
  return '﻿' + rows.join('\r\n') + '\r\n';
}

async function readSessions(): Promise<WorkoutSession[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as WorkoutSession[]) : [];
}

async function readUnit(): Promise<WeightUnit> {
  return (await AsyncStorage.getItem(UNIT_KEY)) === 'lbs' ? 'lbs' : 'kg';
}

const stamp = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Writes the saved workout history to a temporary file and opens the iOS share sheet
 * (AirDrop, Save to Files, Mail, Messages). Resolves 'empty' when nothing is saved yet
 * and 'unavailable' if sharing is not supported; throws on storage or file errors.
 */
export async function exportWorkoutData(format: ExportFormat): Promise<ExportResult> {
  const [sessions, unit] = await Promise.all([readSessions(), readUnit()]);
  if (sessions.length === 0) return 'empty';
  if (!(await Sharing.isAvailableAsync())) return 'unavailable';

  const now = new Date();
  const content =
    format === 'json'
      ? JSON.stringify(
          {
            app: 'gym-tracker',
            schemaVersion: 1,
            exportedAt: now.toISOString(),
            preferences: { unit },
            sessions,
          },
          null,
          2,
        )
      : sessionsToCsv(sessions);

  const file = new File(Paths.cache, `gym-tracker-${stamp(now)}.${format}`);
  file.create({ overwrite: true });
  file.write(content);

  await Sharing.shareAsync(file.uri, {
    mimeType: format === 'json' ? 'application/json' : 'text/csv',
    UTI: format === 'json' ? 'public.json' : 'public.comma-separated-values-text',
    dialogTitle: 'Export Gym Tracker data',
  });
  return 'shared';
}
