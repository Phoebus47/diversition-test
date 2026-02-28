import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { ImageItem } from '@/lib/data/mock-images';

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      include: { hashtags: true },
      orderBy: { createdAt: 'asc' },
    });

    const items: ImageItem[] = images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height,
      hashtags: img.hashtags.map((h) => h.name),
    }));

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 },
    );
  }
}
