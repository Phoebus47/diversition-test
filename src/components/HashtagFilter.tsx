import { LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface HashtagFilterProps {
  activeHashtag: string | null;
  onClear: () => void;
}

export function HashtagFilter({
  activeHashtag,
  onClear,
}: Readonly<HashtagFilterProps>) {
  if (!activeHashtag) return null;

  return (
    <output
      className={cn(
        'inline-flex items-center gap-3',
        'rounded-full border border-filter-border bg-filter-bg px-4 py-2',
        'shadow-(--shadow-sm)',
      )}
      aria-live="polite"
    >
      <span className="text-sm text-text-secondary">{LABELS.filteringBy}</span>
      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
        {activeHashtag}
      </span>
      <button
        type="button"
        onClick={onClear}
        className={cn(
          'ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full cursor-pointer',
          'text-text-tertiary',
          'transition-colors duration-150',
          'hover:bg-accent-subtle hover:text-accent',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        )}
        aria-label={LABELS.clearFilter}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 4l6 6M10 4l-6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </output>
  );
}
