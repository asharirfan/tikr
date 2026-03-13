import React from 'react';
import { render } from 'ink';
import { Timer } from './timer.js';
import type { TimerOptions } from '../types.js';

export async function runTimer(options: TimerOptions): Promise<void> {
  const { waitUntilExit } = render(<Timer {...options} />);
  await waitUntilExit();
}
