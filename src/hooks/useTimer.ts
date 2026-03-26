import { useEffect } from 'react';

export const useTimer = (
  running: boolean,
  onTick: () => void,
  interval = 1000
): void => {
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(onTick, interval);
    return () => window.clearInterval(id);
  }, [running, onTick, interval]);
};
