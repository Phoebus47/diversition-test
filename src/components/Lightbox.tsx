'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import type { ImageItem } from '@/lib/data/mock-images';
import { cn } from '@/lib/utils';

export interface LightboxProps {
  images: ImageItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const currentImage = currentIndex !== null ? images[currentIndex] : null;

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (currentIndex !== null) {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
    },
    [currentIndex, images.length, onNavigate],
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (currentIndex !== null) {
        onNavigate((currentIndex + 1) % images.length);
      }
    },
    [currentIndex, images.length, onNavigate],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    },
    [onClose, handlePrev, handleNext],
  );

  useEffect(() => {
    if (currentIndex === null) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, handleKeyDown]);

  if (!currentImage) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center cursor-pointer',
        'bg-black/90 backdrop-blur-md',
        'animate-lightbox-in',
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.alt}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className={cn(
          'absolute right-6 top-6 z-20 cursor-pointer',
          'flex h-12 w-12 items-center justify-center rounded-full',
          'bg-white/10 text-white/80 backdrop-blur-sm',
          'transition-all duration-200',
          'hover:bg-white/20 hover:text-white hover:scale-110',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        )}
        aria-label="Close lightbox"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6l-12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Navigation Buttons */}
      <div className="absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 justify-between px-6 sm:flex">
        <button
          onClick={handlePrev}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/60 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:scale-110"
          aria-label="Previous image"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/60 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:scale-110"
          aria-label="Next image"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Image Container */}
      <div
        className="animate-lightbox-zoom relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={currentImage.width}
            height={currentImage.height}
            className="h-auto max-h-[80vh] w-auto max-w-[90vw] object-contain"
            sizes="90vw"
            priority
            unoptimized
          />
        </div>

        {/* Info Overlay */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            {currentImage.hashtags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-xs font-medium text-white/40 tracking-widest uppercase">
            {currentIndex !== null ? currentIndex + 1 : 0} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}
