import React, { createContext, ReactNode, useContext } from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { colors } from '../../theme';

export interface IllustrationProps {
  /** Colour of the lifter's line art; normally the exercise's split colour. */
  accent: string;
}

const AccentContext = createContext<string>(colors.accent);

/** Equipment strokes: a light slate that reads on the dark card background. */
const GEAR_COLOR = '#cbd5e1';

/** Shared 160x100 canvas. Everything scales to the parent view. */
export function IllustrationFrame({ accent, children }: IllustrationProps & { children: ReactNode }) {
  return (
    <AccentContext.Provider value={accent}>
      <Svg width="100%" height="100%" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet">
        {children}
      </Svg>
    </AccentContext.Provider>
  );
}

const round = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** The lifter, drawn in the accent colour. */
export function Body({ children }: { children: ReactNode }) {
  const accent = useContext(AccentContext);
  return (
    <G stroke={accent} strokeWidth={3.5} {...round}>
      {children}
    </G>
  );
}

/** Bars, plates, benches, cables, machines. */
export function Gear({ children }: { children: ReactNode }) {
  return (
    <G stroke={GEAR_COLOR} strokeWidth={2.5} {...round}>
      {children}
    </G>
  );
}

export function Floor() {
  return <Path d="M8 90 L152 90" stroke={colors.border} strokeWidth={2} strokeLinecap="round" />;
}
