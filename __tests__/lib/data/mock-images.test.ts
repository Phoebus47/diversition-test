import { describe, expect, it } from 'vitest';
import { getMockImages, getMockImagePool } from '@/lib/data/mock-images';

describe('mock-images', () => {
  describe('getMockImages', () => {
    it('returns requested count of images', () => {
      const images = getMockImages(5);
      expect(images).toHaveLength(5);
    });

    it('returns images with required fields', () => {
      const images = getMockImages(1);
      const img = images[0];
      expect(img).toMatchObject({
        id: expect.any(String),
        src: expect.any(String),
        alt: expect.any(String),
        width: expect.any(Number),
        height: expect.any(Number),
        hashtags: expect.any(Array),
      });
      expect(img.id).toMatch(/^img-\d+$/);
      expect(img.src).toContain('placehold.co');
      expect(img.hashtags.every((t) => t.startsWith('#'))).toBe(true);
    });

    it('generates deterministic results', () => {
      const a = getMockImages(3);
      const b = getMockImages(3);
      expect(a[0].id).toBe(b[0].id);
      expect(a[0].src).toBe(b[0].src);
    });

    it('each image has 2–5 hashtags', () => {
      const images = getMockImages(20);
      images.forEach((img) => {
        expect(img.hashtags.length).toBeGreaterThanOrEqual(2);
        expect(img.hashtags.length).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('getMockImagePool', () => {
    it('returns 200 images', () => {
      const pool = getMockImagePool();
      expect(pool).toHaveLength(200);
    });

    it('all images have unique ids', () => {
      const pool = getMockImagePool();
      const ids = pool.map((i) => i.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(200);
    });
  });
});
