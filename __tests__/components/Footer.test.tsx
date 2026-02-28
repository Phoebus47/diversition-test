import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('renders brand and copyright', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Image Gallery · Thanakrit Thanyawatsakul/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/© 2026 Thanakrit Thanyawatsakul/i),
    ).toBeInTheDocument();
  });

  it('has contentinfo role', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveAttribute('role', 'contentinfo');
  });

  it('renders as footer element', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });
});
