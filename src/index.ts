import { Command } from 'commander';
import { createRequire } from 'module';
import * as clack from '@clack/prompts';
import { runPomodoro } from './commands/pomodoro.js';
import { runStart } from './commands/start.js';
import { runBreak } from './commands/break.js';
import { runHistory } from './commands/history.js';
import { printBanner } from './ui/banner.js';
import { CLI_NAME } from './constants.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

const program = new Command();

program
  .name(CLI_NAME)
  .description('A beautiful Pomodoro & countdown timer, right in your terminal')
  .version(version, '-v, --version', 'Show current version')
  .helpOption('-h, --help', 'Show help');

program
  .command('pomodoro')
  .description('Start a 25-minute Pomodoro session')
  .option('--no-notify', 'Disable desktop notification on completion')
  .option('--no-sound', 'Disable sound on completion')
  .option('-q, --quiet', 'Suppress all output except the timer', false)
  .action(async (opts: { notify: boolean; sound: boolean; quiet: boolean }) => {
    await runPomodoro({ notify: opts.notify, sound: opts.sound, quiet: opts.quiet });
  });

program
  .command('start')
  .description('Start a custom countdown timer')
  .option('-m, --minutes <number>', 'Duration in minutes', (v: string) => parseInt(v, 10), 25)
  .option('-l, --label <text>', 'Label for the session', 'Focus')
  .option('--no-notify', 'Disable desktop notification on completion')
  .option('--no-sound', 'Disable sound on completion')
  .option('-q, --quiet', 'Suppress all output except the timer', false)
  .action(
    async (opts: {
      minutes: number;
      label: string;
      notify: boolean;
      sound: boolean;
      quiet: boolean;
    }) => {
      await runStart({
        minutes: opts.minutes,
        label: opts.label,
        notify: opts.notify,
        sound: opts.sound,
        quiet: opts.quiet,
      });
    },
  );

program
  .command('break')
  .description('Start a break timer (5 min short, 15 min long)')
  .option('--long', 'Use long break duration (15 min)', false)
  .option('--no-notify', 'Disable desktop notification on completion')
  .option('--no-sound', 'Disable sound on completion')
  .option('-q, --quiet', 'Suppress all output except the timer', false)
  .action(async (opts: { long: boolean; notify: boolean; sound: boolean; quiet: boolean }) => {
    await runBreak({ long: opts.long, notify: opts.notify, sound: opts.sound, quiet: opts.quiet });
  });

program
  .command('history')
  .description('View session history')
  .option('--today', "Show only today's sessions", false)
  .option('--clear', 'Clear all session history', false)
  .action(async (opts: { today: boolean; clear: boolean }) => {
    await runHistory({ today: opts.today, clear: opts.clear });
  });

program.action(async () => {
  printBanner();

  const action = await clack.select({
    message: 'What would you like to do?',
    options: [
      { value: 'pomodoro', label: '🍅 Pomodoro', hint: '25 min focus session' },
      { value: 'start', label: '⏳ Custom timer', hint: 'set your own duration' },
      { value: 'break-short', label: '☕ Short break', hint: '5 min' },
      { value: 'break-long', label: '🛋️  Long break', hint: '15 min' },
      { value: 'history', label: '📋 History', hint: 'view past sessions' },
    ],
  });

  if (clack.isCancel(action)) {
    clack.cancel('Cancelled.');
    process.exit(0);
  }

  if (action === 'pomodoro') {
    await runPomodoro({ notify: true, sound: true, quiet: false });
  } else if (action === 'start') {
    const minutesRaw = await clack.text({
      message: 'How many minutes?',
      placeholder: '25',
      validate: (v) => {
        const n = parseInt(v, 10);
        if (isNaN(n) || n <= 0) return 'Enter a positive number';
      },
    });
    if (clack.isCancel(minutesRaw)) {
      clack.cancel('Cancelled.');
      process.exit(0);
    }

    const label = await clack.text({
      message: 'Session label?',
      placeholder: 'Focus',
    });
    if (clack.isCancel(label)) {
      clack.cancel('Cancelled.');
      process.exit(0);
    }

    await runStart({
      minutes: parseInt(minutesRaw as string, 10),
      label: (label as string) || 'Focus',
      notify: true,
      sound: true,
      quiet: false,
    });
  } else if (action === 'break-short') {
    await runBreak({ long: false, notify: true, sound: true, quiet: false });
  } else if (action === 'break-long') {
    await runBreak({ long: true, notify: true, sound: true, quiet: false });
  } else if (action === 'history') {
    await runHistory({ today: false, clear: false });
  }
});

program.parse();
