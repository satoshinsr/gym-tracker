import { SplitType } from './types';

export const colors = {
  bg: '#0b1120',
  surface: '#111a2e',
  surfaceAlt: '#1a2540',
  border: '#24304d',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  accent: '#10b981', // emerald
  accentAlt: '#3b82f6', // electric blue
  onAccent: '#04130d',
};

export const splitColors: Record<SplitType, string> = {
  Push: '#f97316',
  Pull: '#3b82f6',
  Legs: '#10b981',
};

export const splitIcons: Record<SplitType, 'arm-flex' | 'weight-lifter' | 'run-fast'> = {
  Push: 'arm-flex',
  Pull: 'weight-lifter',
  Legs: 'run-fast',
};

export const radius = { sm: 8, md: 14, lg: 20 };
