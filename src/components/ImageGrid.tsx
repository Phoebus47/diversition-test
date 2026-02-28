import type { ImageItem } from '@/lib/data/mock-images';
import { useMasonryColumns } from '@/lib/hooks/use-masonry-columns';
import { useResponsiveColumns } from '@/lib/hooks/use-responsive-columns';
import { cn } from '@/lib/utils';
import { GalleryCard } from './GalleryCard';

const STAGGER_CLASSES = [
  'stagger-0',
  'stagger-30',
  'stagger-60',
  'stagger-90',
  'stagger-120',
  'stagger-150',
  'stagger-180',
  'stagger-210',
  'stagger-240',
  'stagger-270',
  'stagger-300',
] as const;

export function getStaggerClass(index: number): string {
  return (
    STAGGER_CLASSES[Math.min(index, STAGGER_CLASSES.length - 1)] ??
    'stagger-300'
  );
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

  return (
    <div className="flex gap-5" data-testid="image-grid">
      {columns.map((column, colIndex) => (
        <div
          key={column.map((img) => img.id).join('-') || `col-${colIndex}`}
          className="flex flex-1 flex-col"
        >
          {column.map((image, imgIndex) => {
            const globalIndex = colIndex + imgIndex * columnCount;
            return (
              <div
                key={image.id}
                className={cn('animate-card-in', getStaggerClass(globalIndex))}
              >
                <GalleryCard
                  image={image}
                  onHashtagClick={onHashtagClick}
                  onImageClick={onImageClick}
                  activeHashtag={activeHashtag}
                  priority={globalIndex < 12}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
