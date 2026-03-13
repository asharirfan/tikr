import figlet from 'figlet';
import pc from 'picocolors';

export function printBanner(): void {
  const width = process.stdout.columns || 80;
  const font: figlet.Fonts = width >= 80 ? 'ANSI Shadow' : 'Small';

  try {
    const art = figlet.textSync('tikr', { font });
    console.log(pc.white(art));
    console.log(pc.gray('  ⏱  A beautiful Pomodoro & countdown timer\n'));
  } catch {
    console.log(pc.white('\n  tikr'));
    console.log(pc.gray('  ⏱  A beautiful Pomodoro & countdown timer\n'));
  }
}
