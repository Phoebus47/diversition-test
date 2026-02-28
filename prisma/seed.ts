import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
];

function pickDeterministic<T>(arr: T[], index: number, count: number): T[] {
  const start = index % arr.length;
  return Array.from({ length: count }, (_, i) => arr[(start + i) % arr.length]);
}

async function main() {
  const count = await prisma.image.count();
  if (count > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  const POOL_SIZE = 200;

  for (let i = 0; i < POOL_SIZE; i++) {
    const [width, height] = SIZES[i % SIZES.length];
    const hashtagCount = 2 + (i % 4);
    const hashtags = pickDeterministic(HASHTAG_POOL, i, hashtagCount);
    const palette = COLOR_PALETTES[i % COLOR_PALETTES.length];

    const src = `https://placehold.co/${width}x${height}/${palette.bg}/${palette.fg}?text=Image+${i + 1}`;
    const alt = `Gallery image ${i + 1} with tags: ${hashtags.join(', ')}`;

    await prisma.image.create({
      data: {
        src,
        alt,
        width,
        height,
        hashtags: {
          create: hashtags.map((h) => ({ name: `#${h}` })),
        },
      },
    });
  }

  console.log(`Seeded ${POOL_SIZE} images.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
