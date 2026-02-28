'use client';

import { useCallback, useState } from 'react';
import { BackToTop } from '@/components/BackToTop';
import { Footer } from '@/components/Footer';
import { HashtagFilter } from '@/components/HashtagFilter';
import { ImageGrid } from '@/components/ImageGrid';
import { Lightbox } from '@/components/Lightbox';
import { LABELS } from '@/lib/constants';
import type { ImageItem } from '@/lib/data/mock-images';
import { useGalleryFilter } from '@/lib/hooks/use-gallery-filter';
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll';

const INITIAL_LOAD = 12;
const PAGE_SIZE = 12;

export function GalleryClient() {
  const { activeHashtag, filter, onHashtagClick, onClearFilter } =
    useGalleryFilter();

  const { images, hasMore, sentinelRef } = useInfiniteScroll({
    initialCount: INITIAL_LOAD,
    pageSize: PAGE_SIZE,
    filter,
  });

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleImageClick = useCallback(
    (image: ImageItem) => {
      const index = images.findIndex((img) => img.id === image.id);
      setLightboxIndex(index !== -1 ? index : null);
    },
    [images],
  );

  const handleLightboxClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handleNavigate = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Sticky Header with integrated filter */}
      <header className="sticky top-0 z-10 border-b border-border-primary bg-surface-primary/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-(--page-max-width) items-center justify-between px-6 py-4 lg:px-8">
          <h1 className="bg-linear-to-r from-(--gradient-start) via-(--gradient-mid) to-(--gradient-end) bg-clip-text text-xl font-bold tracking-tight text-transparent">
            {LABELS.galleryTitle}
          </h1>

          {/* Filter integrated into header */}
          <div className="flex items-center gap-3">
            <HashtagFilter
              activeHashtag={activeHashtag}
              onClear={onClearFilter}
            />
            <span className="hidden text-sm text-text-tertiary sm:block">
              Browse &amp; filter by hashtags
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-(--page-max-width) px-6 py-8 lg:px-8 lg:py-10">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-subtle">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="text-accent"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 20l-3-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-base font-medium text-text-secondary">
              {LABELS.noResults}
            </p>
            <p className="mt-1 text-sm text-text-tertiary">
              Try selecting a different hashtag
            </p>
          </div>
        ) : (
          <>
            <ImageGrid
              images={images}
              onHashtagClick={onHashtagClick}
              onImageClick={handleImageClick}
              activeHashtag={activeHashtag}
            />
            {hasMore ? (
              <div
                ref={sentinelRef}
                className="flex items-center justify-center gap-1.5 py-12"
                aria-hidden
              >
                <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent [animation-delay:0.15s]" />
                <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent [animation-delay:0.3s]" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border-t border-border-subtle mt-10">
                <div className="text-xs font-bold tracking-[0.2em] text-text-tertiary uppercase">
                  You&apos;ve reached the end
                </div>
                <div className="mt-2 text-sm text-text-tertiary opacity-40">
                  Discovering beauty, one frame at a time.
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        onClose={handleLightboxClose}
        onNavigate={handleNavigate}
      />

      {/* Footer */}
      <Footer />

      {/* Back to top */}
      <BackToTop />
    </div>
  );
}
