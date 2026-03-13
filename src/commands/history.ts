import pc from 'picocolors';
import * as clack from '@clack/prompts';
import { loadHistory, clearHistory } from '../lib/history.js';

interface HistoryOptions {
  today: boolean;
  clear: boolean;
}

export async function runHistory(options: HistoryOptions): Promise<void> {
  if (options.clear) {
    const confirmed = await clack.confirm({
      message: 'Are you sure you want to clear all session history?',
    });
    if (clack.isCancel(confirmed) || !confirmed) {
      console.log(pc.gray('  Cancelled.'));
      return;
    }
    clearHistory();
    console.log(pc.green('  ✓ History cleared.'));
    return;
  }

  let sessions = loadHistory();

  if (options.today) {
    const today = new Date().toDateString();
    sessions = sessions.filter((s) => new Date(s.completedAt).toDateString() === today);
  }

  if (sessions.length === 0) {
    console.log(pc.gray('\n  No sessions found.\n'));
    return;
  }

  console.log(pc.bold(pc.white(`\n  Session History${options.today ? ' (Today)' : ''}\n`)));

  for (const session of sessions) {
    const date = new Date(session.completedAt);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const icon = session.type === 'break' ? '☕' : '🍅';
    console.log(
      `  ${icon}  ${pc.white(session.label)} ${pc.gray(`(${session.duration} min)`)}  ${pc.gray(`${dateStr} ${timeStr}`)}`,
    );
  }

  console.log();
}
