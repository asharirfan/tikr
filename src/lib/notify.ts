import notifier from 'node-notifier';
import type { SessionType } from '../types.js';
import { CLI_NAME } from '../constants.js';

export function sendNotification(label: string, type: SessionType): void {
  const message = type === 'break' ? 'Break time is over!' : 'Time to take a break!';
  notifier.notify({
    title: `${CLI_NAME} — ${label}`,
    message,
    sound: false,
  });
}
