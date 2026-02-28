import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('renders brand and copyright', () => {
    render(<Footer />);
    expect(
      screen.getByRole('img', { name: /image gallery/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/© 2026/i)).toBeInTheDocument();
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
