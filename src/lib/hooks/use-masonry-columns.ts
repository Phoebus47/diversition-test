import { useMemo } from 'react';
import type { ImageItem } from '@/lib/data/mock-images';

/**
 * Distributes images into columns using a greedy shortest-column algorithm.
 * Items are appended to the column with the smallest cumulative height,
 * which keeps existing assignments stable when new items are added.
 */
export function useMasonryColumns(
  images: ImageItem[],
  columnCount: number,
): ImageItem[][] {
  return useMemo(() => {
    if (columnCount <= 0) return [];
    const columns: ImageItem[][] = Array.from(
      { length: columnCount },
      () => [],
    );
    const heights: number[] = new Array(columnCount).fill(0);

    for (const image of images) {
      const shortestIndex = heights.indexOf(Math.min(...heights));
      columns[shortestIndex].push(image);
      heights[shortestIndex] += image.height / image.width;
    }

    return columns;
  }, [images, columnCount]);
}
