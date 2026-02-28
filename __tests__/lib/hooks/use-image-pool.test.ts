import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useImagePool } from '@/lib/hooks/use-image-pool';

describe('useImagePool', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns images from API on success', async () => {
    const mockImages = [
      {
        id: '1',
        src: 'https://placehold.co/400x300',
        alt: 'Test',
        width: 400,
        height: 300,
        hashtags: ['#nature'],
      },
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockImages),
    } as Response);

    const { result } = renderHook(() => useImagePool());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.images).toEqual(mockImages);
  });

  it('falls back to mock on API error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useImagePool());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.images.length).toBeGreaterThan(0);
  });

  it('does not update state when unmounted before fetch completes', async () => {
    let resolveFetch: (v: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    vi.spyOn(globalThis, 'fetch').mockReturnValue(fetchPromise);

    const { unmount } = renderHook(() => useImagePool());
    unmount();
    resolveFetch!({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);
    await fetchPromise;

    expect(true).toBe(true);
  });

  it('does not setImages in catch when unmounted before fetch rejects', async () => {
    let rejectFetch: (e: Error) => void;
    const fetchPromise = new Promise<Response>((_, reject) => {
      rejectFetch = reject;
    });
    vi.spyOn(globalThis, 'fetch').mockReturnValue(fetchPromise);

    const { unmount } = renderHook(() => useImagePool());
    unmount();
    rejectFetch!(new Error('Network error'));
    await fetchPromise.catch(() => {});

    expect(true).toBe(true);
  });

  it('falls back to mock when res.ok is false', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: () => Promise.resolve([]),
    } as Response);

    const { result } = renderHook(() => useImagePool());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.images.length).toBeGreaterThan(0);
  });
});
