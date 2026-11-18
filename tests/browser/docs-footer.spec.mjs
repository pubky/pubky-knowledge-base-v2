import { expect, test } from '@playwright/test';
import { pinned_homeserver_release } from '../../src/config/releases.mjs';

test.beforeEach(async ({ context, baseURL }) => {
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(baseURL).origin) return route.continue();
    return route.fulfill({ status: 200, body: '' });
  });
});

for (const width of [320, 390, 1440]) {
  test(`docs footer is readable and fits a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/sdk/', '/developer-guide/']) {
      await page.goto(path);
      const metadata = page.locator('footer [data-docs-metadata]');
      await metadata.scrollIntoViewIfNeeded();
      await expect(metadata).toBeVisible();
      await expect(metadata).toContainText('Last updated:');
      await expect(metadata).toContainText(`Updated for Pubky SDK ${pinned_homeserver_release}`);
      const bounds = await metadata.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      expect(await metadata.evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(bounds.width + 1);
    }
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('metadata is available on docs and absent from the landing and error pages', async ({ page }) => {
    await page.goto('/sdk/');
    await expect(page.locator('footer [data-docs-metadata]')).toContainText(`Updated for Pubky SDK ${pinned_homeserver_release}`);
    for (const path of ['/', '/404.html']) {
      await page.goto(path);
      await expect(page.locator('[data-docs-metadata]')).toHaveCount(0);
    }
  });
});
