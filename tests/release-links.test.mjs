import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { compile } from '@mdx-js/mdx';
import { pinned_homeserver_release } from '../src/config/releases.mjs';
import { resolveReleaseLinks, resolveReleaseUrl } from '../plugins/release-links.mjs';
import remarkReleaseLinks from '../plugins/remark-release-links.mjs';

const homeserver = 'https://github.com/pubky/pubky-homeserver';
const placeholder = '{{pinned_homeserver_release}}';
const install = `${homeserver}/blob/${placeholder}/docs/INSTALL.md`;
const pinnedInstall = `${homeserver}/blob/${pinned_homeserver_release}/docs/INSTALL.md`;
const deployment = `${homeserver}/blob/${placeholder}/docs/DEPLOY.md`;
const pinnedDeployment = `${homeserver}/blob/${pinned_homeserver_release}/docs/DEPLOY.md`;

test('the Homeserver release pin matches the documented JavaScript and Rust SDK versions', () => {
  const jsManifest = JSON.parse(readFileSync(new URL('../snippets/js/package.json', import.meta.url), 'utf8'));
  const jsVersion = jsManifest.dependencies?.['@synonymdev/pubky'];
  assert.match(jsVersion ?? '', /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/,
    'Declare an exact @synonymdev/pubky version in snippets/js/package.json.');

  const rustManifest = readFileSync(new URL('../snippets/rust/Cargo.toml', import.meta.url), 'utf8');
  // Read the existing inline-table dependency format and fail if it changes,
  // rather than silently finding another crate's version or a comment.
  const dependencies = rustManifest.split(/^[ \t]*\[dependencies\][ \t]*(?:#[^\r\n]*)?$/m)[1]?.split(/^[ \t]*\[/m)[0];
  const pubkyDependency = dependencies?.match(/^[ \t]*pubky[ \t]*=[ \t]*\{([^}\r\n]*)\}/m)?.[1];
  const rustVersion = pubkyDependency?.match(/(?:^|,)[ \t]*version[ \t]*=[ \t]*(["'])(=[^"']+)\1(?=[ \t]*(?:,|$))/)?.[2];
  assert.ok(rustVersion,
    'Declare an exact pubky version in snippets/rust/Cargo.toml as pubky = { version = "=X.Y.Z", ... }, or update this check for a new manifest format.');
  assert.equal(rustVersion.slice(1), jsVersion,
    'Keep the documented JavaScript and Rust SDK versions aligned, then update pinned_homeserver_release in src/config/releases.mjs to the matching v-prefixed tag.');
  assert.equal(pinned_homeserver_release, `v${jsVersion}`,
    'When updating the documented SDK version, also update pinned_homeserver_release in src/config/releases.mjs to the matching v-prefixed tag.');
});

test('release URLs use the configured tag and preserve the remaining URL', () => {
  for (const kind of ['blob', 'tree']) {
    const suffix = '/docs/INSTALL.md?plain=1&return=%2Fdocs#configuration';
    assert.equal(
      resolveReleaseUrl(`${homeserver}/${kind}/${placeholder}${suffix}`),
      `${homeserver}/${kind}/${pinned_homeserver_release}${suffix}`,
    );
  }
});

test('release URL resolution leaves fixed versions and unrelated URLs unchanged', () => {
  const urls = [
    `${homeserver}/blob/v0.9.0/docs/INSTALL.md`,
    `${homeserver}/blob/main/docs/INSTALL.md`,
    `${homeserver}/blob/v0.9.0/docs/${placeholder}.md`,
    `${homeserver}/blob/v0.9.0/docs/INSTALL.md?ref=${placeholder}`,
    `${homeserver}/releases/tag/${placeholder}`,
    `https://github.com/pubky/pubky-core/blob/${placeholder}/README.md`,
    `https://example.com/pubky/pubky-homeserver/blob/${placeholder}/README.md`,
    `https://github.com.example.com/pubky/pubky-homeserver/blob/${placeholder}/README.md`,
    `https://github.com@other.example/pubky/pubky-homeserver/blob/${placeholder}/README.md`,
    `/pubky/pubky-homeserver/blob/${placeholder}/README.md`,
  ];

  for (const url of urls) {
    assert.equal(resolveReleaseUrl(url), url);
  }
});

test('Markdown exports resolve inline and reference destinations while preserving source text and code', () => {
  const content = (installUrl, deploymentUrl) => [
    '# Homeserver guides',
    '',
    `Read [Install **guide**](${installUrl} "Install ${placeholder}"), or [Deploy][deploy].`,
    '',
    `[deploy]: <${deploymentUrl}?plain=1#configuration> 'Deployment guide'`,
    '',
    `The variable is ${placeholder}.`,
    '',
    `\`[Inline example](${install})\``,
    '',
    '```markdown',
    `[Fenced example](${install})`,
    '```',
    '',
    '~~~markdown',
    `[Tilde example](${deployment})`,
    '~~~',
    '',
    `    [Indented example](${install})`,
    '',
    `[Fixed release](${homeserver}/blob/v0.9.0/README.md)`,
    '',
  ].join('\n');

  assert.equal(
    resolveReleaseLinks(content(install, deployment)),
    content(pinnedInstall, pinnedDeployment),
  );
});

test('the Astro Markdown processor renders pinned inline and reference links', async () => {
  const processor = await createMarkdownProcessor({
    remarkPlugins: [remarkReleaseLinks],
    syntaxHighlight: false,
  });
  const { code } = await processor.render([
    `[Install guide](${install}) and [Deployment guide][deploy].`,
    '',
    `[deploy]: ${deployment}#public-deployment`,
    '',
    `\`[Example](${install})\``,
  ].join('\n'));

  assert.ok(code.includes(`<a href="${pinnedInstall}">Install guide</a>`), code);
  assert.ok(code.includes(`<a href="${pinnedDeployment}#public-deployment">Deployment guide</a>`), code);
  assert.ok(code.includes(`<code>[Example](${install})</code>`), code);
});

test('MDX compilation accepts release placeholders and preserves code examples', async () => {
  const output = String(await compile([
    'import { Aside } from "@astrojs/starlight/components";',
    '',
    '<Aside type="tip">',
    '',
    `[Install guide](${install}) and [Deployment guide][deploy].`,
    '',
    '</Aside>',
    '',
    `[deploy]: ${deployment}#public-deployment`,
    '',
    '```markdown',
    `[Example](${install})`,
    '```',
  ].join('\n'), { remarkPlugins: [remarkReleaseLinks] }));

  assert.ok(output.includes(`href: "${pinnedInstall}"`), output);
  assert.ok(output.includes(`href: "${pinnedDeployment}#public-deployment"`), output);
  assert.ok(output.includes(`[Example](${install})`), output);
});
