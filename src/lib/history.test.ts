import { describe, it, expect, beforeEach } from 'vitest';
import { loadHistory, saveSession, clearHistory } from './history.js';

describe('history', () => {
  beforeEach(() => {
    clearHistory();
  });

  it('loads empty history after clear', () => {
    expect(loadHistory()).toEqual([]);
  });

  it('saves and loads a session', () => {
    const session = {
      type: 'pomodoro' as const,
      label: 'Focus',
      duration: 25,
      completedAt: new Date().toISOString(),
    };
    saveSession(session);
    const history = loadHistory();
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual(session);
  });

  it('appends multiple sessions', () => {
    saveSession({
      type: 'pomodoro',
      label: 'Focus',
      duration: 25,
      completedAt: new Date().toISOString(),
    });
    saveSession({
      type: 'break',
      label: 'Short Break',
      duration: 5,
      completedAt: new Date().toISOString(),
    });
    expect(loadHistory()).toHaveLength(2);
  });

  it('clears history', () => {
    saveSession({
      type: 'pomodoro',
      label: 'Focus',
      duration: 25,
      completedAt: new Date().toISOString(),
    });
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });
});
