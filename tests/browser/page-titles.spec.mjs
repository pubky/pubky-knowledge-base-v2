import { expect, test } from '@playwright/test';

// Keep title layout checks independent of analytics and external font services.
test.beforeEach(async ({ context, page, baseURL }) => {
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(baseURL).origin) {
      return route.continue();
    }
    return route.fulfill({ status: 200, body: '' });
  });
  // Load the bundled Inter face so fallback font metrics cannot hide overflow.
  await page.addInitScript(() => {
    const font = new FontFace('Inter', 'url(/images/fonts/inter/inter-latin-600-normal.woff)', { weight: '600' });
    window.pageTitleFontReady = font.load().then(async (loadedFont) => {
      document.fonts.add(loadedFont);
      await document.fonts.ready;
    });
  });
});

const pages = [
  ['/build/sdk/', 'Pubky SDK'],
  ['/build/private-storage/', 'Private Storage'],
  ['/architecture/', 'System Architecture'],
  ['/learn/semantic-social-graph/', 'Semantic Social Graph'],
  ['/social-data/indexing-and-aggregation/', 'Indexing & Aggregation'],
];

async function expectTitleRow(page, width) {
  await page.evaluate(() => window.pageTitleFontReady);
  const row = page.locator('.doc-title-row');
  const heading = row.getByRole('heading', { level: 1 });
  const controls = row.getByRole('group', { name: 'Markdown for this page' });
  const rowBounds = await row.boundingBox();
  const headingBounds = await heading.boundingBox();
  const controlsBounds = await controls.boundingBox();
  expect(rowBounds.x).toBeGreaterThanOrEqual(0);
  expect(rowBounds.x + rowBounds.width).toBeLessThanOrEqual(width);

  const text = await heading.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return {
      lines: range.getClientRects().length,
      width: range.getBoundingClientRect().width,
      availableWidth: element.clientWidth,
    };
  });
  expect(text.lines, 'The entire title stays on one line').toBe(1);
  expect(text.width, 'The title fits without clipping or overlapping controls').toBeLessThanOrEqual(text.availableWidth + 1);
  expect(headingBounds.x + headingBounds.width).toBeLessThanOrEqual(controlsBounds.x);
  expect(controlsBounds.x + controlsBounds.width).toBeLessThanOrEqual(rowBounds.x + rowBounds.width + 1);

  for (const control of [controls.getByRole('link'), controls.getByRole('button')]) {
    await expect(control).toBeVisible();
    const bounds = await control.boundingBox();
    expect(bounds.width).toBeGreaterThanOrEqual(44);
    expect(bounds.height).toBeGreaterThanOrEqual(44);
    const headingCenter = headingBounds.y + headingBounds.height / 2;
    expect(Math.abs(bounds.y + bounds.height / 2 - headingCenter)).toBeLessThanOrEqual(1);
  }
}

for (const width of [1440, 1024, 800, 390, 320]) {
  test(`page titles and Markdown controls share one row at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const [path, title] of pages) {
      await page.goto(path);
      await expect(page.locator('[data-markdown-copy]')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      await expectTitleRow(page, width);
    }
  });
}

for (const width of [1440, 320]) {
  for (const denied of [false, true]) {
    test(`Markdown ${denied ? 'denial' : 'success'} keeps title controls steady at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((shouldReject) => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            async writeText() {
              if (shouldReject) throw new DOMException('Clipboard denied', 'NotAllowedError');
            },
          },
        });
      }, denied);
      await page.goto('/learn/semantic-social-graph/');
      const copy = page.locator('[data-markdown-copy]');
      await expect(copy).toBeVisible();
      await page.evaluate(() => window.pageTitleFontReady);
      const elements = [
        page.locator('.doc-title-row'),
        page.getByRole('heading', { level: 1 }),
        page.getByRole('link', { name: 'View Markdown for this page (opens in new tab)' }),
        copy,
      ];
      const before = await Promise.all(elements.map((element) => element.boundingBox()));
      await copy.click();
      await expect(page.locator('.markdown-copy-status')).toHaveText(denied
        ? 'Couldn’t copy. Open Markdown and copy the address.'
        : 'Markdown link copied.');
      for (const [index, element] of elements.entries()) {
        expect(await element.boundingBox()).toEqual(before[index]);
      }
      await expectTitleRow(page, width);
    });
  }
}
