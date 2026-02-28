import { useCallback, useMemo, useState } from 'react';
import type { ImageItem } from '@/lib/data/mock-images';

export function useGalleryFilter() {
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);

  const filter = useMemo(
    () =>
      activeHashtag
        ? (img: ImageItem) => img.hashtags.includes(activeHashtag)
        : () => true,
    [activeHashtag],
  );

  const onHashtagClick = useCallback((tag: string) => {
    setActiveHashtag((current) => (current === tag ? null : tag));
  }, []);

  const onClearFilter = useCallback(() => {
    setActiveHashtag(null);
  }, []);

  return { activeHashtag, filter, onHashtagClick, onClearFilter };
}
