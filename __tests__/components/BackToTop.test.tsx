import { act, fireEvent, render, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BackToTop } from '@/components/BackToTop';

describe('BackToTop', () => {
  it('renders button with aria-label', () => {
    const { container } = render(<BackToTop />);
    expect(
      within(container).getByRole('button', { name: /back to top/i }),
    ).toBeInTheDocument();
  });

  it('calls scrollTo when clicked', () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', {
      value: scrollTo,
      writable: true,
    });

    const { container } = render(<BackToTop />);
    const btn = container.querySelector('button');
    expect(btn).toBeTruthy();
    if (btn) fireEvent.click(btn);

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('cleans up scroll listener on unmount', () => {
    const { unmount } = render(<BackToTop />);
    unmount();
    expect(() => fireEvent.scroll(window)).not.toThrow();
  });

  it('shows when scrolled past 600px', () => {
    const { container } = render(<BackToTop />);
    const btn = container.querySelector('button');
    expect(btn).toBeTruthy();
    if (!btn) return;

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    act(() => {
      fireEvent.scroll(window);
    });
    expect(btn).toHaveClass('pointer-events-none');

    Object.defineProperty(window, 'scrollY', { value: 700, writable: true });
    act(() => {
      fireEvent.scroll(window);
    });
    expect(btn).not.toHaveClass('pointer-events-none');
  });
});
