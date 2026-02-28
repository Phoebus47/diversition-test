import {
  fireEvent,
  render,
  screen,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { Lightbox } from '@/components/Lightbox';
import type { ImageItem } from '@/lib/data/mock-images';

const mockImages: ImageItem[] = [
  {
    id: '1',
    src: 'https://placehold.co/400x300',
    alt: 'Image 1',
    width: 400,
    height: 300,
    hashtags: ['#nature'],
  },
  {
    id: '2',
    src: 'https://placehold.co/350x450',
    alt: 'Image 2',
    width: 350,
    height: 450,
    hashtags: ['#travel'],
  },
];

describe('Lightbox Final Coverage Fix', () => {
  const showModalMock = vi.fn();
  const closeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    if (typeof HTMLDialogElement !== 'undefined') {
      HTMLDialogElement.prototype.showModal = showModalMock;
      HTMLDialogElement.prototype.close = closeMock;
    }
  });

  afterEach(() => {
    cleanup();
  });

  it('returns null when currentIndex is null or image missing', () => {
    const { container, rerender } = render(
      <Lightbox
        images={mockImages}
        currentIndex={null}
        onClose={() => {}}
        onNavigate={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();

    rerender(
      <Lightbox
        images={mockImages}
        currentIndex={99}
        onClose={() => {}}
        onNavigate={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('handles all interactive branches (buttons, keyboard, backdrop)', async () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    const { container } = render(
      <Lightbox
        images={mockImages}
        currentIndex={0}
        onClose={onClose}
        onNavigate={onNavigate}
      />,
    );

    await waitFor(() => {
      expect(container.querySelector('dialog')).toBeInTheDocument();
    });
    expect(showModalMock).toHaveBeenCalled();
    const dialog = container.querySelector('dialog') as HTMLElement;
    expect(dialog).toBeInTheDocument();

    // 1. Navigation buttons (hidden: true for jsdom where dialog content may be off a11y tree)
    fireEvent.click(
      screen.getByRole('button', { name: /next image/i, hidden: true }),
    );
    expect(onNavigate).toHaveBeenCalledWith(1);

    fireEvent.click(
      screen.getByRole('button', { name: /previous image/i, hidden: true }),
    );
    expect(onNavigate).toHaveBeenCalledWith(1);

    // 2. Keyboard (fire on BOTH window and document to ensure event catch in JSDOM)
    fireEvent.keyDown(window, { key: 'ArrowRight', code: 'ArrowRight' });
    fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });
    await waitFor(() => {
      expect(onNavigate).toHaveBeenCalledWith(1);
    });

    fireEvent.keyDown(window, { key: 'ArrowLeft', code: 'ArrowLeft' });
    fireEvent.keyDown(document, { key: 'ArrowLeft', code: 'ArrowLeft' });
    await waitFor(() => {
      expect(onNavigate).toHaveBeenCalledWith(1);
    });

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });

    // 3. StopPropagation check (click and keyDown on content wrapper — covers line 173–174)
    onClose.mockClear();
    const contentArea = screen.getByTestId('lightbox-content');
    fireEvent.click(contentArea);
    fireEvent.keyDown(contentArea, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();

    // 4. Close via X button
    fireEvent.click(screen.getByTestId('lightbox-close-btn'));
    expect(onClose).toHaveBeenCalled();

    // 5. Close via backdrop click
    onClose.mockClear();
    fireEvent.click(screen.getByTestId('lightbox-backdrop'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop receives Enter or Space (backdrop keyDown)', () => {
    const onClose = vi.fn();
    render(
      <Lightbox
        images={mockImages}
        currentIndex={0}
        onClose={onClose}
        onNavigate={() => {}}
      />,
    );
    const backdrop = screen.getByTestId('lightbox-backdrop');
    fireEvent.keyDown(backdrop, { key: 'Enter' });
    expect(onClose).toHaveBeenCalled();
    onClose.mockClear();
    fireEvent.keyDown(backdrop, { key: ' ' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders info overlay with current index and total', () => {
    const { container } = render(
      <Lightbox
        images={mockImages}
        currentIndex={1}
        onClose={() => {}}
        onNavigate={() => {}}
      />,
    );
    expect(container.querySelector('dialog')).toBeInTheDocument();
    expect(screen.getByText(/2 \/ 2/)).toBeInTheDocument();
  });

  it('calls dialog.close when currentIndex becomes null', async () => {
    const { container, rerender } = render(
      <Lightbox
        images={mockImages}
        currentIndex={0}
        onClose={() => {}}
        onNavigate={() => {}}
      />,
    );
    await waitFor(() => {
      expect(container.querySelector('dialog')).toBeInTheDocument();
    });
    expect(showModalMock).toHaveBeenCalled();
    rerender(
      <Lightbox
        images={mockImages}
        currentIndex={null}
        onClose={() => {}}
        onNavigate={() => {}}
      />,
    );
    expect(closeMock).toHaveBeenCalled();
    expect(container.firstChild).toBeNull();
  });

  it('handleBackdropKeyDown calls onClose when backdrop key is Enter or Space', () => {
    const onClose = vi.fn();
    render(
      <Lightbox
        images={mockImages}
        currentIndex={0}
        onClose={onClose}
        onNavigate={() => {}}
      />,
    );
    const backdrop = screen.getByTestId('lightbox-backdrop');
    fireEvent.keyDown(backdrop, { key: 'Enter', bubbles: true });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(backdrop, { key: ' ', bubbles: true });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('handleBackdropKeyDown does not call onClose when key is not Enter or Space', () => {
    const onClose = vi.fn();
    render(
      <Lightbox
        images={mockImages}
        currentIndex={0}
        onClose={onClose}
        onNavigate={() => {}}
      />,
    );
    const backdrop = screen.getByTestId('lightbox-backdrop');
    fireEvent.keyDown(backdrop, { key: 'a', bubbles: true });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('content area keyDown does not call onClose (stopPropagation)', () => {
    const onClose = vi.fn();
    render(
      <Lightbox
        images={mockImages}
        currentIndex={0}
        onClose={onClose}
        onNavigate={() => {}}
      />,
    );
    const contentButton = screen.getByTestId('lightbox-content');
    fireEvent.keyDown(contentButton, { key: 'Enter', bubbles: true });
    expect(onClose).not.toHaveBeenCalled();
  });
});
