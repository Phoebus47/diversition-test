import { useEffect, useRef, useState } from 'react';
import {
  SCROLL_SENTINEL_ROOT_MARGIN,
  SCROLL_SENTINEL_THRESHOLD,
} from '@/lib/constants';
import type { ImageItem } from '@/lib/data/mock-images';

export interface UseInfiniteScrollOptions {
  pool: ImageItem[];
  initialCount: number;
  pageSize: number;
  filter: (img: ImageItem) => boolean;
}

export function nextDisplayCount(
  current: number,
  pageSize: number,
  max: number,
): number {
  return Math.min(current + pageSize, max);
}

export function useInfiniteScroll({
  pool,
  initialCount,
  pageSize,
  filter,
}: UseInfiniteScrollOptions) {
  const filtered = pool.filter(filter);

  const [displayCount, setDisplayCount] = useState(initialCount);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const displayCountRef = useRef(displayCount);

  const images = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  useEffect(() => {
    displayCountRef.current = displayCount;
  }, [displayCount]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          const next = nextDisplayCount(
            displayCountRef.current,
            pageSize,
            filtered.length,
          );
          setDisplayCount(next);
          observer.unobserve(sentinel);
          requestAnimationFrame(() => {
            const current = sentinelRef.current;
            if (current) observer.observe(current);
          });
        }
      },
      {
        root: null,
        rootMargin: SCROLL_SENTINEL_ROOT_MARGIN,
        threshold: SCROLL_SENTINEL_THRESHOLD,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, pageSize, filtered.length]);

  return { images, hasMore, sentinelRef };
}
