import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

// Mock IntersectionObserver (for infinite scroll, lazy load)
let intersectionCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);

  constructor(
    private callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {
    intersectionCallback = callback;
  }
}

function triggerIntersection(isIntersecting: boolean, target?: Element) {
  if (intersectionCallback) {
    const el = target ?? document.createElement('div');
    const entry: IntersectionObserverEntry = {
      isIntersecting,
      target: el,
      boundingClientRect: el.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: el.getBoundingClientRect(),
      rootBounds: null,
      time: 0,
    };
    intersectionCallback([entry], {} as IntersectionObserver);
  }
}

(
  globalThis as unknown as { triggerIntersection: typeof triggerIntersection }
).triggerIntersection = triggerIntersection;

type IntersectionObserverConstructor = {
  new (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ): IntersectionObserver;
  prototype: IntersectionObserver;
};

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as IntersectionObserverConstructor;

// Mock next/image (exclude Next.js-specific props that cause DOM warnings)
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    priority: _priority,
    unoptimized: _unoptimized,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => React.createElement('img', { src, alt, ...props }),
}));
