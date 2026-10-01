import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context, baseURL }) => {
  await context.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseURL).origin
    ? route.continue() : route.fulfill({ status: 200, body: '' }));
});

const legacySdkPaths = ['/explore/pubky-protocol/sdk', '/build/sdk'];

for (const path of legacySdkPaths) {
  test(`${path} retains query strings, section links, and Markdown content`, async ({ page, request }) => {
    await page.goto(`${path}/?source=bookmark#how-it-works`);
    await expect(page).toHaveURL('/sdk/?source=bookmark#how-it-works');
    await expect(page.locator('#how-it-works')).toBeVisible();

    const legacy = await request.get(`${path}.md`);
    const canonical = await request.get('/sdk.md');
    expect(legacy.ok()).toBeTruthy();
    expect(canonical.ok()).toBeTruthy();
    expect(await legacy.text()).toEqual(await canonical.text());
  });
}

test('old documentation links retain their replacement section', async ({ page }) => {
  await page.goto('/the-vision-of-pubky/?source=bookmark#obsolete-section');
  await expect(page).toHaveURL('/overview/?source=bookmark#the-broader-vision');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  for (const path of legacySdkPaths) {
    test(`${path} still reaches its canonical page`, async ({ page }) => {
      await page.goto(`${path}/`);
      await expect(page).toHaveURL('/sdk/');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pubky SDK');
    });
  }
});
