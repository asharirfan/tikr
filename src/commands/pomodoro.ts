import { printBanner } from '../ui/banner.js';
import { runTimer } from '../ui/run-timer.js';

interface PomodoroOptions {
  notify: boolean;
  sound: boolean;
  quiet: boolean;
}

export async function runPomodoro(options: PomodoroOptions): Promise<void> {
  if (!options.quiet) printBanner();
  await runTimer({
    label: 'Focus',
    totalSeconds: 25 * 60,
    type: 'pomodoro',
    notify: options.notify,
    sound: options.sound,
    quiet: options.quiet,
  });
}
