import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ImageItem } from '@/lib/data/mock-images';
import { LABELS } from '@/lib/constants';
import { useMasonryColumns } from '@/lib/hooks/use-masonry-columns';
import { useResponsiveColumns } from '@/lib/hooks/use-responsive-columns';
import { GalleryCard } from './GalleryCard';

/** Production masonry: short stagger, capped delay, reduced-motion friendly. */
const STAGGER_DELAY_PER_CARD = 0.008;
const STAGGER_DELAY_CAP = 0.08;
const STAGGER_DURATION = 0.22;
const STAGGER_Y_OFFSET = 12;
const EASE = [0.22, 1, 0.36, 1] as const;

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (
      globalThis.window === undefined ||
      typeof globalThis.window.matchMedia !== 'function'
    )
      return;
    const mq = globalThis.window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = (ev: MediaQueryListEvent) => setPrefers(ev.matches);
    queueMicrotask(() => setPrefers(mq.matches));
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return prefers;
}

export interface ImageGridProps {
  images: ImageItem[];
  onHashtagClick: (tag: string) => void;
  onImageClick: (image: ImageItem) => void;
  activeHashtag: string | null;
}

export function ImageGrid({
  images,
  onHashtagClick,
  onImageClick,
  activeHashtag,
}: Readonly<ImageGridProps>) {
  const columnCount = useResponsiveColumns();
  const columns = useMasonryColumns(images, columnCount);
  const reduceMotion = usePrefersReducedMotion();

  const cardVariants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 1, y: STAGGER_Y_OFFSET },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: {
            duration: STAGGER_DURATION,
            delay: Math.min(i * STAGGER_DELAY_PER_CARD, STAGGER_DELAY_CAP),
            ease: EASE,
          },
        }),
      };

  return (
    <motion.ul
      className="flex list-none gap-5 p-0"
      aria-label={LABELS.ariaImageGrid}
      data-testid="image-grid"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: {} }}
    >
      {columns.map((column, colIndex) => (
        <li
          key={
            column.length > 0 ? `col-${column[0].id}` : `col-empty-${colIndex}`
          }
          className="flex flex-1 flex-col"
        >
          {column.map((image, imgIndex) => {
            const globalIndex = colIndex + imgIndex * columnCount;
            return (
              <motion.div
                key={image.id}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={globalIndex}
              >
                <GalleryCard
                  image={image}
                  onHashtagClick={onHashtagClick}
                  onImageClick={onImageClick}
                  activeHashtag={activeHashtag}
                  priority={globalIndex < 12}
                />
              </motion.div>
            );
          })}
        </li>
      ))}
    </motion.ul>
  );
}
