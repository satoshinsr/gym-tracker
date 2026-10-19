import React from 'react';
import { Path, Rect } from 'react-native-svg';
import { Body, Floor, Gear, IllustrationFrame, IllustrationProps } from './IllustrationFrame';

/** Fallback for unknown exercise ids: a dumbbell with a motion arc. */
export function GenericIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Rect x={44} y={40} width={10} height={24} rx={2} />
        <Rect x={106} y={40} width={10} height={24} rx={2} />
        <Rect x={32} y={46} width={8} height={12} rx={2} />
        <Rect x={120} y={46} width={8} height={12} rx={2} />
        <Path d="M54 52 L106 52" />
      </Gear>
      <Body>
        <Path d="M52 28 Q80 12 108 28" />
        <Path d="M100 20 L108 28 L98 32" />
      </Body>
    </IllustrationFrame>
  );
}
