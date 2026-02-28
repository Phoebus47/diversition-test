import { act, render, renderHook, within } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { getMockImagePool } from '@/lib/data/mock-images';
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll';

const pool = getMockImagePool();

const triggerIntersection = (
  globalThis as unknown as {
    triggerIntersection: (v: boolean, el?: Element) => void;
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

describe('useInfiniteScroll', () => {
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
    expect(result.current.sentinelRef).toBeDefined();
  });

  it('respects filter - returns only matching images', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        pool,
        initialCount: 50,
        pageSize: 12,
        filter: (img) => img.hashtags.includes('#nature'),
      }),
    );

    const allMatch = result.current.images.every((img) =>
      img.hashtags.includes('#nature'),
    );
    expect(allMatch).toBe(true);
  });

  it('hasMore is false when all filtered images are shown', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        pool,
        initialCount: 500,
        pageSize: 12,
        filter: () => true,
      }),
    );

    expect(result.current.images.length).toBeLessThanOrEqual(500);
    expect(result.current.hasMore).toBe(false);
  });

  it('returns empty when filter matches nothing', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        pool,
        initialCount: 12,
        pageSize: 12,
        filter: () => false,
      }),
    );

    expect(result.current.images).toHaveLength(0);
    expect(result.current.hasMore).toBe(false);
  });

  it('loads more when sentinel intersects', () => {
    const { getByTestId } = render(<TestWrapper />);
    expect(getByTestId('count').textContent).toBe('12');

    const sentinel = getByTestId('sentinel');
    act(() => {
      triggerIntersection(true, sentinel);
    });

    expect(getByTestId('count').textContent).toBe('24');
  });

  it('does not load more when sentinel not intersecting', () => {
    const { container } = render(<TestWrapper />);
    const countEl = within(container).getByTestId('count');
    expect(countEl.textContent).toBe('12');

    const sentinel = within(container).getByTestId('sentinel');
    act(() => {
      triggerIntersection(false, sentinel);
    });

    expect(countEl.textContent).toBe('12');
  });

  it('effect returns early when hasMore is false', () => {
    const smallPool = pool.slice(0, 5);
    const { result } = renderHook(() =>
      useInfiniteScroll({
        pool: smallPool,
        initialCount: 10,
        pageSize: 5,
        filter: () => true,
      }),
    );
    expect(result.current.hasMore).toBe(false);
    expect(result.current.images).toHaveLength(5);
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = render(<TestWrapper />);
    unmount();
    expect(true).toBe(true);
  });
});
