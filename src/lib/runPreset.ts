import { runStart } from '../commands/start.js';
import { loadPresets } from './config.js';
import type { PresetName, StartOptions } from '../types.js';
import pc from 'picocolors';

export async function runPreset(presetName: PresetName, options: Partial<StartOptions> = {}): Promise<void> {
  const presets = loadPresets();
  const preset = presets[presetName];
  if (!preset) {
    console.log(pc.red(`  Preset '${presetName}' not found. Run \`tikr config\` to configure.\n`));
    return;
  }
  await runStart({
    minutes: preset.minutes,
    label: preset.label,
    notify: options.notify ?? true,
    sound: options.sound ?? true,
    quiet: options.quiet ?? false,
  });
}

