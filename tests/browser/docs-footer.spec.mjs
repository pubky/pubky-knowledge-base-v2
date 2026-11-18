import { expect, test } from '@playwright/test';
import { pinned_homeserver_release } from '../../src/config/releases.mjs';

test.beforeEach(async ({ context, baseURL }) => {
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(baseURL).origin) return route.continue();
    return route.fulfill({ status: 200, body: '' });
  });
});

for (const width of [320, 390, 1440]) {
  test(`page date and menu SDK version are readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/sdk/', '/developer-guide/']) {
      await page.goto(path);
      const metadata = page.locator('footer [data-docs-metadata]');
      await metadata.scrollIntoViewIfNeeded();
      await expect(metadata).toBeVisible();
      await expect(metadata).toContainText('Last updated:');
      await expect(metadata).not.toContainText('SDK');
      const bounds = await metadata.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      expect(await metadata.evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(bounds.width + 1);

      if (width < 800) await page.getByRole('button', { name: 'Menu', exact: true }).click();
      const sdk = page.locator('#starlight__sidebar [data-sdk-version]');
      await sdk.scrollIntoViewIfNeeded();
      await expect(sdk).toBeVisible();
      await expect(sdk).toHaveText(`Covers Pubky SDK ${pinned_homeserver_release}`);
      const sdkBounds = await sdk.boundingBox();
      expect(sdkBounds.x).toBeGreaterThanOrEqual(0);
      expect(sdkBounds.x + sdkBounds.width).toBeLessThanOrEqual(width);
      expect(await sdk.evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(sdkBounds.width + 1);
      const navigation = page.locator('#starlight__sidebar sl-sidebar-state-persist > ul');
      const navigationBounds = await navigation.boundingBox();
      expect(sdkBounds.y).toBeGreaterThanOrEqual(navigationBounds.y + navigationBounds.height);
      if (width < 800) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    }
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('metadata is available on docs and absent from the landing and error pages', async ({ page }) => {
    await page.goto('/sdk/');
    await expect(page.locator('footer [data-docs-metadata]')).toContainText('Last updated:');
    await expect(page.locator('#starlight__sidebar [data-sdk-version]')).toHaveText(`Covers Pubky SDK ${pinned_homeserver_release}`);
    for (const path of ['/', '/404.html']) {
      await page.goto(path);
      await expect(page.locator('[data-docs-metadata]')).toHaveCount(0);
      await expect(page.locator('[data-sdk-version]')).toHaveCount(0);
    }
  });
});
