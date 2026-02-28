import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    image: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/images', () => {
  it('returns images from database', async () => {
    const { prisma } = await import('@/lib/db');
    const mockImages = [
      {
        id: '1',
        src: 'https://placehold.co/400x300',
        alt: 'Test',
        width: 400,
        height: 300,
        hashtags: [{ name: '#nature' }],
      },
    ];

    vi.mocked(prisma.image.findMany).mockResolvedValue(mockImages as never);

    const { GET } = await import('@/app/api/images/route');
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: '1',
      src: 'https://placehold.co/400x300',
      hashtags: ['#nature'],
    });
  });

  it('returns mock images on database error', async () => {
    const { prisma } = await import('@/lib/db');
    vi.mocked(prisma.image.findMany).mockRejectedValue(new Error('DB error'));

    const { GET } = await import('@/app/api/images/route');
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toMatchObject({
      id: expect.any(String),
      src: expect.any(String),
      alt: expect.any(String),
      width: expect.any(Number),
      height: expect.any(Number),
      hashtags: expect.any(Array),
    });
  });
});
