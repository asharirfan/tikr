import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { saveSession } from '../lib/history.js';
import { sendNotification } from '../lib/notify.js';
import { playSound } from '../lib/sound.js';
import type { TimerOptions } from '../types.js';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function buildProgressBar(progress: number, width = 30): string {
  const filled = Math.round(progress * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export function Timer({ label, totalSeconds, type, notify, sound, quiet }: TimerOptions) {
  const { exit } = useApp();
  const remainingRef = useRef(totalSeconds);
  const [displayRemaining, setDisplayRemaining] = useState(totalSeconds);
  const [paused, setPaused] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (paused || completed) return;

    const interval = setInterval(() => {
      remainingRef.current -= 1;
      setDisplayRemaining(remainingRef.current);

      if (remainingRef.current <= 0) {
        clearInterval(interval);
        setCompleted(true);
        const durationMinutes = Math.round(totalSeconds / 60);
        saveSession({
          type,
          label,
          duration: durationMinutes,
          completedAt: new Date().toISOString(),
        });
        if (notify) sendNotification(label, type);
        if (sound) playSound();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, completed]);

  useEffect(() => {
    if (!completed) return;
    const timeout = setTimeout(() => exit(), 3000);
    return () => clearTimeout(timeout);
  }, [completed]);

  useInput((input, key) => {
    if (completed) {
      if (input === 'q' || key.escape) exit();
      return;
    }
    if (input === 'p') setPaused((prev) => !prev);
    if (input === 'r') {
      remainingRef.current = totalSeconds;
      setDisplayRemaining(totalSeconds);
      setPaused(false);
    }
    if (input === 'q' || key.escape) exit();
  });

  const progress = (totalSeconds - displayRemaining) / totalSeconds;
  const percent = Math.round(progress * 100);
  const bar = buildProgressBar(progress);
  const timeStr = formatTime(displayRemaining);
  const durationMinutes = Math.round(totalSeconds / 60);

  if (completed) {
    return (
      <Box flexDirection="column" paddingLeft={2} paddingTop={1} paddingBottom={1}>
        <Text>
          {'✅ Session complete — '}
          <Text bold>{label}</Text>
          {` (${durationMinutes} min)`}
        </Text>
        <Text>
          {type === 'break' ? '🍅 Break over — time to focus!' : '🔔 Time to take a break!'}
        </Text>
        <Box marginTop={1}>
          <Text dimColor>{'Exiting in 3 seconds... Press [q] to quit now'}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingLeft={2} paddingTop={1} paddingBottom={1}>
      <Text bold>{`⏱  ${label} — ${timeStr}`}</Text>
      <Box marginTop={1}>
        <Text>{`${bar}  ${percent}%`}</Text>
      </Box>
      <Box marginTop={1}>
        <Text>{'Time remaining: '}</Text>
        <Text bold>{timeStr}</Text>
        {paused && <Text color="yellow">{'  [PAUSED]'}</Text>}
      </Box>
      {!quiet && (
        <Box marginTop={1}>
          <Text
            dimColor
          >{`Press [p] to ${paused ? 'resume' : 'pause'} · [r] to reset · [q] to quit`}</Text>
        </Box>
      )}
    </Box>
  );
}
