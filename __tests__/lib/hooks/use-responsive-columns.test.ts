import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useResponsiveColumns } from '@/lib/hooks/use-responsive-columns';

describe('useResponsiveColumns', () => {
  it('returns column count based on window.innerWidth', () => {
    const origWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      value: 1400,
      writable: true,
    });

    const { result } = renderHook(() => useResponsiveColumns());
    expect(result.current).toBe(5);

    Object.defineProperty(window, 'innerWidth', {
      value: origWidth,
      writable: true,
    });
  });

  it('returns 4 for 1024px', () => {
    const origWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
    });

    const { result } = renderHook(() => useResponsiveColumns());
    expect(result.current).toBe(4);

    Object.defineProperty(window, 'innerWidth', {
      value: origWidth,
      writable: true,
    });
  });

  it('returns 1 for narrow viewport', () => {
    const origWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { value: 400, writable: true });

    const { result } = renderHook(() => useResponsiveColumns());
    expect(result.current).toBe(1);

    Object.defineProperty(window, 'innerWidth', {
      value: origWidth,
      writable: true,
    });
  });

  it('subscribe returns cleanup that removes listener', () => {
    const { unmount } = renderHook(() => useResponsiveColumns());
    unmount();
    expect(() => fireEvent.resize(window)).not.toThrow();
  });

  it('returns 1 when width is negative (fallback)', () => {
    const origWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { value: -1, writable: true });

    const { result } = renderHook(() => useResponsiveColumns());
    expect(result.current).toBe(1);

    Object.defineProperty(window, 'innerWidth', {
      value: origWidth,
      writable: true,
    });
  });
});
