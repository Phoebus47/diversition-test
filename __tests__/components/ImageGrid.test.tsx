import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImageGrid, getStaggerClass } from '@/components/ImageGrid';
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

  it('applies stagger and animate-card-in classes to card wrappers', () => {
    render(
      <ImageGrid
        images={mockImages}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
      />,
    );
    const grid = screen.getByRole('list', { name: /image grid/i });
    const wrappers = grid.querySelectorAll('.animate-card-in');
    expect(wrappers.length).toBeGreaterThanOrEqual(1);
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

describe('getStaggerClass', () => {
  it('returns stagger-0 for index 0', () => {
    expect(getStaggerClass(0)).toBe('stagger-0');
  });

  it('returns stagger-150 for index 5', () => {
    expect(getStaggerClass(5)).toBe('stagger-150');
  });

  it('returns stagger-300 for index 10', () => {
    expect(getStaggerClass(10)).toBe('stagger-300');
  });

  it('returns stagger-300 for index >= 11 (capped)', () => {
    expect(getStaggerClass(11)).toBe('stagger-300');
    expect(getStaggerClass(100)).toBe('stagger-300');
  });

  it('returns stagger-300 fallback for negative index (?? branch)', () => {
    expect(getStaggerClass(-1)).toBe('stagger-300');
  });
});
