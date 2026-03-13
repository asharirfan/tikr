import figlet from 'figlet';
import pc from 'picocolors';
import { CLI_NAME } from '../constants';

export function printBanner(): void {
  const width = process.stdout.columns || 80;
  const font: figlet.Fonts = width >= 80 ? 'ANSI Shadow' : 'Small';

  try {
    const art = figlet.textSync(CLI_NAME, { font });
    console.log(pc.white(art));
    console.log(pc.gray('  ⏱  A beautiful Pomodoro & countdown timer\n'));
  } catch {
    console.log(pc.white(`\n  ${CLI_NAME}`));
    console.log(pc.gray('  ⏱  A beautiful Pomodoro & countdown timer\n'));
  }
}
