'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BACK_TO_TOP_VISIBLE_SCROLL_Y, LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () =>
      setVisible(globalThis.window.scrollY > BACK_TO_TOP_VISIBLE_SCROLL_Y);
    globalThis.window.addEventListener('scroll', handleScroll, {
      passive: true,
    });
    return () => globalThis.window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    globalThis.window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.button
      type="button"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-40 cursor-pointer',
        'flex h-11 w-11 items-center justify-center rounded-full',
        'border border-border-primary bg-surface-primary text-text-secondary',
        'shadow-(--shadow-lg)',
        'hover:bg-accent hover:text-tag-active-text hover:shadow-(--shadow-xl)',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        !visible && 'pointer-events-none',
      )}
      aria-label={LABELS.ariaBackToTop}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 14V4M9 4l-4 4M9 4l4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
