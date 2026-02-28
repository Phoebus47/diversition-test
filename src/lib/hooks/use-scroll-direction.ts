import { useEffect, useRef, useState } from 'react';
import { SCROLL_NAV_VISIBLE_THRESHOLD } from '@/lib/constants';

/**
 * Returns true when the nav should be visible: at top, or when scrolling up.
 * Returns false when user has scrolled down past threshold and is still scrolling down.
 */
export function useScrollDirection(): boolean {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = globalThis.window.scrollY;
        if (y <= SCROLL_NAV_VISIBLE_THRESHOLD) {
          setVisible(true);
        } else if (y > lastY.current) {
          setVisible(false);
        } else {
          setVisible(true);
        }
        lastY.current = y;
        ticking = false;
      });
    }

    lastY.current = globalThis.window.scrollY;
    globalThis.window.addEventListener('scroll', onScroll, { passive: true });
    return () => globalThis.window.removeEventListener('scroll', onScroll);
  }, []);

  return visible;
}
