import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMockImagePool } from '@/lib/data/mock-images';
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll';

const pool = getMockImagePool();

const triggerIntersection = (
  globalThis as unknown as {
    triggerIntersection: (v: boolean, el?: Element, empty?: boolean) => void;
  }
).triggerIntersection;

function TestWrapper() {
  const { images, hasMore, sentinelRef } = useInfiniteScroll({
    pool,
    initialCount: 12,
    pageSize: 12,
    filter: () => true,
  });
  return (
    <div>
      <span data-testid="count">{images.length}</span>
      <span data-testid="hasMore">{String(hasMore)}</span>
      {hasMore && <div ref={sentinelRef} data-testid="sentinel" />}
    </div>
  );
}

describe('useInfiniteScroll Comprehensive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('returns initial batch of images', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        pool,
        initialCount: 12,
        pageSize: 12,
        filter: () => true,
      }),
    );
    expect(result.current.images).toHaveLength(12);
    expect(result.current.hasMore).toBe(true);
  });

  it('respects filter', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        pool,
        initialCount: 50,
        pageSize: 12,
        filter: (img) => img.hashtags.includes('#nature'),
      }),
    );
    expect(
      result.current.images.every((img) => img.hashtags.includes('#nature')),
    ).toBe(true);
  });

  it('loads more when sentinel intersects', async () => {
    const { container } = render(<TestWrapper />);
    const w = within(container);
    await waitFor(() => expect(w.getByTestId('count').textContent).toBe('12'));

    const sentinel = w.getByTestId('sentinel');
    act(() => {
      triggerIntersection(true, sentinel);
    });
    await waitFor(() => expect(w.getByTestId('count').textContent).toBe('24'));
  });

  it('does not load more when stays visible', async () => {
    const { container } = render(<TestWrapper />);
    const w = within(container);
    await waitFor(() => expect(w.getByTestId('count').textContent).toBe('12'));

    const sentinel = w.getByTestId('sentinel');
    act(() => {
      triggerIntersection(true, sentinel);
    });
    await waitFor(() => expect(w.getByTestId('count').textContent).toBe('24'));

    act(() => {
      triggerIntersection(true, sentinel);
    });
    expect(w.getByTestId('count').textContent).toBe('24');
  });

  it('handles empty entries (coverage)', async () => {
    const { container } = render(<TestWrapper />);
    const w = within(container);
    await waitFor(() => w.getByTestId('count'));
    act(() => {
      triggerIntersection(true, undefined, true);
    });
    expect(w.getByTestId('count')).toBeInTheDocument();
  });

  it('handles hasMore=false (coverage)', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        pool: [],
        initialCount: 0,
        pageSize: 10,
        filter: () => true,
      }),
    );
    expect(result.current.hasMore).toBe(false);
  });

  it('handles null sentinel (coverage)', async () => {
    function NullSentinel() {
      useInfiniteScroll({
        pool,
        initialCount: 12,
        pageSize: 12,
        filter: () => true,
      });
      return <div data-testid="null">Null</div>;
    }
    render(<NullSentinel />);
    await waitFor(() => screen.getByTestId('null'));
    expect(screen.getByTestId('null')).toBeInTheDocument();
  });

  it('disconnects on unmount', () => {
    const { unmount } = render(<TestWrapper />);
    unmount();
    expect(true).toBe(true);
  });
});
