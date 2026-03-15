import pc from 'picocolors';
import { printBanner } from '../ui/banner.js';
import { loadPresets, savePreset, listPresets, deletePreset } from '../lib/config.js';
import type { PresetName } from '../types.js';

interface ConfigOptions {
  label?: string;
  minutes?: number;
  delete?: boolean;
  quiet?: boolean;
  notify?: boolean;
  sound?: boolean;
}

export async function runConfig(opts: ConfigOptions): Promise<void> {
  if (!opts.quiet) printBanner();

  if (opts.label && opts.minutes !== undefined) {
    // Set preset
    const presetName = opts.label.toLowerCase() as PresetName;
    savePreset(presetName, { label: presetName.charAt(0).toUpperCase() + presetName.slice(1), minutes: opts.minutes });
    console.log(pc.green(`  ✓ Preset '${presetName}' saved (${opts.minutes} min).`));
    return;
  }

  if (opts.delete && opts.label) {
    // Delete
    const presetName = opts.label.toLowerCase() as PresetName;
    deletePreset(presetName);
    console.log(pc.green(`  ✓ Preset '${presetName}' deleted.`));
    return;
  }

  // List
  const presets = listPresets();
  if (presets.length === 0) {
    console.log(pc.gray('  No presets configured.\n'));
    return;
  }

  console.log(pc.bold(pc.white('\n  Available Presets\n')));
  for (const {name, preset} of presets) {
    console.log(`  ${pc.white(preset.label)} ${pc.gray(`(${preset.minutes} min)`)} [${name}]`);
  }
  console.log();
}

