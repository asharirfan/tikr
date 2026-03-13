import { printBanner } from '../ui/banner.js';
import { runTimer } from '../ui/run-timer.js';

interface StartOptions {
  minutes: number;
  label: string;
  notify: boolean;
  sound: boolean;
  quiet: boolean;
}

export async function runStart(options: StartOptions): Promise<void> {
  if (!options.quiet) printBanner();
  await runTimer({
    label: options.label,
    totalSeconds: options.minutes * 60,
    type: 'custom',
    notify: options.notify,
    sound: options.sound,
    quiet: options.quiet,
  });
}
