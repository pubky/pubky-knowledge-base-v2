import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context, baseURL }) => {
  await context.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseURL).origin
    ? route.continue() : route.fulfill({ status: 200, body: '' }));
});

test('old documentation links retain query strings and section links', async ({ page, request }) => {
  await page.goto('/explore/pubky-protocol/sdk/?source=bookmark#how-it-works');
  await expect(page).toHaveURL('/build/sdk/?source=bookmark#how-it-works');
  await expect(page.locator('#how-it-works')).toBeVisible();

  await page.goto('/the-vision-of-pubky/?source=bookmark#obsolete-section');
  await expect(page).toHaveURL('/overview/?source=bookmark#the-broader-vision');

  const legacy = await request.get('/explore/pubky-protocol/sdk.md');
  const canonical = await request.get('/build/sdk.md');
  expect(legacy.ok()).toBeTruthy();
  expect(canonical.ok()).toBeTruthy();
  expect(await legacy.text()).toEqual(await canonical.text());
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('old URLs still reach their canonical page', async ({ page }) => {
    await page.goto('/explore/pubky-protocol/sdk/');
    await expect(page).toHaveURL('/build/sdk/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pubky SDK');
  });
});
