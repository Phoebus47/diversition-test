'use client';

import { useEffect, useState } from 'react';
import { getMockImagePool, type ImageItem } from '@/lib/data/mock-images';

export function useImagePool() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchImages() {
      try {
        const res = await fetch('/api/images');
        if (!res.ok) throw new Error('API error');
        const data: ImageItem[] = await res.json();
        if (!cancelled) setImages(data);
      } catch {
        if (!cancelled) setImages(getMockImagePool());
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchImages();
    return () => {
      cancelled = true;
    };
  }, []);

  return { images, isLoading };
}
