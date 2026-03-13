import notifier from 'node-notifier';
import type { SessionType } from '../types.js';

export function sendNotification(label: string, type: SessionType): void {
  const message = type === 'break' ? 'Break time is over!' : 'Time to take a break!';
  notifier.notify({
    title: `tikr — ${label}`,
    message,
    sound: false,
  });
}
