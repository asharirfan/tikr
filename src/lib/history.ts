import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { Session } from '../types.js';
import { CLI_NAME } from '../constants.js';

const HISTORY_DIR = join(homedir(), `.${CLI_NAME}`);
const HISTORY_FILE = join(HISTORY_DIR, 'history.json');

function ensureDir(): void {
  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

export function loadHistory(): Session[] {
  ensureDir();
  if (!existsSync(HISTORY_FILE)) return [];
  try {
    return JSON.parse(readFileSync(HISTORY_FILE, 'utf-8')) as Session[];
  } catch {
    return [];
  }
}

export function saveSession(session: Session): void {
  ensureDir();
  const history = loadHistory();
  history.push(session);
  writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

export function clearHistory(): void {
  ensureDir();
  writeFileSync(HISTORY_FILE, '[]');
}
