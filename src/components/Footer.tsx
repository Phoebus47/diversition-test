import Image from 'next/image';
import { LABELS, LOGO_HEIGHT, LOGO_SRC, LOGO_WIDTH } from '@/lib/constants';

export function Footer() {
  return (
    <footer
      className="border-t border-border-primary bg-surface-primary"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-(--page-max-width) flex-col items-center justify-between gap-4 px-6 py-8 lg:flex-row lg:px-8">
        <Image
          src={LOGO_SRC}
          alt={LABELS.footerBrand}
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          className="h-6 w-auto object-contain opacity-90"
        />
        <span className="text-xs text-text-tertiary">
          {LABELS.footerCopyright}
        </span>
      </div>
    </footer>
  );
}
