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

export function useInfiniteScroll({
  pool,
  initialCount,
  pageSize,
  filter,
}: UseInfiniteScrollOptions) {
  const filtered = pool.filter(filter);

  const [displayCount, setDisplayCount] = useState(initialCount);
  const sentinelRef = useRef<HTMLDivElement>(null);
  /** Track previous intersecting state so we only load on transition into view (not while staying visible). */
  const wasIntersectingRef = useRef(false);

  const images = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const isIntersecting = entry.isIntersecting;
        const justEntered = isIntersecting && !wasIntersectingRef.current;
        wasIntersectingRef.current = isIntersecting;

        if (justEntered) {
          setDisplayCount((c) => Math.min(c + pageSize, filtered.length));
          observer.unobserve(sentinel);
          requestAnimationFrame(() => observer.observe(sentinel));
        }
      },
      {
        root: null,
        rootMargin: SCROLL_SENTINEL_ROOT_MARGIN,
        threshold: SCROLL_SENTINEL_THRESHOLD,
      },
    );

    wasIntersectingRef.current = false;
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, pageSize, filtered.length]);

  return { images, hasMore, sentinelRef };
}
