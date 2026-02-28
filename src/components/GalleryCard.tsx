import { useState, useCallback } from 'react';
import Image from 'next/image';
import type { ImageItem } from '@/lib/data/mock-images';
import { cn } from '@/lib/utils';

export interface GalleryCardProps {
  image: ImageItem;
  onHashtagClick: (tag: string) => void;
  onImageClick: (image: ImageItem) => void;
  activeHashtag: string | null;
  priority?: boolean;
}

export function GalleryCard({
  image,
  onHashtagClick,
  onImageClick,
  activeHashtag,
  priority = false,
}: GalleryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  }, []);

  return (
    <article
      className={cn(
        'animate-card-in mb-5',
        'group overflow-hidden',
        'rounded-(--card-radius) border border-card-border bg-card-bg',
        'shadow-(--shadow-md)',
        'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:shadow-(--shadow-xl) hover:-translate-y-0.5',
      )}
      data-testid="gallery-card"
    >
      {/* Image container — clickable for lightbox */}
      <div
        className="relative cursor-zoom-in overflow-hidden bg-muted/10 min-h-25"
        onClick={() => !hasError && onImageClick(image)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!hasError) onImageClick(image);
          }
        }}
        aria-label={`View ${image.alt} in full screen`}
      >
        {!isLoaded && !hasError && (
          <div className="animate-shimmer absolute inset-0 z-10" />
        )}

        {hasError ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-text-tertiary bg-surface-secondary">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="mb-2 opacity-30"
            >
              <path
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              Image Unavailable
            </span>
          </div>
        ) : (
          <>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={cn(
                'block h-auto w-full object-cover transition-all duration-700 ease-out will-change-transform group-hover:scale-[1.03]',
                isLoaded ? 'animate-image-in' : 'opacity-0',
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              unoptimized
            />
            {/* View Icon Overlay (Affordance) */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white animate-overlay-in">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2.5">
        {image.hashtags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={(e) => {
              handleRipple(e);
              onHashtagClick(tag);
            }}
            className={cn(
              'ripple-container cursor-pointer',
              'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium leading-none tracking-wide',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
              activeHashtag === tag
                ? 'bg-tag-active-bg text-tag-active-text shadow-[0_0_0_1px_var(--accent),0_2px_8px_var(--accent-glow)]'
                : 'bg-tag-bg text-tag-text hover:bg-tag-hover-bg hover:text-tag-hover-text',
            )}
            aria-pressed={activeHashtag === tag}
          >
            {tag}
          </button>
        ))}
      </div>
    </article>
  );
}
