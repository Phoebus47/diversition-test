import { afterEach, describe, expect, it, vi } from 'vitest';

const mockPrismaInstance = {};
function MockPrismaClient() {
  return mockPrismaInstance;
}
const PrismaClientMock = vi.fn(MockPrismaClient);

vi.mock('@prisma/client', () => ({
  PrismaClient: PrismaClientMock,
}));
describe('db', () => {
  const globalPrismaKey = 'prisma';

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (globalThis as unknown as Record<string, unknown>)[globalPrismaKey];
    vi.resetModules();
  });

  it('exports prisma singleton', async () => {
    delete (globalThis as unknown as Record<string, unknown>)[globalPrismaKey];
    const { prisma } = await import('@/lib/db');
    expect(prisma).toBeDefined();
    expect(prisma).toBe(mockPrismaInstance);
  });

  it('uses development log when NODE_ENV is development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    delete (globalThis as unknown as Record<string, unknown>)[globalPrismaKey];
    vi.resetModules();
    PrismaClientMock.mockClear();
    const { prisma } = await import('@/lib/db');
    expect(prisma).toBeDefined();
    expect(PrismaClientMock).toHaveBeenCalledWith({
      log: ['error', 'warn'],
    });
  });

  it('uses error-only log when NODE_ENV is not development', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    delete (globalThis as unknown as Record<string, unknown>)[globalPrismaKey];
    vi.resetModules();
    PrismaClientMock.mockClear();
    const { prisma } = await import('@/lib/db');
    expect(prisma).toBeDefined();
    expect(PrismaClientMock).toHaveBeenCalledWith({ log: ['error'] });
  });

  it('reuses global prisma when already set', async () => {
    const existingPrisma = {};
    (globalThis as unknown as Record<string, unknown>)[globalPrismaKey] =
      existingPrisma;
    vi.resetModules();
    PrismaClientMock.mockClear();
    const { prisma } = await import('@/lib/db');
    expect(prisma).toBe(existingPrisma);
    expect(PrismaClientMock).not.toHaveBeenCalled();
  });
});
