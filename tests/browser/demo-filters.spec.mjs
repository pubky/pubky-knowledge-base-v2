import { expect, test as base } from '@playwright/test';

const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await use(page);
    expect(errors, 'Uncaught browser errors').toEqual([]);
  },
});

test.beforeEach(async ({ context, baseURL }) => {
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(baseURL).origin) {
      return route.continue();
    }
    return route.fulfill({ status: 200, body: '' });
  });
});

const categories = {
  Apps: ['Loopky', 'mypubky', 'Payky', 'Mapky', 'Eventky', 'Pubky Notes', 'Uploadky', 'TC Wiki', 'Ghostly'],
  Mobile: ['Loopky'],
  Social: ['mypubky', 'ABC', 'Ghostly'],
  Productivity: ['Pubky Notes', 'Eventky'],
  Learning: ['Loopky', 'TC Wiki'],
  Payments: ['Payky', 'mypubky'],
  Utilities: ['Mapky', 'Explorer', 'Uploadky', 'PKDNS', 'No Registry'],
  Development: ['App Template', 'PubkyLab', 'Pastalabs'],
  Community: ['Loopky', 'mypubky', 'Payky', 'ABC', 'Mapky', 'Eventky', 'Pubky Notes', 'Uploadky', 'TC Wiki', 'PubkyLab', 'Ghostly', 'Pastalabs'],
};

async function expectVisibleProjects(page, titles) {
  await expect.poll(async () => (
    await page.locator('#demos .demo-card:visible .demo-card-title').allTextContents()
  ).map((title) => title.trim()).sort()).toEqual([...titles].sort());
}

test('demo filters start clear, switch exclusively, and toggle back to all projects', async ({ page }) => {
  await page.goto('/');
  const filters = page.getByRole('group', { name: 'Filter demos', exact: true });
  await expect(filters).toBeVisible();
  await expect(filters.getByRole('button')).toHaveText(Object.keys(categories));
  await expect(filters.getByRole('button', { pressed: true })).toHaveCount(0);
  await expect(page.locator('#demos .demo-card:visible')).toHaveCount(16);

  await filters.getByRole('button', { name: 'Apps', exact: true }).click();
  await expectVisibleProjects(page, categories.Apps);
  await expect(filters.getByRole('button', { pressed: true })).toHaveText('Apps');

  const utilities = filters.getByRole('button', { name: 'Utilities', exact: true });
  await utilities.click();
  await expectVisibleProjects(page, categories.Utilities);
  await expect(filters.getByRole('button', { pressed: true })).toHaveText('Utilities');

  await utilities.click();
  await expect(filters.getByRole('button', { pressed: true })).toHaveCount(0);
  await expect(page.locator('#demos .demo-card:visible')).toHaveCount(16);
});

test('each demo category shows the agreed projects, including overlapping memberships', async ({ page }) => {
  await page.goto('/');
  const filters = page.getByRole('group', { name: 'Filter demos', exact: true });
  for (const [category, titles] of Object.entries(categories)) {
    await filters.getByRole('button', { name: category, exact: true }).click();
    await expectVisibleProjects(page, titles);
    await expect(filters.getByRole('button', { pressed: true })).toHaveText(category);
    await expect(page.locator('#demos .demo-card')).toHaveCount(16);
  }
});

test('demo filters support Enter, Space, and visible keyboard focus', async ({ page }) => {
  await page.goto('/');
  const filters = page.getByRole('group', { name: 'Filter demos', exact: true });
  const apps = filters.getByRole('button', { name: 'Apps', exact: true });
  await apps.focus();
  await apps.press('Enter');
  await expect(apps).toBeFocused();
  await expectVisibleProjects(page, categories.Apps);

  await apps.press('Space');
  await expect(apps).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#demos .demo-card:visible')).toHaveCount(16);

  await page.keyboard.press('Tab');
  const mobile = filters.getByRole('button', { name: 'Mobile', exact: true });
  await expect(mobile).toBeFocused();
  const outline = await mobile.evaluate((button) => {
    const style = getComputedStyle(button);
    return { style: style.outlineStyle, width: parseFloat(style.outlineWidth), color: style.outlineColor };
  });
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThan(0);
  expect(outline.color).not.toBe('rgba(0, 0, 0, 0)');
  await mobile.press('Space');
  await expectVisibleProjects(page, categories.Mobile);
});

for (const width of [320, 390, 1280]) {
  test(`demo filter chips fit a ${width}px viewport with accessible touch targets`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const filters = page.getByRole('group', { name: 'Filter demos', exact: true });
    await expect(filters).toBeVisible();
    const bounds = [];
    for (const chip of await filters.getByRole('button').all()) {
      const box = await chip.boundingBox();
      expect(box).not.toBeNull();
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      bounds.push(box);
    }
    if (width < 1280) {
      expect(new Set(bounds.map((box) => Math.round(box.y))).size).toBeGreaterThan(1);
    }
    await filters.getByRole('button', { name: 'Mobile', exact: true }).click();
    await expectVisibleProjects(page, categories.Mobile);
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps all demo projects and their links available without inert filters', async ({ page }) => {
    await page.goto('/');
    const filters = page.locator('#demos [role="group"][aria-label="Filter demos"]');
    await expect(filters).toHaveCount(1);
    await expect(filters).toBeHidden();
    await expect(page.locator('#demos .demo-card:visible')).toHaveCount(16);
    await expect(page.locator('#demos .demo-card').filter({ hasText: 'Pubky Notes' }).getByRole('link', { name: 'Demo (opens in new tab)', exact: true })).toHaveAttribute('href', 'https://pubky-notes.vercel.app/');
  });
});
