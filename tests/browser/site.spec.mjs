import { expect, test as base } from '@playwright/test';

const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await use(page);
    expect(errors, 'Uncaught browser errors').toEqual([]);
  },
});

// Exercise the built site without sending analytics or depending on external
// services. External font stylesheets fall back to the site's local font stack.
test.beforeEach(async ({ context, baseURL }) => {
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(baseURL).origin) {
      return route.continue();
    }
    return route.fulfill({ status: 200, body: '' });
  });
});

async function mockClipboard(page, reject = false) {
  await page.addInitScript((shouldReject) => {
    window.copiedTexts = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        async writeText(text) {
          if (shouldReject) throw new DOMException('Clipboard denied', 'NotAllowedError');
          window.copiedTexts.push(text);
        },
      },
    });
  }, reject);
}

async function expectFitsViewport(locator, width) {
  const bounds = await locator.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(-1);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
}

for (const width of [320, 390, 1280]) {
  test(`homepage resources and Markdown controls fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Build for User Sovereignty');
    const resources = page.getByRole('region', { name: 'AI resources' });
    await expect(resources.getByRole('link')).toHaveCount(5);
    for (const link of await resources.getByRole('link').all()) {
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
    for (const locator of [resources, page.locator('.install-terminal'), page.locator('.open-with-links')]) {
      await expectFitsViewport(locator, width);
    }

    await page.goto('/getting-started/');
    const actions = page.getByRole('group', { name: 'Markdown for this page' });
    await expect(actions.getByRole('link')).toBeVisible();
    await expect(actions.getByRole('button')).toBeVisible();
    await expectFitsViewport(actions, width);
  });
}

test('copies Markdown, then the prompt and keyboard-selected SDK command after going back', async ({ page, baseURL }) => {
  await mockClipboard(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Human Docs', exact: true }).click();
  await expect(page).toHaveURL('/overview/');
  await page.getByRole('group', { name: 'Markdown for this page' }).getByRole('button').click();
  await expect(page.locator('.markdown-copy-status')).toHaveText('Markdown link copied.');
  expect(await page.evaluate(() => window.copiedTexts)).toEqual([`${baseURL}/overview.md`]);

  await page.goBack();
  await expect(page).toHaveURL('/');
  const copyPrompt = page.locator('[data-copy-kind="prompt"]');
  const prompt = await page.locator('.starter-prompt').textContent();
  await copyPrompt.click();
  await expect(page.locator('#starter-copy-status')).toHaveText(/Prompt copied/);
  await expect(copyPrompt.locator('[data-copy-label]')).toHaveText('Copied');
  await expect(copyPrompt).toBeEnabled();
  expect(await page.evaluate(() => window.copiedTexts)).toEqual([prompt]);
  await expect(copyPrompt.locator('[data-copy-label]')).toHaveText('Prompt');
  await expect(page.locator('#starter-copy-status')).toBeEmpty();

  const npmTab = page.getByRole('tab', { name: 'npm', exact: true });
  await npmTab.focus();
  await page.keyboard.press('ArrowRight');
  const nativeTab = page.getByRole('tab', { name: 'RN', exact: true });
  await expect(nativeTab).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Copy RN install command', exact: true }).click();
  await expect(page.locator('#sdk-copy-status')).toHaveText('Install command copied.');
  expect(await page.evaluate(() => window.copiedTexts)).toEqual([
    prompt,
    'npm install @synonymdev/react-native-pubky',
  ]);
});

test('clipboard denial leaves usable prompt and SDK fallbacks', async ({ page }) => {
  await mockClipboard(page, true);
  await page.goto('/');
  const copyPrompt = page.locator('[data-copy-kind="prompt"]');
  await copyPrompt.click();
  await expect(page.locator('#pubky-starter-prompt')).toHaveAttribute('open', '');
  await expect(page.locator('.starter-prompt')).toBeVisible();
  await expect(page.locator('#starter-copy-status')).toHaveText(/Select the prompt/);
  await expect(copyPrompt).toBeEnabled();

  const copyCommand = page.getByRole('button', { name: 'Copy npm install command', exact: true });
  await copyCommand.click();
  await expect(page.locator('#sdk-copy-status')).toHaveText(/Select the install command/);
  await expect(page.getByText('npm install @synonymdev/pubky', { exact: true })).toBeVisible();
  await expect(copyCommand).toBeEnabled();
});

test('an earlier SDK success timer does not clear a later tab’s failure feedback', async ({ page }) => {
  await mockClipboard(page);
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
  await page.goto('/');
  await page.getByRole('button', { name: 'Copy npm install command', exact: true }).click();
  await expect(page.locator('#sdk-copy-status')).toHaveText('Install command copied.');
  await page.clock.fastForward(1000);
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new DOMException('Clipboard denied', 'NotAllowedError');
    };
  });
  await page.getByRole('tab', { name: 'RN', exact: true }).click();
  await page.getByRole('button', { name: 'Copy RN install command', exact: true }).click();
  await expect(page.locator('#sdk-copy-status')).toHaveText(/Select the install command/);
  await page.clock.fastForward(1600);
  await expect(page.locator('#sdk-copy-status')).toHaveText(/Select the install command/);
});

test('opens generated Markdown and copies its absolute URL with reset feedback', async ({ page, request, baseURL }) => {
  await mockClipboard(page);
  await page.goto('/getting-started/');
  const actions = page.getByRole('group', { name: 'Markdown for this page' });
  const link = actions.getByRole('link');
  await expect(link).toHaveAttribute('href', '/getting-started.md');
  const markdown = await request.get(await link.getAttribute('href'));
  expect(markdown.ok()).toBeTruthy();
  expect(await markdown.text()).toContain('title: "Getting Started"');

  const button = actions.getByRole('button');
  await button.click();
  await expect(page.locator('.markdown-copy-status')).toHaveText('Markdown link copied.');
  await expect(button).toHaveAccessibleName('Copied Markdown link');
  expect(await page.evaluate(() => window.copiedTexts)).toEqual([`${baseURL}/getting-started.md`]);
  await expect(button).toHaveAccessibleName('Copy link to this page’s Markdown');
  await expect(page.locator('.markdown-copy-status')).toBeEmpty();
});

test('Markdown clipboard denial preserves the direct link and retry control', async ({ page }) => {
  await mockClipboard(page, true);
  await page.goto('/getting-started/');
  const actions = page.getByRole('group', { name: 'Markdown for this page' });
  await actions.getByRole('button').click();
  await expect(page.locator('.markdown-copy-status')).toHaveText(/Open Markdown and copy the address/);
  await expect(actions.getByRole('button')).toBeEnabled();
  await expect(actions.getByRole('link')).toHaveAttribute('href', '/getting-started.md');
});

test('respects reduced motion and restores the decorative network after navigation back', async ({ page }) => {
  await page.goto('/');
  const resources = page.getByRole('region', { name: 'AI resources' });
  await resources.scrollIntoViewIfNeeded();
  await expect(resources).toHaveAttribute('data-ai-motion', 'reduced');
  await expect(resources).toHaveAttribute('data-ai-running', 'false');
  await expect(resources).not.toHaveAttribute('data-ai-network-ready', 'true');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(resources).toHaveAttribute('data-ai-running', 'true');
  await expect(resources).toHaveAttribute('data-ai-network-ready', 'true');

  // Observe cleanup after the application's native pagehide handler runs.
  await resources.evaluate((root) => {
    window.addEventListener('pagehide', () => {
      sessionStorage.setItem('networkAfterPagehide', JSON.stringify({
        running: root.hasAttribute('data-ai-running'),
        canvasWidth: root.querySelector('canvas').width,
      }));
    }, { once: true });
  });
  await page.getByRole('link', { name: 'Human Docs', exact: true }).click();
  await expect(page).toHaveURL('/overview/');
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('networkAfterPagehide')))).toEqual({
    running: false,
    canvasWidth: 0,
  });

  await page.goBack();
  await expect(page).toHaveURL('/');
  await resources.scrollIntoViewIfNeeded();
  await expect(resources).toHaveAttribute('data-ai-running', 'true');
  await expect(resources).toHaveAttribute('data-ai-network-ready', 'true');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(resources).toHaveAttribute('data-ai-running', 'false');
  await expect(resources).not.toHaveAttribute('data-ai-network-ready', 'true');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps selectable content and direct resources while hiding inactive copy controls', async ({ page }) => {
    await page.goto('/');
    for (const button of await page.locator('[data-copy-text]').all()) {
      await expect(button).toBeHidden();
    }
    await page.getByText('Show starter prompt', { exact: true }).click();
    await expect(page.locator('.starter-prompt')).toBeVisible();
    await expect(page.getByRole('region', { name: 'AI resources' })).toBeVisible();
    await expect(page.getByText('npm install @synonymdev/pubky', { exact: true })).toBeVisible();
    await page.goto('/getting-started/');
    await expect(page.locator('[data-markdown-copy]')).toBeHidden();
    await expect(page.getByRole('link', { name: 'View Markdown for this page (opens in new tab)' })).toBeVisible();
  });
});
