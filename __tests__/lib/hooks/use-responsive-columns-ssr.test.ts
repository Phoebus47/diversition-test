import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react', async (importOriginal) => {
  const orig = await importOriginal<typeof import('react')>();
  return {
    ...orig,
    useSyncExternalStore: (
      _subscribe: () => () => void,
      _getSnapshot: () => number,
      getServerSnapshot: () => number,
    ) => getServerSnapshot(),
  };
});

describe('useResponsiveColumns (SSR)', () => {
  it('getServerSnapshot returns 4', async () => {
    const { useResponsiveColumns } =
      await import('@/lib/hooks/use-responsive-columns');
    const { result } = renderHook(() => useResponsiveColumns());
    expect(result.current).toBe(4);
  });
});
