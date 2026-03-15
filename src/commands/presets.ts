import * as clack from '@clack/prompts';
import pc from 'picocolors';
import { printBanner } from '../ui/banner.js';
import { runStart } from './start.js';
import { listPresets } from '../lib/config.js';
import type { StartOptions } from '../types.js';

export async function runPresets(opts: Partial<StartOptions> = {}): Promise<void> {
  if (!opts.quiet) printBanner();


  const presets = listPresets();

  if (presets.length === 0) {
    console.log(pc.gray('  No presets configured. Use `config` to add some.\n'));
    return;
  }

  const selected = await clack.select({
    message: 'Select a preset:',
    options: presets.map(({name, preset}) => ({
      value: name,
      label: preset.label,
      hint: `${preset.minutes} min`
    }))
  });

  if (clack.isCancel(selected)) {
    clack.cancel('Cancelled.');
    return;
  }

  const preset = presets.find(p => p.name === selected)?.preset;
  if (!preset) return;

  await runStart({
    minutes: preset.minutes,
    label: preset.label,
    notify: opts.notify ?? true,
    sound: opts.sound ?? true,
    quiet: opts.quiet ?? false,
  });
}

