import React from 'react';
import { Circle, Path, Rect } from 'react-native-svg';
import { Body, Floor, Gear, IllustrationFrame, IllustrationProps } from './IllustrationFrame';

/** push-bench-press */
export function BenchPressIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Rect x={34} y={62} width={84} height={6} rx={1.5} />
        <Path d="M44 68 L44 90" />
        <Path d="M108 68 L108 90" />
      </Gear>
      <Body>
        <Circle cx={40} cy={54} r={6} />
        <Path d="M48 58 L100 58" />
        <Path d="M100 58 L120 52 L122 88" />
        <Path d="M58 57 L58 30" />
      </Body>
      <Gear>
        <Path d="M36 30 L80 30" />
        <Circle cx={36} cy={30} r={7} />
        <Circle cx={80} cy={30} r={7} />
      </Gear>
    </IllustrationFrame>
  );
}

/** push-incline-db-press */
export function InclineDbPressIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Path d="M52 50 L92 76" />
        <Path d="M92 76 L120 76" />
        <Path d="M96 76 L96 90" />
      </Gear>
      <Body>
        <Circle cx={58} cy={40} r={6} />
        <Path d="M64 48 L94 70" />
        <Path d="M94 70 L116 64 L118 88" />
        <Path d="M68 50 L72 24" />
      </Body>
      <Gear>
        <Rect x={64} y={16} width={16} height={7} rx={1.5} />
      </Gear>
    </IllustrationFrame>
  );
}

/** push-overhead-press */
export function OverheadPressIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Body>
        <Circle cx={70} cy={22} r={6} />
        <Path d="M70 30 L70 60" />
        <Path d="M70 60 L66 88" />
        <Path d="M70 60 L76 88" />
        <Path d="M70 34 L82 22 L76 10" />
      </Body>
      <Gear>
        <Path d="M42 10 L104 10" />
        <Circle cx={42} cy={10} r={7} />
        <Circle cx={104} cy={10} r={7} />
      </Gear>
    </IllustrationFrame>
  );
}

/** push-lateral-raise */
export function LateralRaiseIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Body>
        <Circle cx={80} cy={18} r={6} />
        <Path d="M80 26 L80 62" />
        <Path d="M80 62 L72 88" />
        <Path d="M80 62 L88 88" />
        <Path d="M80 30 L56 34" />
        <Path d="M80 30 L104 34" />
      </Body>
      <Gear>
        <Rect x={46} y={33} width={12} height={6} rx={1.5} />
        <Rect x={102} y={33} width={12} height={6} rx={1.5} />
      </Gear>
    </IllustrationFrame>
  );
}

/** push-tricep-pushdown */
export function TricepPushdownIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Circle cx={104} cy={14} r={5} />
        <Rect x={112} y={10} width={14} height={66} rx={1.5} />
        <Path d="M104 19 L90 60" />
      </Gear>
      <Body>
        <Circle cx={66} cy={24} r={6} />
        <Path d="M66 32 L64 62" />
        <Path d="M64 62 L62 88" />
        <Path d="M64 62 L70 88" />
        <Path d="M66 36 L70 52 L90 60" />
      </Body>
      <Gear>
        <Path d="M84 60 L96 60" />
      </Gear>
    </IllustrationFrame>
  );
}

/** push-dips */
export function DipsIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Path d="M34 52 L78 52" />
        <Path d="M40 52 L40 90" />
        <Path d="M72 52 L72 90" />
      </Gear>
      <Body>
        <Circle cx={56} cy={28} r={6} />
        <Path d="M56 36 L60 66" />
        <Path d="M56 38 L56 52" />
        <Path d="M60 66 L68 80 L52 86" />
      </Body>
    </IllustrationFrame>
  );
}
