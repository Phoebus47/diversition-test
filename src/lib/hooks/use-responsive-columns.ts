import { useSyncExternalStore } from 'react';

const BREAKPOINTS = [
  { min: 1280, cols: 5 },
  { min: 1024, cols: 4 },
  { min: 768, cols: 3 },
  { min: 640, cols: 2 },
  { min: 0, cols: 1 },
] as const;

function getColumnCount(width: number): number {
  for (const bp of BREAKPOINTS) {
    if (width >= bp.min) return bp.cols;
  }
  return 1;
}

function subscribe(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getSnapshot() {
  return getColumnCount(window.innerWidth);
}

function getServerSnapshot() {
  return 4;
}

/** Returns the current column count based on viewport width. */
export function useResponsiveColumns(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
