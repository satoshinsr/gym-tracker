import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, radius } from '../theme';
import { cancelRestNotification, scheduleRestNotification } from '../utils/restNotifications';

interface Props {
  visible: boolean;
  /** Starting duration in seconds each time the timer is (re)started. */
  initialSeconds: number;
  /** Bump this to restart the countdown while the sheet is already open. */
  startToken: number;
  onClose: () => void;
}

const PRESETS = [30, 60, 90, 120] as const;
const STEP = 15;

const mmss = (s: number): string =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function RestTimerModal({ visible, initialSeconds, startToken, onClose }: Props) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [total, setTotal] = useState(initialSeconds);
  const [running, setRunning] = useState(true);
  const [endVersion, setEndVersion] = useState(0);

  // Refs hold the wall-clock end time so the countdown stays accurate even if
  // the JS thread is throttled; state is only for rendering.
  const remainingRef = useRef(initialSeconds);
  const endAtRef = useRef(0);

  const finish = useCallback(() => {
    setRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  }, []);

  // Reset whenever the sheet opens or the parent asks for a fresh countdown.
  useEffect(() => {
    if (!visible) return;
    remainingRef.current = initialSeconds;
    setRemaining(initialSeconds);
    setTotal(initialSeconds);
    setRunning(true);
  }, [visible, startToken, initialSeconds]);

  // Interval runs only while visible and not paused.
  useEffect(() => {
    if (!visible || !running) return;
    endAtRef.current = Date.now() + remainingRef.current * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      remainingRef.current = left;
      setRemaining(left);
      if (left === 0) {
        clearInterval(id);
        finish();
      }
    }, 250);
    return () => clearInterval(id);
  }, [visible, running, startToken, finish]);

  // Keep one scheduled system notification in sync with the target end time.
  // The cleanup cancels it on pause, dismiss/skip, finish, restart or unmount;
  // `endVersion` forces a reschedule after preset / +-15s adjustments.
  useEffect(() => {
    if (!visible || !running) return;
    let cancelled = false;
    let id: string | null = null;
    scheduleRestNotification(endAtRef.current).then((scheduled) => {
      if (cancelled) cancelRestNotification(scheduled); // cleanup ran before scheduling resolved
      else id = scheduled;
    });
    return () => {
      cancelled = true;
      cancelRestNotification(id);
    };
  }, [visible, running, startToken, endVersion]);

  /** Set a new remaining time. `resume` restarts a paused/finished timer. */
  const setSeconds = (secs: number, resume: boolean, resetTotal = false) => {
    const next = Math.max(0, secs);
    remainingRef.current = next;
    endAtRef.current = Date.now() + next * 1000;
    setRemaining(next);
    setTotal((t) => (resetTotal ? next : Math.max(t, next)));
    setEndVersion((v) => v + 1);
    if (next === 0) {
      finish();
    } else if (resume) {
      setRunning(true);
    }
  };

  const finished = remaining === 0;
  const progress = total > 0 ? remaining / total : 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Dismiss rest timer" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.heading}>{finished ? 'Rest complete' : 'Rest'}</Text>

        <Text
          style={[styles.time, finished && { color: colors.accent }]}
          accessibilityRole="timer"
          accessibilityLabel={`${remaining} seconds remaining`}
        >
          {mmss(remaining)}
        </Text>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>

        <View style={styles.row}>
          <AdjustButton label={`-${STEP}s`} onPress={() => setSeconds(remainingRef.current - STEP, false)} />
          <Pressable
            onPress={() => (finished ? setSeconds(initialSeconds, true, true) : setRunning((r) => !r))}
            style={styles.playBtn}
            accessibilityRole="button"
            accessibilityLabel={finished ? 'Restart' : running ? 'Pause' : 'Resume'}
          >
            <MaterialCommunityIcons
              name={finished ? 'restart' : running ? 'pause' : 'play'}
              size={30}
              color={colors.onAccent}
            />
          </Pressable>
          <AdjustButton label={`+${STEP}s`} onPress={() => setSeconds(remainingRef.current + STEP, finished)} />
        </View>

        <View style={styles.row}>
          {PRESETS.map((p) => (
            <Pressable
              key={p}
              onPress={() => setSeconds(p, true, true)}
              style={[styles.preset, total === p && styles.presetOn]}
              accessibilityRole="button"
              accessibilityLabel={`${p} seconds`}
            >
              <Text style={[styles.presetText, total === p && styles.presetTextOn]}>{p}s</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={onClose} style={styles.skip} accessibilityRole="button">
          <Text style={styles.skipText}>{finished ? 'Done' : 'Skip Rest'}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function AdjustButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.adjust} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={styles.adjustText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(2,6,23,0.6)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 10,
    gap: 16,
    alignItems: 'stretch',
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border },
  heading: { color: colors.textMuted, textAlign: 'center', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  time: { color: colors.text, textAlign: 'center', fontSize: 76, fontWeight: '800', fontVariant: ['tabular-nums'] },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjust: {
    minWidth: 76,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  adjustText: { color: colors.text, fontWeight: '800', fontSize: 16 },
  preset: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetOn: { borderColor: colors.accent, backgroundColor: colors.accent + '22' },
  presetText: { color: colors.textMuted, fontWeight: '700' },
  presetTextOn: { color: colors.accent },
  skip: { alignItems: 'center', paddingVertical: 14, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  skipText: { color: colors.text, fontWeight: '800', fontSize: 16 },
});
