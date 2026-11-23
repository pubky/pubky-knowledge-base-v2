import { expect, test } from '@playwright/test';

test('serves documentation, Markdown exports, and LLM resources', async ({ request }) => {
  for (const pathname of ['/', '/getting-started/', '/sdk/']) {
    const response = await request.get(pathname);
    expect(response.status(), pathname).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  }

  const markdown = await request.get('/getting-started.md');
  expect(markdown.status()).toBe(200);
  expect(markdown.headers()['content-type']).toContain('text/markdown');

  for (const pathname of ['/llms.txt', '/llms-full.txt', '/llms-small.txt']) {
    const response = await request.get(pathname);
    expect(response.status(), pathname).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
    expect(await response.text()).toContain('Pubky');
  }
});

test('preserves sitemap dates and legacy redirect pages', async ({ request }) => {
  const sitemap = await request.get('/sitemap-0.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('<lastmod>');

  const redirect = await request.get('/faq/');
  expect(redirect.status()).toBe(200);
  expect(await redirect.text()).toMatch(/http-equiv="refresh"[^>]+\/overview\//);
});

test('unknown pages and assets return the site 404 page', async ({ request }) => {
  for (const pathname of ['/missing-page/', '/_astro/missing.js']) {
    const response = await request.get(pathname);
    expect(response.status(), pathname).toBe(404);
    expect(await response.text()).toContain('Page not found');
  }
});

test('does not expose directory listings or runtime configuration', async ({ request }) => {
  for (const pathname of ['/_astro/', '/serve.json', '/package.json']) {
    const response = await request.get(pathname);
    expect(response.status(), pathname).toBe(404);
  }
});
