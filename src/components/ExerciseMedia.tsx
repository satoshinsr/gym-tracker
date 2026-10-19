import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ExerciseImage } from './ExerciseImage';
import { EXERCISES_BY_ID } from '../data/seedData';
import { colors } from '../theme';

interface Props {
  exerciseId: string;
  /**
   * 'player': animated demo with tap-to-pause/play and a status badge (detail screen).
   * 'thumb': lightweight static first frame for lists; never decodes the animation.
   */
  variant?: 'player' | 'thumb';
  /** Player only: start playing immediately (default true). */
  autoPlay?: boolean;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Pulsing placeholder shown until the first frame is ready. The loop stops on unmount and on load. */
function Skeleton() {
  const pulse = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.skeleton, { opacity: pulse }]} />;
}

/**
 * Exercise demonstration. Falls back to the bundled SVG illustration when the exercise has
 * no media or the media fails to load, so the UI always shows something.
 */
export function ExerciseMedia({ exerciseId, variant = 'player', autoPlay = true, borderRadius, style }: Props) {
  const exercise = EXERCISES_BY_ID[exerciseId];
  const source = variant === 'thumb' ? (exercise?.thumbnailUri ?? undefined) : exercise?.animationUri;
  const imageRef = useRef<Image>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(autoPlay);

  // A different exercise (or source) starts clean.
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setPlaying(autoPlay);
  }, [exerciseId, variant, autoPlay]);

  const toggle = useCallback(() => {
    const ref = imageRef.current;
    if (!ref) return;
    if (playing) {
      ref.stopAnimating().catch(() => undefined);
      setPlaying(false);
    } else {
      ref.startAnimating().catch(() => undefined);
      setPlaying(true);
    }
  }, [playing]);

  const containerStyle = [styles.box, borderRadius !== undefined && { borderRadius }, style];

  if (!source || failed) {
    return <ExerciseImage exerciseId={exerciseId} borderRadius={borderRadius} style={style} />;
  }

  const image = (
    <Image
      ref={imageRef}
      source={source}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      transition={variant === 'thumb' ? 0 : 150}
      cachePolicy="memory-disk"
      recyclingKey={`${exerciseId}:${variant}`}
      autoplay={variant === 'player' ? autoPlay : false}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      accessibilityIgnoresInvertColors
    />
  );

  if (variant === 'thumb') {
    return (
      <View style={containerStyle} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {image}
        {!loaded && <Skeleton />}
      </View>
    );
  }

  return (
    <Pressable
      onPress={toggle}
      style={containerStyle}
      accessibilityRole="button"
      accessibilityLabel={playing ? 'Pause demonstration' : 'Play demonstration'}
    >
      {image}
      {!loaded && <Skeleton />}
      {loaded && !playing && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.pausedVeil]}>
          <MaterialCommunityIcons name="play-circle" size={56} color="rgba(255,255,255,0.9)" />
        </View>
      )}
      {loaded && (
        <View pointerEvents="none" style={styles.badge}>
          <MaterialCommunityIcons name={playing ? 'play' : 'pause'} size={12} color={colors.text} />
          <Text style={styles.badgeText}>{playing ? 'Playing' : 'Paused'}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  skeleton: { backgroundColor: colors.border },
  pausedVeil: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(2,6,23,0.35)' },
  badge: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(2,6,23,0.65)',
  },
  badgeText: { color: colors.text, fontSize: 11, fontWeight: '700' },
});
