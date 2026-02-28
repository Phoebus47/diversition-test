import '@testing-library/jest-dom/vitest';
import React from 'react';
import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
});

// Mock IntersectionObserver (for infinite scroll, lazy load)
let intersectionCallback: IntersectionObserverCallback | null = null;

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = mockUnobserve;
  takeRecords = vi.fn().mockReturnValue([]);

  constructor(
    public callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {
    intersectionCallback = callback;
  }
}

function triggerIntersection(
  isIntersecting: boolean,
  target?: Element,
  emptyEntries = false,
) {
  if (intersectionCallback) {
    if (emptyEntries) {
      intersectionCallback([], {} as IntersectionObserver);
      return;
    }
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

vi.spyOn(globalThis, 'IntersectionObserver');

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
