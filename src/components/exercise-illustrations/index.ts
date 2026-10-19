import { ComponentType } from 'react';
import { IllustrationProps } from './IllustrationFrame';
import { GenericIllustration } from './GenericIllustration';
import {
  GenericBarbellIllustration,
  GenericBodyweightIllustration,
  GenericCableIllustration,
  GenericMachineIllustration,
} from './GenericIllustrations';
import { BenchPressIllustration, InclineDbPressIllustration, OverheadPressIllustration, LateralRaiseIllustration, TricepPushdownIllustration, DipsIllustration } from './PushIllustrations';
import { DeadliftIllustration, PullupIllustration, BarbellRowIllustration, LatPulldownIllustration, FacePullIllustration, BarbellCurlIllustration } from './PullIllustrations';
import { SquatIllustration, RdlIllustration, LegPressIllustration, LungeIllustration, LegCurlIllustration, CalfRaiseIllustration } from './LegsIllustrations';

export type { IllustrationProps } from './IllustrationFrame';

/** exerciseId -> bundled SVG illustration. Add new exercises here. */
export const ILLUSTRATIONS: Record<string, ComponentType<IllustrationProps>> = {
  'push-bench-press': BenchPressIllustration,
  'push-incline-db-press': InclineDbPressIllustration,
  'push-overhead-press': OverheadPressIllustration,
  'push-lateral-raise': LateralRaiseIllustration,
  'push-tricep-pushdown': TricepPushdownIllustration,
  'push-dips': DipsIllustration,
  'pull-deadlift': DeadliftIllustration,
  'pull-pullup': PullupIllustration,
  'pull-barbell-row': BarbellRowIllustration,
  'pull-lat-pulldown': LatPulldownIllustration,
  'pull-face-pull': FacePullIllustration,
  'pull-barbell-curl': BarbellCurlIllustration,
  'legs-squat': SquatIllustration,
  'legs-rdl': RdlIllustration,
  'legs-leg-press': LegPressIllustration,
  'legs-lunge': LungeIllustration,
  'legs-leg-curl': LegCurlIllustration,
  'legs-calf-raise': CalfRaiseIllustration,
};

/**
 * Variants whose movement and equipment match an existing drawing reuse it.
 * Everything else falls back to a generic picture for its equipment type.
 */
const ALIASES: Record<string, string> = {
  'push-decline-bench-press': 'push-bench-press',
  'push-close-grip-bench': 'push-bench-press',
  'push-straight-bar-pushdown': 'push-tricep-pushdown',
  'pull-chinup': 'pull-pullup',
  'pull-close-grip-pulldown': 'pull-lat-pulldown',
  'legs-front-squat': 'legs-squat',
  'legs-bulgarian-split-squat': 'legs-lunge',
  'legs-step-up': 'legs-lunge',
  'legs-seated-calf-raise': 'legs-calf-raise',
  'legs-seated-leg-curl': 'legs-leg-curl',
};

const GENERIC_BY_EQUIPMENT: Record<string, ComponentType<IllustrationProps>> = {
  Barbell: GenericBarbellIllustration,
  'EZ Bar': GenericBarbellIllustration,
  Cable: GenericCableIllustration,
  Machine: GenericMachineIllustration,
  Bodyweight: GenericBodyweightIllustration,
  Dumbbells: GenericIllustration,
};

/** Specific drawing, then an aliased one, then a generic by equipment; never undefined. */
export const getIllustration = (exerciseId: string, equipment?: string): ComponentType<IllustrationProps> =>
  ILLUSTRATIONS[exerciseId] ??
  ILLUSTRATIONS[ALIASES[exerciseId]] ??
  GENERIC_BY_EQUIPMENT[equipment ?? ''] ??
  GenericIllustration;
