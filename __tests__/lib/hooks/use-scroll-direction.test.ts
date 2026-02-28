import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useScrollDirection } from '@/lib/hooks/use-scroll-direction';

describe('useScrollDirection', () => {
  const originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    if (originalScrollY) {
      Object.defineProperty(window, 'scrollY', originalScrollY);
    }
  });

  it('returns true initially (nav visible)', () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toBe(true);
  });

  it('stays true when scrollY is at or below threshold (80px)', async () => {
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        setTimeout(cb, 0);
        return 0;
      });
    const { result } = renderHook(() => useScrollDirection());

    Object.defineProperty(window, 'scrollY', {
      value: 200,
      writable: true,
      configurable: true,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    await vi.waitFor(() => {
      expect(result.current).toBe(false);
    });

    Object.defineProperty(window, 'scrollY', {
      value: 50,
      writable: true,
      configurable: true,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });

    Object.defineProperty(window, 'scrollY', {
      value: 80,
      writable: true,
      configurable: true,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });

    raf.mockRestore();
  });

  it('returns false when scrolling down past threshold', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (cb: FrameRequestCallback) => {
        setTimeout(cb, 0);
        return 0;
      },
    );
    const { result } = renderHook(() => useScrollDirection());

    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true,
      configurable: true,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    await vi.waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('returns true when scrolling up after having scrolled down', async () => {
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        setTimeout(cb, 0);
        return 0;
      });

    const { result } = renderHook(() => useScrollDirection());

    Object.defineProperty(window, 'scrollY', {
      value: 200,
      writable: true,
      configurable: true,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    await vi.waitFor(() => {
      expect(result.current).toBe(false);
    });

    Object.defineProperty(window, 'scrollY', {
      value: 150,
      writable: true,
      configurable: true,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });

    raf.mockRestore();
  });

  it('cleans up scroll listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollDirection());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeSpy.mockRestore();
  });
});
