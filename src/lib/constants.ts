/** UI copy and configuration constants – no hardcoding in components */

export const LABELS = {
  loadMore: 'Load more',
  noResults: 'No images match this filter',
  galleryTitle: 'Image Gallery',
  clearFilter: 'Clear filter',
  imageUnavailable: 'Image Unavailable',
  footerBrand: 'Image Gallery',
  footerCopyright: '© 2026 Thanakrit Thanyawatsakul. All rights reserved.',
  loadingGallery: 'Loading gallery...',
  tryDifferentHashtag: 'Try selecting a different hashtag',
  reachedEnd: "You've reached the end",
  discoveringBeauty: 'Discovering beauty, one frame at a time.',
  browseFilterHint: 'Browse & filter by hashtags',
  filteringBy: 'Filtering by',
  /* A11y / aria-labels */
  ariaImageGrid: 'Image grid',
  ariaBackToTop: 'Back to top',
  ariaCloseLightbox: 'Close lightbox',
  ariaPreviousImage: 'Previous image',
  ariaNextImage: 'Next image',
  getAriaLightboxDetails: (alt: string) => `${alt} and details`,
  getAriaViewInFullScreen: (alt: string) => `View ${alt} in full screen`,
  ariaThemeToggle: 'Theme (light, dark, or system)',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  /** SEO / metadata (layout) */
  metaDescription:
    'Image gallery with infinite scroll and hashtag filtering. Browse and filter images by keywords.',
} as const;

export const PAGE_SIZE = 12;
export const INITIAL_LOAD_COUNT = 12;

/** Number of skeleton placeholders shown while initial gallery is loading */
export const SKELETON_CARD_COUNT = 12;

/** Px from viewport bottom to trigger loading more (IntersectionObserver rootMargin) */
export const SCROLL_SENTINEL_ROOT_MARGIN = '200px';
/** IntersectionObserver threshold for sentinel (0–1) */
export const SCROLL_SENTINEL_THRESHOLD = 0.1;

/** Scroll Y in px above which BackToTop button is shown */
export const BACK_TO_TOP_VISIBLE_SCROLL_Y = 600;

/** Scroll Y in px below which nav is always visible; above this, nav hides on scroll down */
export const SCROLL_NAV_VISIBLE_THRESHOLD = 80;

/** Logo image (public path) */
export const LOGO_SRC = '/image-gallery-icon.webp';
export const LOGO_WIDTH = 240;
export const LOGO_HEIGHT = 60;
