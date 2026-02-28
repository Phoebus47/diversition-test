import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HashtagFilter } from '@/components/HashtagFilter';

describe('HashtagFilter', () => {
  it('returns null when no active hashtag', () => {
    const { container } = render(
      <HashtagFilter activeHashtag={null} onClear={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows active hashtag and clear button when filtered', () => {
    const onClear = vi.fn();
    render(<HashtagFilter activeHashtag="#nature" onClear={onClear} />);

    expect(screen.getByText('#nature')).toBeInTheDocument();
    expect(screen.getByText('Filtering by')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /clear filter/i });
    expect(clearBtn).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn();
    const { container } = render(
      <HashtagFilter activeHashtag="#nature" onClear={onClear} />,
    );

    const clearBtn = container.querySelector('button');
    if (clearBtn) fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('uses output element for accessibility (filter status)', () => {
    const { container } = render(
      <HashtagFilter activeHashtag="#travel" onClear={() => {}} />,
    );
    const outputEl = container.querySelector('output');
    expect(outputEl).toBeInTheDocument();
  });
});
