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

  const images = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setDisplayCount((c) => Math.min(c + pageSize, filtered.length));
        }
      },
      {
        rootMargin: SCROLL_SENTINEL_ROOT_MARGIN,
        threshold: SCROLL_SENTINEL_THRESHOLD,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, pageSize, filtered.length]);

  return { images, hasMore, sentinelRef };
}
