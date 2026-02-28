/** Mock image data using placehold.co with hashtags for gallery testing */

export interface ImageItem {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  hashtags: string[];
}

const SIZES = [
  [400, 300],
  [350, 500],
  [380, 280],
  [320, 460],
  [360, 360],
  [420, 320],
  [300, 440],
  [450, 350],
  [340, 520],
  [400, 400],
] as const;

const HASHTAG_POOL = [
  'nature',
  'travel',
  'architecture',
  'urban',
  'minimal',
  'abstract',
  'portrait',
  'landscape',
  'vintage',
  'modern',
  'cozy',
  'bright',
  'dark',
  'colorful',
  'monochrome',
];

const COLOR_PALETTES = [
  { bg: '7c3aed', fg: 'ffffff' },
  { bg: '3b82f6', fg: 'ffffff' },
  { bg: '06b6d4', fg: 'ffffff' },
  { bg: 'f43f5e', fg: 'ffffff' },
  { bg: 'f59e0b', fg: '1a1a2e' },
  { bg: '10b981', fg: 'ffffff' },
  { bg: '8b5cf6', fg: 'ffffff' },
  { bg: 'ec4899', fg: 'ffffff' },
  { bg: '0ea5e9', fg: 'ffffff' },
  { bg: '14b8a6', fg: 'ffffff' },
  { bg: 'e11d48', fg: 'ffffff' },
  { bg: '6366f1', fg: 'ffffff' },
] as const;

function pickDeterministic<T>(arr: T[], index: number, count: number): T[] {
  const start = index % arr.length;
  return Array.from({ length: count }, (_, i) => arr[(start + i) % arr.length]);
}

function generateImage(index: number): ImageItem {
  const [width, height] = SIZES[index % SIZES.length];
  const hashtagCount = 2 + (index % 4);
  const hashtags = pickDeterministic(HASHTAG_POOL, index, hashtagCount);
  const palette = COLOR_PALETTES[index % COLOR_PALETTES.length];

  return {
    id: `img-${index + 1}`,
    src: `https://placehold.co/${width}x${height}/${palette.bg}/${palette.fg}?text=Image+${index + 1}`,
    alt: `Gallery image ${index + 1} with tags: ${hashtags.join(', ')}`,
    width,
    height,
    hashtags: hashtags.map((h) => `#${h}`),
  };
}

/** Generates a deterministic mock dataset of images with placehold.co URLs */
export function getMockImages(count: number): ImageItem[] {
  return Array.from({ length: count }, (_, i) => generateImage(i));
}

/** Fixed pool of mock images for gallery (filtering + infinite scroll) */
const MOCK_POOL_SIZE = 200;
const mockImagePool = getMockImages(MOCK_POOL_SIZE);

/** Returns the full mock image pool for filtering and pagination */
export function getMockImagePool(): ImageItem[] {
  return mockImagePool;
}
