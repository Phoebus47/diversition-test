import { LABELS } from '@/lib/constants';

export function Footer() {
  return (
    <footer
      className="border-t border-border-primary bg-surface-primary"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-(--page-max-width) flex-col items-center justify-between gap-4 px-6 py-8 lg:flex-row lg:px-8">
        <span className="text-sm font-medium text-text-secondary">
          {LABELS.footerBrand}
        </span>
        <span className="text-xs text-text-tertiary">
          {LABELS.footerCopyright}
        </span>
      </div>
    </footer>
  );
}
