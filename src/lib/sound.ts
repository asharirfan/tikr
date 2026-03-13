import { execSync } from 'child_process';

export function playSound(): void {
  try {
    if (process.platform === 'darwin') {
      execSync('afplay /System/Library/Sounds/Glass.aiff', { stdio: 'ignore' });
    } else {
      process.stdout.write('\x07');
    }
  } catch {
    process.stdout.write('\x07');
  }
}
