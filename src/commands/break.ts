import { printBanner } from '../ui/banner.js';
import { runTimer } from '../ui/run-timer.js';

interface BreakOptions {
  long: boolean;
  notify: boolean;
  sound: boolean;
  quiet: boolean;
}

export async function runBreak(options: BreakOptions): Promise<void> {
  if (!options.quiet) printBanner();
  const minutes = options.long ? 15 : 5;
  await runTimer({
    label: options.long ? 'Long Break' : 'Short Break',
    totalSeconds: minutes * 60,
    type: 'break',
    notify: options.notify,
    sound: options.sound,
    quiet: options.quiet,
  });
}
