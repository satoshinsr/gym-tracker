import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveWorkout, WeightUnit, WorkoutSession } from '../types';

const SESSIONS_KEY = 'gym-tracker:sessions:v1';
const ACTIVE_KEY = 'gym-tracker:active:v1';
const UNIT_KEY = 'gym-tracker:unit:v1';

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback; // corrupt or unreadable data should not brick the app
  }
}

export const loadSessions = (): Promise<WorkoutSession[]> => readJson<WorkoutSession[]>(SESSIONS_KEY, []);

export async function saveSession(session: WorkoutSession): Promise<void> {
  const all = await loadSessions();
  const i = all.findIndex((s) => s.id === session.id);
  if (i >= 0) all[i] = session;
  else all.push(session);
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(all));
}

export async function deleteSession(id: string): Promise<void> {
  const all = await loadSessions();
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(all.filter((s) => s.id !== id)));
}

export const loadActive = (): Promise<ActiveWorkout | null> => readJson<ActiveWorkout | null>(ACTIVE_KEY, null);
export const saveActive = (w: ActiveWorkout): Promise<void> => AsyncStorage.setItem(ACTIVE_KEY, JSON.stringify(w));
export const clearActive = (): Promise<void> => AsyncStorage.removeItem(ACTIVE_KEY);

export async function loadUnit(): Promise<WeightUnit> {
  const v = await AsyncStorage.getItem(UNIT_KEY).catch(() => null);
  return v === 'lbs' ? 'lbs' : 'kg';
}
export const saveUnit = (u: WeightUnit): Promise<void> => AsyncStorage.setItem(UNIT_KEY, u);
