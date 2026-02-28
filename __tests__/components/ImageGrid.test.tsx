import { act, render, screen, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageGrid } from '@/components/ImageGrid';
import { useMasonryColumns } from '@/lib/hooks/use-masonry-columns';
import type { ImageItem } from '@/lib/data/mock-images';

vi.mock('@/lib/hooks/use-responsive-columns', () => ({
  useResponsiveColumns: () => 2,
}));

vi.mock('@/lib/hooks/use-masonry-columns', async (importOriginal) => {
  const mod =
    await importOriginal<typeof import('@/lib/hooks/use-masonry-columns')>();
  return {
    useMasonryColumns: vi.fn(
      (images: ImageItem[], cols: number) =>
        mod.useMasonryColumns(images, cols) as ReturnType<
          typeof mod.useMasonryColumns
        >,
    ),
  };
});

const mockImages: ImageItem[] = [
  {
    id: '1',
    src: 'https://placehold.co/400x300',
    alt: 'Test 1',
    width: 400,
    height: 300,
    hashtags: ['#nature'],
  },
  {
    id: '2',
    src: 'https://placehold.co/350x450',
    alt: 'Test 2',
    width: 350,
    height: 450,
    hashtags: ['#travel'],
  },
];

function makeImages(count: number): ImageItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `img-${i}`,
    src: `https://placehold.co/400x300?text=${i}`,
    alt: `Image ${i}`,
    width: 400,
    height: 300,
    hashtags: [`#tag${i}`],
  }));
}

function mockMatchMedia(
  matches: boolean,
  listeners?: { change?: (ev: MediaQueryListEvent) => void },
) {
  return vi.fn((_query: string) => ({
    matches,
    addEventListener: vi.fn(
      (_type: string, fn: (ev: MediaQueryListEvent) => void) => {
        if (listeners) listeners.change = fn;
      },
    ),
    removeEventListener: vi.fn(),
  }));
}

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    value: mockMatchMedia(false),
    writable: true,
    configurable: true,
  });
});

afterEach(cleanup);

describe('ImageGrid', () => {
  it('renders image grid with cards', () => {
    render(
      <ImageGrid
        images={mockImages}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
      />,
    );

    expect(
      screen.getByRole('list', { name: /image grid/i }),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Test 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test 2')).toBeInTheDocument();
  });

  it('renders with activeHashtag and passes it to cards', () => {
    render(
      <ImageGrid
        images={mockImages}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag="#nature"
      />,
    );
    expect(
      screen.getByRole('list', { name: /image grid/i }),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Test 1')).toBeInTheDocument();
  });

  it('renders many images so some cards have priority=false (globalIndex >= 12)', () => {
    const manyImages = makeImages(15);
    render(
      <ImageGrid
        images={manyImages}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
      />,
    );
    expect(
      screen.getByRole('list', { name: /image grid/i }),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Image 0')).toBeInTheDocument();
    expect(screen.getByAltText('Image 14')).toBeInTheDocument();
  });

  it('renders cards with motion wrappers for staggered entrance', () => {
    render(
      <ImageGrid
        images={mockImages}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
      />,
    );
    const cards = screen.getAllByTestId('gallery-card');
    expect(cards.length).toBe(mockImages.length);
  });

  it('updates when prefers-reduced-motion preference changes', async () => {
    const listeners: { change?: (ev: MediaQueryListEvent) => void } = {};
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia(false, listeners),
      writable: true,
      configurable: true,
    });
    render(
      <ImageGrid
        images={mockImages}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
      />,
    );
    await act(async () => {
      await new Promise<void>((r) => queueMicrotask(r));
    });
    expect(listeners.change).toBeDefined();
    await act(async () => {
      listeners.change!({ matches: true } as MediaQueryListEvent);
    });
    expect(screen.getAllByTestId('gallery-card')).toHaveLength(2);
  });

  it('renders without stagger when prefers-reduced-motion', async () => {
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia(true),
      writable: true,
      configurable: true,
    });
    render(
      <ImageGrid
        images={mockImages}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
      />,
    );
    await act(async () => {
      await new Promise<void>((r) => queueMicrotask(r));
    });
    expect(screen.getAllByTestId('gallery-card')).toHaveLength(2);
  });

  it('uses col-N key fallback when column has no images', () => {
    vi.mocked(useMasonryColumns).mockReturnValueOnce([[], [...mockImages]]);
    render(
      <ImageGrid
        images={mockImages}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
      />,
    );
    expect(
      screen.getByRole('list', { name: /image grid/i }),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Test 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test 2')).toBeInTheDocument();
  });
});
