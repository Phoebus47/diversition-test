import { expect, test } from '@playwright/test';

// To see the browser state: run `npm run test:e2e` then `npm run test:e2e:report`,
// or in UI mode expand a test and click a step after "Navigate" in the trace.

test.describe('Image Gallery', () => {
  test('displays gallery title and images', async ({ page }, testInfo) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /image gallery/i }),
    ).toBeVisible();
    await expect(page.getByRole('list', { name: /image grid/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /view.*full screen/i }).first(),
    ).toBeVisible();

    await testInfo.attach('gallery-page', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('filters images when clicking hashtag', async ({ page }) => {
    await page.goto('/');

    const firstHashtag = page.getByRole('button', { name: /^#/ }).first();
    await firstHashtag.click();

    await expect(page.getByRole('status')).toContainText('Filtering by');
  });

  test('clears filter when clicking clear button', async ({ page }) => {
    await page.goto('/');

    const firstHashtag = page.getByRole('button', { name: /^#/ }).first();
    await firstHashtag.click();

    await expect(page.getByRole('status')).toBeVisible();

    await page.getByRole('button', { name: /clear filter/i }).click();

    await expect(page.getByRole('status')).not.toBeVisible();
  });

  test('opens lightbox when clicking image', async ({ page }) => {
    await page.goto('/');

    const firstImage = page
      .getByRole('button', { name: /view.*full screen/i })
      .first();
    await firstImage.click();

    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
