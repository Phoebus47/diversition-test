import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home from '@/app/page';
import { getMockImagePool } from '@/lib/data/mock-images';

const mockUseImagePool = vi.fn();
vi.mock('@/lib/hooks/use-image-pool', () => ({
  useImagePool: () => mockUseImagePool(),
}));

describe('Home', () => {
  it('renders main with GalleryClient', () => {
    mockUseImagePool.mockReturnValue({
      images: getMockImagePool(),
      isLoading: false,
    });
    render(<Home />);
    expect(document.querySelector('main')).toBeInTheDocument();
    expect(screen.getByTestId('image-grid')).toBeInTheDocument();
  });
});
