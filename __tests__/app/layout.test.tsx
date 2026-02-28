import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RootLayout, { metadata } from '@/app/layout';

vi.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-inter',
    className: 'inter-class',
    style: {},
  }),
}));

afterEach(cleanup);

describe('RootLayout', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    // RootLayout renders <html><body>; RTL mounts into a <div>, causing "In HTML, <html> cannot be a child of <div>"
    vi.spyOn(console, 'error').mockImplementation((msg, ...args) => {
      if (
        typeof msg === 'string' &&
        msg.includes('In HTML,') &&
        msg.includes('cannot be a child of')
      ) {
        return;
      }
      originalConsoleError.call(console, msg, ...args);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders html with lang="en" and scroll-smooth', () => {
    render(
      <RootLayout>
        <div data-testid="child">Child</div>
      </RootLayout>,
    );
    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'en');
    expect(html).toHaveClass('scroll-smooth');
  });

  it('renders body with font variable and antialiased', () => {
    render(
      <RootLayout>
        <div data-testid="child">Child</div>
      </RootLayout>,
    );
    const body = document.body;
    expect(body.className).toContain('--font-inter');
    expect(body.className).toContain('antialiased');
  });

  it('renders children inside body', () => {
    render(
      <RootLayout>
        <div data-testid="layout-child">Child content</div>
      </RootLayout>,
    );
    expect(screen.getByTestId('layout-child')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});

describe('layout metadata', () => {
  it('exports metadata with title and description', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Image Gallery | Diversition');
    expect(metadata.description).toContain('Image gallery');
    expect(metadata.description).toContain('infinite scroll');
    expect(metadata.description).toContain('hashtag filtering');
  });
});
