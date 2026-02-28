/** UI copy and configuration constants – no hardcoding in components */

export const LABELS = {
  loadMore: 'Load more',
  noResults: 'No images match this filter',
  galleryTitle: 'Image Gallery',
  clearFilter: 'Clear filter',
  imageUnavailable: 'Image Unavailable',
  footerBrand: 'Image Gallery',
  footerCopyright: '© 2026. Built with Next.js.',
  loadingGallery: 'Loading gallery...',
  tryDifferentHashtag: 'Try selecting a different hashtag',
  reachedEnd: "You've reached the end",
  discoveringBeauty: 'Discovering beauty, one frame at a time.',
  browseFilterHint: 'Browse & filter by hashtags',
  filteringBy: 'Filtering by',
  /* A11y / aria-labels */
  ariaBackToTop: 'Back to top',
  ariaCloseLightbox: 'Close lightbox',
  ariaPreviousImage: 'Previous image',
  ariaNextImage: 'Next image',
  getAriaLightboxDetails: (alt: string) => `${alt} and details`,
  getAriaViewInFullScreen: (alt: string) => `View ${alt} in full screen`,
  /** SEO / metadata (layout) */
  metaDescription:
    'Image gallery with infinite scroll and hashtag filtering. Browse and filter images by keywords.',
} as const;

export const PAGE_SIZE = 12;
export const INITIAL_LOAD_COUNT = 12;

/** Px from viewport bottom to trigger loading more (IntersectionObserver rootMargin) */
export const SCROLL_SENTINEL_ROOT_MARGIN = '200px';
/** IntersectionObserver threshold for sentinel (0–1) */
export const SCROLL_SENTINEL_THRESHOLD = 0.1;

/** Scroll Y in px above which BackToTop button is shown */
export const BACK_TO_TOP_VISIBLE_SCROLL_Y = 600;

/** Logo image (public path) */
export const LOGO_SRC = '/image-gallery-icon.png';
export const LOGO_WIDTH = 240;
export const LOGO_HEIGHT = 60;
