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

  it('returns 500 on database error', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { prisma } = await import('@/lib/db');
    vi.mocked(prisma.image.findMany).mockRejectedValue(new Error('DB error'));

    const { GET } = await import('@/app/api/images/route');
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Failed to fetch images');

    consoleErrorSpy.mockRestore();
  });
});
