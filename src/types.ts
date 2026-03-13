export type SessionType = 'pomodoro' | 'break' | 'custom';

export interface Session {
  type: SessionType;
  label: string;
  duration: number;
  completedAt: string;
}

export interface TimerOptions {
  label: string;
  totalSeconds: number;
  type: SessionType;
  notify: boolean;
  sound: boolean;
  quiet: boolean;
}
