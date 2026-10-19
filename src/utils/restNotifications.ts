import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'rest-timer';
const ASKED_KEY = 'gym-tracker:notif-permission-asked:v1';

// The in-app sheet and haptic already signal the end of rest while the app is
// open, so suppress the system banner in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

let channelReady: Promise<void> | null = null;
function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return Promise.resolve();
  channelReady ??= Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Rest timer',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  })
    .then(() => undefined)
    .catch(() => undefined);
  return channelReady;
}

let permissionCheck: Promise<boolean> | null = null;

/**
 * Resolves true if notifications are allowed. Asks the OS at most once per
 * install (persisted), and never throws: any failure resolves false.
 */
export function ensureNotificationPermission(): Promise<boolean> {
  permissionCheck ??= (async () => {
    try {
      await ensureChannel();
      const current = await Notifications.getPermissionsAsync();
      if (current.granted) return true;

      const alreadyAsked = (await AsyncStorage.getItem(ASKED_KEY)) === '1';
      if (alreadyAsked || !current.canAskAgain) return false;

      await AsyncStorage.setItem(ASKED_KEY, '1');
      const result = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowSound: true, allowBadge: false },
      });
      return result.granted;
    } catch {
      return false;
    }
  })().then((granted) => {
    // Only cache a positive answer so a later grant via Settings is picked up.
    if (!granted) permissionCheck = null;
    return granted;
  });
  return permissionCheck;
}

/**
 * Schedules "Rest Finished!" for the given wall-clock time (epoch ms).
 * Returns the notification id, or null if permission is missing, the time has
 * already passed, or scheduling failed.
 */
export async function scheduleRestNotification(endAtMs: number): Promise<string | null> {
  try {
    if (endAtMs <= Date.now() + 500) return null;
    if (!(await ensureNotificationPermission())) return null;
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Rest Finished!',
        body: 'Time for your next set.',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: endAtMs,
        channelId: CHANNEL_ID,
      },
    });
  } catch {
    return null;
  }
}

export async function cancelRestNotification(id: string | null): Promise<void> {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // already fired or cleared; nothing to do
  }
}
