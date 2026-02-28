import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyTheme, getStoredTheme, useTheme } from '@/lib/hooks/use-theme';

describe('useTheme', () => {
  const storageKey = 'theme';

  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    const matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    Object.defineProperty(globalThis.window, 'matchMedia', {
      value: matchMedia,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete globalThis.document.documentElement.dataset.theme;
  });

  it('returns theme, setTheme, and effectiveTheme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBeDefined();
    expect(typeof result.current.setTheme).toBe('function');
    expect(result.current.effectiveTheme).toBe('light');
  });

  it('reads stored theme from localStorage after mount', async () => {
    vi.mocked(Storage.prototype.getItem).mockReturnValue('dark');
    const { result } = renderHook(() => useTheme());
    await act(async () => {
      await new Promise<void>((r) => queueMicrotask(r));
    });
    expect(result.current.theme).toBe('dark');
  });

  it('applies theme to document when setTheme is called', () => {
    const { result } = renderHook(() => useTheme());
    const el = globalThis.document.documentElement;
    act(() => result.current.setTheme('light'));
    expect(el.dataset.theme).toBe('light');
    act(() => result.current.setTheme('dark'));
    expect(el.dataset.theme).toBe('dark');
    act(() => result.current.setTheme('system'));
    expect(el.dataset.theme).toBeUndefined();
  });

  it('persists theme to localStorage when setTheme is called', () => {
    const setItem = vi.mocked(Storage.prototype.setItem);
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('light'));
    expect(setItem).toHaveBeenCalledWith(storageKey, 'light');
  });

  it('ignores invalid stored value', async () => {
    vi.mocked(Storage.prototype.getItem).mockReturnValue('invalid');
    const { result } = renderHook(() => useTheme());
    await act(async () => {
      await new Promise<void>((r) => queueMicrotask(r));
    });
    expect(result.current.theme).toBe('system');
  });

  it('getStoredTheme returns system when document is undefined', () => {
    const doc = globalThis.document;
    try {
      (globalThis as unknown as { document: undefined }).document = undefined;
      expect(getStoredTheme()).toBe('system');
    } finally {
      (globalThis as unknown as { document: typeof doc }).document = doc;
    }
  });

  it('applyTheme no-op when documentElement is missing', () => {
    const doc = globalThis.document;
    try {
      (
        globalThis as unknown as { document: { documentElement: null } }
      ).document = {
        documentElement: null,
      };
      expect(() => applyTheme('light')).not.toThrow();
    } finally {
      (globalThis as unknown as { document: typeof doc }).document = doc;
    }
  });

  it('effectiveTheme follows theme when not system', async () => {
    vi.mocked(Storage.prototype.getItem).mockReturnValue('dark');
    const { result } = renderHook(() => useTheme());
    await act(async () => {
      await new Promise<void>((r) => queueMicrotask(r));
    });
    expect(result.current.theme).toBe('dark');
    expect(result.current.effectiveTheme).toBe('dark');
  });

  it('effectiveTheme is dark when theme is system and prefers-color-scheme is dark', async () => {
    let darkMode = true;
    const changeListeners: Array<() => void> = [];
    const matchMedia = vi.fn(() => ({
      get matches() {
        return darkMode;
      },
      addEventListener(_: string, fn: () => void) {
        changeListeners.push(fn);
      },
      removeEventListener: vi.fn(),
    }));
    Object.defineProperty(globalThis.window, 'matchMedia', {
      value: matchMedia,
      configurable: true,
    });
    const { result } = renderHook(() => useTheme());
    await act(async () => {
      await new Promise<void>((r) => queueMicrotask(r));
    });
    expect(result.current.theme).toBe('system');
    expect(result.current.effectiveTheme).toBe('dark');
    darkMode = false;
    changeListeners.forEach((fn) => fn());
    await act(async () => {});
    expect(result.current.effectiveTheme).toBe('light');
  });

  it('effectiveTheme defaults to light when matchMedia is unavailable', async () => {
    Object.defineProperty(globalThis.window, 'matchMedia', {
      value: undefined,
      configurable: true,
    });
    const { result } = renderHook(() => useTheme());
    await act(async () => {
      await new Promise<void>((r) => queueMicrotask(r));
    });
    expect(result.current.theme).toBe('system');
    expect(result.current.effectiveTheme).toBe('light');
  });

  it('cleans up matchMedia listener on unmount', () => {
    const removeEventListener = vi.fn();
    Object.defineProperty(globalThis.window, 'matchMedia', {
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener,
      })),
      configurable: true,
    });
    const { unmount } = renderHook(() => useTheme());
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('setTheme does not throw when localStorage is undefined', () => {
    const storage = globalThis.localStorage;
    const { result } = renderHook(() => useTheme());
    try {
      (globalThis as unknown as { localStorage: undefined }).localStorage =
        undefined;
      expect(() => act(() => result.current.setTheme('light'))).not.toThrow();
    } finally {
      (globalThis as unknown as { localStorage: typeof storage }).localStorage =
        storage;
    }
  });
});
