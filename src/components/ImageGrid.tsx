import type { ImageItem } from '@/lib/data/mock-images';
import { useMasonryColumns } from '@/lib/hooks/use-masonry-columns';
import { useResponsiveColumns } from '@/lib/hooks/use-responsive-columns';
import { GalleryCard } from './GalleryCard';

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
}: ImageGridProps) {
  const columnCount = useResponsiveColumns();
  const columns = useMasonryColumns(images, columnCount);

  return (
    <div className="flex gap-5" data-testid="image-grid">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-1 flex-col">
          {column.map((image, imgIndex) => {
            const globalIndex = colIndex + imgIndex * columnCount;
            return (
              <div
                key={image.id}
                style={{
                  animationDelay: `${Math.min(globalIndex * 30, 300)}ms`,
                }}
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
