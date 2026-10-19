import React from 'react';
import { Circle, Path, Rect } from 'react-native-svg';
import { Body, Floor, Gear, IllustrationFrame, IllustrationProps } from './IllustrationFrame';

/** legs-squat */
export function SquatIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Circle cx={62} cy={40} r={10} />
      </Gear>
      <Body>
        <Circle cx={78} cy={32} r={6} />
        <Path d="M70 42 L58 72" />
        <Path d="M58 72 L92 66 L72 88" />
      </Body>
      <Gear>
        <Path d="M48 40 L80 40" />
      </Gear>
    </IllustrationFrame>
  );
}

/** legs-rdl */
export function RdlIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Body>
        <Circle cx={106} cy={42} r={6} />
        <Path d="M98 48 L56 56" />
        <Path d="M56 56 L60 74 L60 88" />
        <Path d="M98 50 L96 66" />
      </Body>
      <Gear>
        <Circle cx={96} cy={77} r={11} />
      </Gear>
    </IllustrationFrame>
  );
}

/** legs-leg-press */
export function LegPressIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Path d="M44 84 L124 40" />
        <Path d="M96 28 L112 50" />
        <Path d="M18 40 L44 80" />
      </Gear>
      <Body>
        <Circle cx={24} cy={46} r={6} />
        <Path d="M30 54 L44 74" />
        <Path d="M44 74 L76 58 L100 35" />
      </Body>
    </IllustrationFrame>
  );
}

/** legs-lunge */
export function LungeIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Body>
        <Circle cx={70} cy={22} r={6} />
        <Path d="M70 30 L70 60" />
        <Path d="M70 60 L94 62 L94 88" />
        <Path d="M70 60 L52 80 L38 88" />
        <Path d="M70 34 L70 58" />
      </Body>
      <Gear>
        <Rect x={66} y={56} width={8} height={6} rx={1.5} />
      </Gear>
    </IllustrationFrame>
  );
}

/** legs-leg-curl */
export function LegCurlIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Path d="M26 66 L110 66" />
        <Path d="M34 66 L34 90" />
        <Path d="M102 66 L102 90" />
      </Gear>
      <Body>
        <Circle cx={26} cy={56} r={6} />
        <Path d="M34 60 L84 60" />
        <Path d="M84 60 L106 60" />
        <Path d="M106 60 L98 34" />
      </Body>
      <Gear>
        <Circle cx={98} cy={32} r={5} />
      </Gear>
    </IllustrationFrame>
  );
}

/** legs-calf-raise */
export function CalfRaiseIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Rect x={48} y={82} width={44} height={8} rx={1.5} />
        <Path d="M56 34 L84 34" />
      </Gear>
      <Body>
        <Circle cx={70} cy={20} r={6} />
        <Path d="M70 28 L70 60" />
        <Path d="M70 60 L70 78 L76 82" />
        <Path d="M70 60 L64 78 L70 82" />
      </Body>
    </IllustrationFrame>
  );
}
