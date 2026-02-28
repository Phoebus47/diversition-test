import { useEffect, useRef, useState } from 'react';
import { getMockImagePool, type ImageItem } from '@/lib/data/mock-images';

export interface UseInfiniteScrollOptions {
  initialCount: number;
  pageSize: number;
  filter: (img: ImageItem) => boolean;
}

export function useInfiniteScroll({
  initialCount,
  pageSize,
  filter,
}: UseInfiniteScrollOptions) {
  const pool = getMockImagePool();
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
      { rootMargin: '200px', threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, pageSize, filtered.length]);

  return { images, hasMore, sentinelRef };
}
