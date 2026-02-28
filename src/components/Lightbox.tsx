'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ImageItem } from '@/lib/data/mock-images';
import { LABELS } from '@/lib/constants';
import { EASE, TAP_DURATION } from '@/lib/motion-constants';
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
}: Readonly<LightboxProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const currentImage =
    currentIndex === null ? null : (images[currentIndex] ?? null);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onNavigate((currentIndex! - 1 + images.length) % images.length);
    },
    [currentIndex, images.length, onNavigate],
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onNavigate((currentIndex! + 1) % images.length);
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
    document.body.classList.add('lightbox-open');
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('lightbox-open');
    };
  }, [currentIndex, handleKeyDown]);

  const prevDialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (currentIndex === null) {
      const toClose = prevDialogRef.current ?? dialog;
      if (toClose && typeof toClose.close === 'function') toClose.close();
      prevDialogRef.current = null;
    } else if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
      prevDialogRef.current = dialog;
    }
  }, [currentIndex]);

  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  if (!currentImage) return null;

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center cursor-pointer',
        'border-0 p-0 w-screen h-screen max-w-none max-h-none',
      )}
      onClose={onClose}
      aria-modal
      aria-label={currentImage.alt}
    >
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: TAP_DURATION }}
      />
      <button
        type="button"
        data-testid="lightbox-backdrop"
        className="absolute inset-0 z-0 cursor-pointer border-0 bg-transparent p-0"
        aria-label={LABELS.ariaCloseLightbox}
        onClick={onClose}
        onKeyDown={handleBackdropKeyDown}
      />
      <button
        type="button"
        data-testid="lightbox-close-btn"
        onClick={onClose}
        className={cn(
          'absolute right-6 top-6 z-20 cursor-pointer',
          'flex h-12 w-12 items-center justify-center rounded-full',
          'bg-white/10 text-white/80 backdrop-blur-sm',
          'transition-all duration-200',
          'hover:bg-white/20 hover:text-white hover:scale-110',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        )}
        aria-label={LABELS.ariaCloseLightbox}
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

      <div className="absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 justify-between px-6 sm:flex">
        <button
          onClick={handlePrev}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/60 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:scale-110"
          aria-label={LABELS.ariaPreviousImage}
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
          aria-label={LABELS.ariaNextImage}
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

      <motion.button
        type="button"
        data-testid="lightbox-content"
        className="relative z-10 flex flex-col items-center cursor-default border-0 bg-transparent p-0 text-left"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        aria-label={LABELS.getAriaLightboxDetails(currentImage.alt)}
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: TAP_DURATION, ease: EASE }}
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
            {currentIndex! + 1} / {images.length}
          </span>
        </div>
      </motion.button>
    </dialog>
  );
}
