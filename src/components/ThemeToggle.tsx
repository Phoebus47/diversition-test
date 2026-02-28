'use client';

import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@/lib/hooks/use-theme';
import type { EffectiveTheme, Theme } from '@/lib/hooks/use-theme';
import { LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: LABELS.themeLight },
  { value: 'dark', label: LABELS.themeDark },
  { value: 'system', label: LABELS.themeSystem },
];

function getThemeLabel(theme: Theme): string {
  return THEMES.find((t) => t.value === theme)!.label;
}

export function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
      if (e instanceof MouseEvent && ref.current?.contains(e.target as Node))
        return;
      setOpen(false);
    };
    document.addEventListener('click', handle, true);
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('click', handle, true);
      document.removeEventListener('keydown', handle);
    };
  }, [open]);

  return (
    <div className="relative flex items-center gap-2">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-primary bg-surface-primary text-text-secondary"
        aria-hidden
      >
        <ThemeIcon effectiveTheme={effectiveTheme} />
      </span>
      <div className="relative flex min-w-32" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={LABELS.ariaThemeToggle}
          className={cn(
            'flex h-9 w-full min-w-0 cursor-pointer items-center justify-between rounded-full border border-border-primary bg-surface-primary pl-3 pr-10 py-1.5 text-sm text-text-primary',
            'hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          )}
        >
          <span>{getThemeLabel(theme)}</span>
          <span
            className="pointer-events-none absolute right-3 flex items-center text-text-secondary"
            aria-hidden
          >
            <ChevronDown className="size-4" />
          </span>
        </button>
        {open && (
          <fieldset
            aria-label={LABELS.ariaThemeToggle}
            className={cn(
              'absolute top-9.5 z-50 mt-2 min-w-44 rounded-xl border border-border-primary bg-surface-primary py-2 shadow-(--shadow-lg)',
              'border-solid px-0 m-0 min-w-32',
            )}
          >
            <ul className="list-none space-y-0.5 p-0 m-0">
              {THEMES.map(({ value, label }) => (
                <li key={value}>
                  <button
                    type="button"
                    role="menuitem"
                    aria-current={theme === value ? 'true' : undefined}
                    onClick={() => {
                      setTheme(value);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full cursor-pointer px-5 py-3 text-left text-sm text-text-primary',
                      theme === value
                        ? 'bg-accent-subtle font-medium text-accent'
                        : 'hover:bg-surface-secondary',
                      'focus-visible:outline-none focus-visible:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
                    )}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>
        )}
      </div>
    </div>
  );
}

function ChevronDown({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ThemeIcon({
  effectiveTheme,
}: Readonly<{ effectiveTheme: EffectiveTheme }>) {
  if (effectiveTheme === 'dark') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
