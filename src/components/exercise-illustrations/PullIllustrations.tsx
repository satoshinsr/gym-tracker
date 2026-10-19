import React from 'react';
import { Circle, Path, Rect } from 'react-native-svg';
import { Body, Floor, Gear, IllustrationFrame, IllustrationProps } from './IllustrationFrame';

/** pull-deadlift */
export function DeadliftIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Body>
        <Circle cx={100} cy={26} r={6} />
        <Path d="M62 52 L90 34" />
        <Path d="M62 52 L86 66 L84 88" />
        <Path d="M90 36 L88 74" />
      </Body>
      <Gear>
        <Circle cx={88} cy={77} r={11} />
      </Gear>
    </IllustrationFrame>
  );
}

/** pull-pullup */
export function PullupIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Path d="M36 12 L124 12" />
        <Path d="M36 12 L36 40" />
        <Path d="M124 12 L124 40" />
      </Gear>
      <Body>
        <Circle cx={80} cy={26} r={6} />
        <Path d="M62 12 L66 28 L74 38" />
        <Path d="M98 12 L94 28 L86 38" />
        <Path d="M74 38 L86 38" />
        <Path d="M80 38 L80 66" />
        <Path d="M80 66 L76 90" />
        <Path d="M80 66 L84 90" />
      </Body>
    </IllustrationFrame>
  );
}

/** pull-barbell-row */
export function BarbellRowIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Body>
        <Circle cx={108} cy={40} r={6} />
        <Path d="M56 54 L98 44" />
        <Path d="M56 54 L70 70 L62 88" />
        <Path d="M98 46 L94 58 L92 70" />
      </Body>
      <Gear>
        <Circle cx={92} cy={74} r={11} />
      </Gear>
    </IllustrationFrame>
  );
}

/** pull-lat-pulldown */
export function LatPulldownIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Circle cx={84} cy={10} r={5} />
        <Path d="M84 15 L84 28" />
        <Path d="M66 28 L102 28" />
        <Rect x={118} y={8} width={12} height={54} rx={1.5} />
      </Gear>
      <Body>
        <Circle cx={58} cy={32} r={6} />
        <Path d="M58 40 L62 70" />
        <Path d="M62 70 L88 68 L90 88" />
        <Path d="M58 44 L72 44 L84 28" />
      </Body>
      <Gear>
        <Path d="M46 73 L78 73" />
        <Path d="M80 60 L96 60" />
      </Gear>
    </IllustrationFrame>
  );
}

/** pull-face-pull */
export function FacePullIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Gear>
        <Circle cx={112} cy={34} r={5} />
        <Rect x={122} y={20} width={14} height={60} rx={1.5} />
        <Path d="M107 34 L88 36" />
      </Gear>
      <Body>
        <Circle cx={60} cy={24} r={6} />
        <Path d="M60 32 L60 60" />
        <Path d="M60 60 L56 88" />
        <Path d="M60 60 L66 88" />
        <Path d="M60 35 L72 44 L88 36" />
      </Body>
    </IllustrationFrame>
  );
}

/** pull-barbell-curl */
export function BarbellCurlIllustration({ accent }: IllustrationProps) {
  return (
    <IllustrationFrame accent={accent}>
      <Floor />
      <Body>
        <Circle cx={70} cy={18} r={6} />
        <Path d="M70 26 L70 60" />
        <Path d="M70 60 L66 88" />
        <Path d="M70 60 L76 88" />
        <Path d="M70 32 L72 50 L90 40" />
      </Body>
      <Gear>
        <Circle cx={90} cy={40} r={8} />
      </Gear>
    </IllustrationFrame>
  );
}
