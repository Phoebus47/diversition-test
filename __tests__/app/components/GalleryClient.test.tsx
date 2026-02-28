import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { GalleryClient } from '@/app/components/GalleryClient';

const mockUseImagePool = vi.fn();
const mockUseInfiniteScroll = vi.fn();

vi.mock('@/lib/hooks/use-image-pool', () => ({
  useImagePool: () => mockUseImagePool(),
}));
vi.mock('@/lib/hooks/use-infinite-scroll', () => ({
  useInfiniteScroll: (args: any) => mockUseInfiniteScroll(args),
}));
vi.mock('@/lib/hooks/use-responsive-columns', () => ({
  useResponsiveColumns: () => 4,
}));

// Mock components to isolate GalleryClient orchestration logic
vi.mock('@/components/ImageGrid', () => ({
  ImageGrid: ({ images, onImageClick }: any) => (
    <div data-testid="mock-grid">
      {images.map((img: any) => (
        <button
          key={img.id}
          data-testid={`card-${img.id}`}
          onClick={() => onImageClick(img)}
        >
          {img.id}
        </button>
      ))}
      <button
        data-testid="card-rogue"
        onClick={() => onImageClick({ id: 'rogue' })}
      >
        rogue
      </button>
    </div>
  ),
}));

vi.mock('@/components/Lightbox', () => ({
  Lightbox: ({ currentIndex, onClose, onNavigate }: any) =>
    currentIndex !== null ? (
      <div data-testid="mock-lightbox" role="dialog">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onNavigate(1)}>Next</button>
      </div>
    ) : null,
}));

describe('GalleryClient Logic Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('exercises all logic paths including empty and rogue clicks', async () => {
    const pooled = { id: 'p1' };

    // 1. Loading
    mockUseImagePool.mockReturnValue({ images: [], isLoading: true });
    mockUseInfiniteScroll.mockReturnValue({
      images: [],
      hasMore: false,
      sentinelRef: { current: null },
    });
    const { rerender } = render(<GalleryClient />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // 2. Success & Interactions
    mockUseImagePool.mockReturnValue({ images: [pooled], isLoading: false });
    mockUseInfiniteScroll.mockReturnValue({
      images: [pooled],
      hasMore: false,
      sentinelRef: { current: null },
    });
    rerender(<GalleryClient />);

    // Click pooled image (id: p1)
    fireEvent.click(screen.getByTestId('card-p1'));
    expect(screen.getByTestId('mock-lightbox')).toBeInTheDocument();

    // Click rogue (index -1 -> null)
    fireEvent.click(screen.getByTestId('card-rogue'));
    expect(screen.queryByTestId('mock-lightbox')).toBeNull();

    // Open again and test callbacks
    fireEvent.click(screen.getByTestId('card-p1'));
    fireEvent.click(screen.getByText('Next')); // onNavigate
    fireEvent.click(screen.getByText('Close')); // onClose
    expect(screen.queryByTestId('mock-lightbox')).toBeNull();

    // 3. Empty State
    mockUseImagePool.mockReturnValue({ images: [], isLoading: false });
    mockUseInfiniteScroll.mockReturnValue({
      images: [],
      hasMore: false,
      sentinelRef: { current: null },
    });
    rerender(<GalleryClient />);
    expect(screen.getByText(/Try selecting/i)).toBeInTheDocument();
  });
});
