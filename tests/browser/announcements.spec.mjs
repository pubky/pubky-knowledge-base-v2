import { expect, test as base } from '@playwright/test';

const START = Date.parse('2026-09-27T00:00:00Z');
const END = Date.parse('2026-10-07T18:00:00Z');
const POST_URL = 'https://pubky.app/post/ihaqcthsdbk751sxctk849bdr7yz7a934qen5gmpcbwcur49i97y/0035REMNNEZ1G';

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

async function pauseClock(page, timestamp) {
  await page.clock.install({ time: new Date(timestamp - 1000) });
  await page.clock.pauseAt(new Date(timestamp));
}

async function expectFitsViewport(locator, width) {
  const bounds = await locator.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(-1);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
}

for (const { label, timestamp, active } of [
  { label: 'before its start', timestamp: START - 1, active: false },
  { label: 'at its exact start', timestamp: START, active: true },
  { label: 'during the call', timestamp: Date.parse('2026-10-07T17:00:00Z'), active: true },
  { label: 'at its exact end', timestamp: END, active: false },
  { label: 'after its end', timestamp: END + 1, active: false },
]) {
  test(`the community call announcement is ${active ? 'visible' : 'hidden'} ${label}`, async ({ page }) => {
    await pauseClock(page, timestamp);
    await page.goto('/');
    const region = page.locator('scheduled-announcements');
    const announcement = region.locator('[data-announcement]');
    await expect(announcement).toHaveCount(1);
    if (active) {
      await expect(page.getByRole('region', { name: 'Latest announcements' })).toBeVisible();
      await expect(announcement).toBeVisible();
      await expect(announcement.getByRole('heading')).toHaveText('Pubky Community Call #4');
      await expect(announcement.getByRole('link', { name: /^Join the call/ })).toHaveAttribute('href', 'https://meet.google.com/xny-ztvd-zyk');
      await expect(announcement.getByRole('link', { name: /^Announcement on pubky\.app/ })).toHaveAttribute('href', POST_URL);
      await expect(announcement.locator('time[datetime="2026-10-07T16:00:00Z"]')).toBeVisible();
    } else {
      await expect(announcement).toBeHidden();
      await expect(region).toBeHidden();
      expect(await region.boundingBox()).toBeNull();
    }
  });
}

test('an open page shows and expires announcements without a reload', async ({ page }) => {
  await pauseClock(page, START - 1);
  await page.goto('/');
  const region = page.locator('scheduled-announcements');
  await expect(region).toBeHidden();
  await page.clock.runFor(1);
  await expect(region).toBeVisible();

  // Move close to expiry without running every timer over the intervening days.
  await page.clock.setSystemTime(new Date(END - 1));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(region).toBeVisible();
  await page.clock.runFor(1);
  await expect(region).toBeHidden();
});

for (const event of ['focus', 'pageshow', 'visibilitychange']) {
  test(`${event} resynchronizes announcements after the system clock changes`, async ({ page }) => {
    await pauseClock(page, START);
    await page.goto('/');
    const region = page.locator('scheduled-announcements');
    await expect(region).toBeVisible();

    for (const [timestamp, active] of [[END, false], [START, true]]) {
      await page.clock.setSystemTime(new Date(timestamp));
      await page.evaluate((name) => {
        if (name === 'visibilitychange') {
          document.dispatchEvent(new Event(name));
        } else if (name === 'pageshow') {
          window.dispatchEvent(new PageTransitionEvent(name, { persisted: true }));
        } else {
          window.dispatchEvent(new Event(name));
        }
      }, event);
      if (active) await expect(region).toBeVisible();
      else await expect(region).toBeHidden();
    }
  });
}

test('independent schedules support concurrent announcements and hide an empty region', async ({ page }) => {
  await pauseClock(page, START);
  await page.goto('/');
  await expect(page.locator('scheduled-announcements')).toBeVisible();
  await page.locator('scheduled-announcements').evaluate((original, timestamp) => {
    const region = original.cloneNode(true);
    const template = region.querySelector('[data-announcement]').cloneNode(true);
    region.replaceChildren();
    region.hidden = true;
    for (const [name, start, end] of [
      ['current', -1000, 1000],
      ['concurrent', -1000, 2000],
      ['future', 1000, 3000],
      ['expired', -2000, -1000],
    ]) {
      const article = template.cloneNode(true);
      article.setAttribute('data-test-announcement', name);
      article.dataset.startsAt = new Date(timestamp + start).toISOString();
      article.dataset.endsAt = new Date(timestamp + end).toISOString();
      article.hidden = true;
      region.append(article);
    }
    original.replaceWith(region);
  }, START);

  const region = page.locator('scheduled-announcements');
  const visible = region.locator('[data-announcement]:visible');
  await expect(visible).toHaveCount(2);
  await expect(region.locator('[data-test-announcement="current"]')).toBeVisible();
  await expect(region.locator('[data-test-announcement="concurrent"]')).toBeVisible();
  await expect(region.locator('[data-test-announcement="future"]')).toBeHidden();
  await expect(region.locator('[data-test-announcement="expired"]')).toBeHidden();

  await page.clock.runFor(1000);
  await expect(visible).toHaveCount(2);
  await expect(region.locator('[data-test-announcement="current"]')).toBeHidden();
  await expect(region.locator('[data-test-announcement="future"]')).toBeVisible();
  await page.clock.runFor(2000);
  await expect(visible).toHaveCount(0);
  await expect(region).toBeHidden();
  expect(await region.boundingBox()).toBeNull();
});

for (const width of [320, 390, 1280]) {
  test(`announcement and both actions fit a ${width}px viewport and support keyboard focus`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await pauseClock(page, START);
    await page.goto('/');
    const region = page.getByRole('region', { name: 'Latest announcements' });
    const join = region.getByRole('link', { name: /^Join the call/ });
    const discuss = region.getByRole('link', { name: /^Announcement on pubky\.app/ });
    for (const locator of [region, region.locator('[data-announcement]'), join, discuss]) {
      await expect(locator).toBeVisible();
      await expectFitsViewport(locator, width);
    }
    for (const link of [join, discuss]) {
      expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44);
      if (await link.getAttribute('target') === '_blank') {
        await expect(link).toHaveAttribute('rel', /noopener/);
        await expect(link).toHaveAccessibleName(/\(opens in new tab\)/);
      }
    }
    await join.focus();
    await page.keyboard.press('Tab');
    await expect(discuss).toBeFocused();
    const outline = await discuss.evaluate((link) => {
      const styles = getComputedStyle(link);
      return { style: styles.outlineStyle, width: parseFloat(styles.outlineWidth) };
    });
    expect(outline.style).not.toBe('none');
    expect(outline.width).toBeGreaterThan(0);
  });
}

test('announcements only appear on the landing page', async ({ page }) => {
  await pauseClock(page, START);
  await page.goto('/getting-started/');
  await expect(page.locator('scheduled-announcements')).toHaveCount(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('scheduled information stays hidden and takes no layout space', async ({ page }) => {
    await page.goto('/');
    const region = page.locator('scheduled-announcements');
    await expect(region).toHaveCount(1);
    await expect(region).toHaveAttribute('hidden');
    await expect(region).toBeHidden();
    await expect(region.locator('[data-announcement]')).toBeHidden();
    expect(await region.boundingBox()).toBeNull();
  });
});
