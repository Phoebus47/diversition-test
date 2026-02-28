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

  test('back-to-top button appears on scroll and scrolls to top when clicked', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('list', { name: /image grid/i })).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 800));
    await expect(
      page.getByRole('button', { name: /back to top/i }),
    ).toBeVisible();

    await page
      .getByRole('button', { name: /back to top/i })
      .click({ force: true });
    await page.waitForFunction(() => window.scrollY < 100, { timeout: 5000 });
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('infinite scroll loads more images when scrolling to bottom', async ({
    page,
  }) => {
    await page.goto('/');
    const list = page.getByRole('list', { name: /image grid/i });
    await expect(list).toBeVisible();

    const initialCards = await page.getByTestId('gallery-card').count();

    await page.getByTestId('scroll-sentinel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const afterScrollCards = await page.getByTestId('gallery-card').count();
    const reachedEnd = page.getByText(/you've reached the end/i);
    expect(
      afterScrollCards > initialCards || (await reachedEnd.isVisible()),
    ).toBeTruthy();
  });
});
