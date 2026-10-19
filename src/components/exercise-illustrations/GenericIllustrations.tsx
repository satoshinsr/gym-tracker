import React from 'react';
import { Circle, Path, Rect } from 'react-native-svg';
import { Body, Floor, Gear, IllustrationFrame, IllustrationProps } from './IllustrationFrame';

/** A curved arrow in the accent colour that hints at "movement". */
function MotionArc() {
  return (
    <Body>
      <Path d="M52 24 Q80 8 108 24" />
      <Path d="M100 16 L108 24 L98 28" />
    </Body>
  );
}

/** Barbell with plates (barbell and EZ-bar movements). */
export function GenericBarbellIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Path d="M20 58 L140 58" />
        <Rect x={34} y={36} width={8} height={44} rx={2} />
        <Rect x={44} y={42} width={6} height={32} rx={2} />
        <Rect x={118} y={36} width={8} height={44} rx={2} />
        <Rect x={110} y={42} width={6} height={32} rx={2} />
      </Gear>
      <MotionArc />
    </IllustrationFrame>
  );
}

/** Cable pulley, stack and handle. */
export function GenericCableIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Rect x={112} y={14} width={14} height={66} rx={2} />
        <Circle cx={102} cy={20} r={5} />
        <Path d="M102 25 L72 62" />
        <Path d="M62 62 L82 62" />
      </Gear>
      <MotionArc />
    </IllustrationFrame>
  );
}

/** Seat, lever arm and weight stack. */
export function GenericMachineIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Path d="M36 76 L72 76" />
        <Path d="M36 44 L36 76" />
        <Path d="M72 76 L98 50 L112 34" />
        <Rect x={118} y={14} width={14} height={58} rx={2} />
        <Path d="M112 34 L118 34" />
      </Gear>
      <MotionArc />
    </IllustrationFrame>
  );
}

/** Simple standing figure for bodyweight movements. */
export function GenericBodyweightIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Body>
        <Circle cx={80} cy={24} r={6} />
        <Path d="M80 32 L80 62" />
        <Path d="M80 62 L72 88" />
        <Path d="M80 62 L88 88" />
        <Path d="M80 38 L62 52" />
        <Path d="M80 38 L98 52" />
      </Body>
    </IllustrationFrame>
  );
}
