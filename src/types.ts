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

export interface Preset {
  label: string;
  minutes: number;
}

export type PresetName = string; // e.g. 'study'

