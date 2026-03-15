import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { Preset, PresetName } from '../types.js';
import { CLI_NAME, DEFAULT_PRESETS } from '../constants.js';

const HISTORY_DIR = join(homedir(), `.${CLI_NAME}`);
const CONFIG_FILE = join(HISTORY_DIR, 'config.json');

function ensureDir(): void {
  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

interface UserConfig {
  presets: Record<PresetName, Preset>;
}

function loadUserPresets(): Record<PresetName, Preset> {
  ensureDir();
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    const config: UserConfig = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    return config.presets || {};
  } catch {
    return {};
  }
}

export function loadPresets(): Record<PresetName, Preset> {
  const user = loadUserPresets();
  return { ...DEFAULT_PRESETS, ...user };
}

export function savePreset(name: PresetName, preset: Preset): void {
  ensureDir();
  const userPresets = loadUserPresets();
  userPresets[name] = preset;
  const config: UserConfig = { presets: userPresets };
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function listPresets(): Array<{name: PresetName, preset: Preset}> {
  const presets = loadPresets();
  return Object.entries(presets).map(([name, preset]) => ({name: name as PresetName, preset}));
}

export function deletePreset(name: PresetName): void {
  ensureDir();
  const userPresets = loadUserPresets();
  delete userPresets[name];
  const config: UserConfig = { presets: userPresets };
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

