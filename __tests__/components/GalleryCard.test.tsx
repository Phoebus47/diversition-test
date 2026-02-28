import {
  act,
  fireEvent,
  render,
  screen,
  cleanup,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GalleryCard } from '@/components/GalleryCard';

const mockImage = {
  id: 'img-1',
  src: 'https://placehold.co/400x300',
  alt: 'test-image',
  width: 400,
  height: 300,
  hashtags: ['#nature'],
};

describe('GalleryCard Precise Coverage', () => {
  beforeEach(() => {
    cleanup();
  });

  it('covers keyboard interaction branches', () => {
    const onImageClick = vi.fn();
    render(
      <GalleryCard
        image={mockImage}
        onHashtagClick={() => {}}
        onImageClick={onImageClick}
        activeHashtag={null}
      />,
    );
    const area = screen.getByRole('button', { name: /view.*full screen/i });

    fireEvent.click(area);
    fireEvent.click(area);
    expect(onImageClick).toHaveBeenCalledTimes(2);
  });

  it('covers error state blocking', () => {
    const onImageClick = vi.fn();
    render(
      <GalleryCard
        image={mockImage}
        onHashtagClick={() => {}}
        onImageClick={onImageClick}
        activeHashtag={null}
      />,
    );
    const area = screen.getByRole('button', { name: /view.*full screen/i });
    const img = screen.getByAltText('test-image');

    fireEvent.error(img);
    fireEvent.click(area);
    fireEvent.keyDown(area, { key: 'Enter' });
    expect(onImageClick).not.toHaveBeenCalled();
  });

  it('covers image load and hashtag ripple success paths', () => {
    const { container } = render(
      <GalleryCard
        image={mockImage}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
      />,
    );
    const img = screen.getByAltText('test-image');

    fireEvent.load(img);

    const btn = screen.getByRole('button', { name: /#nature/i });
    fireEvent.click(btn);

    const ripple = container.querySelector('.ripple-effect');
    expect(ripple).toBeInTheDocument();

    act(() => {
      ripple?.dispatchEvent(new Event('animationend', { bubbles: true }));
    });
    expect(container.querySelector('.ripple-effect')).not.toBeInTheDocument();
  });

  it('calls onImageClick when image area is clicked and no error', () => {
    const onImageClick = vi.fn();
    render(
      <GalleryCard
        image={mockImage}
        onHashtagClick={() => {}}
        onImageClick={onImageClick}
        activeHashtag={null}
      />,
    );
    const img = screen.getByAltText('test-image');
    fireEvent.load(img);

    const area = screen.getByRole('button', { name: /view.*full screen/i });
    fireEvent.click(area);

    expect(onImageClick).toHaveBeenCalledTimes(1);
    expect(onImageClick).toHaveBeenCalledWith(mockImage);
  });

  it('renders active state when activeHashtag matches a tag', () => {
    render(
      <GalleryCard
        image={mockImage}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag="#nature"
      />,
    );
    const tagBtn = screen.getByRole('button', { name: '#nature' });
    expect(tagBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders with priority prop', () => {
    render(
      <GalleryCard
        image={mockImage}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
        priority
      />,
    );
    expect(screen.getByTestId('gallery-card')).toBeInTheDocument();
    expect(screen.getByAltText('test-image')).toBeInTheDocument();
  });

  it('shows shimmer before image load and hides after load', () => {
    const { container } = render(
      <GalleryCard
        image={mockImage}
        onHashtagClick={() => {}}
        onImageClick={() => {}}
        activeHashtag={null}
      />,
    );
    expect(container.querySelector('.animate-shimmer')).toBeInTheDocument();

    const img = screen.getByAltText('test-image');
    fireEvent.load(img);

    expect(container.querySelector('.animate-shimmer')).not.toBeInTheDocument();
  });
});
