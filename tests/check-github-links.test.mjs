import assert from 'node:assert/strict';
import test from 'node:test';
import {
  findGitHubLinks,
  findGitHubLinkViolations,
  isPinnedGitHubUrl,
  validateGitHubLinkExceptions,
} from '../scripts/check-github-links.mjs';

const homeserver = 'https://github.com/pubky/pubky-homeserver';
const placeholder = '{{pinned_homeserver_release}}';
const pinned = `${homeserver}/blob/${placeholder}/docs/INSTALL.md`;
const unpinned = `${homeserver}/blob/main/docs/INSTALL.md`;
const noExceptions = new Map();

test('pinned Homeserver file and tree links pass with their query and fragment intact', () => {
  const links = [pinned, `${homeserver}/tree/${placeholder}/docs?plain=1#guides`];
  assert.deepEqual(findGitHubLinkViolations(links.map((url) => `[Guide](${url})`).join('\n'), noExceptions), []);
  assert.equal(isPinnedGitHubUrl(pinned), true);
});

test('unpinned Homeserver links fail unless their exact URL has a reasoned exception', () => {
  const exceptions = validateGitHubLinkExceptions([{ url: unpinned, reason: 'Reviewed upstream guide.' }]);
  assert.deepEqual(findGitHubLinkViolations(`[Guide](${unpinned})`, noExceptions), [{ line: 1, url: unpinned }]);
  assert.deepEqual(findGitHubLinkViolations(`[Guide](${unpinned})`, exceptions), []);
  assert.deepEqual(findGitHubLinkViolations(`[Guide](${unpinned}?plain=1)`, exceptions), [{ line: 1, url: `${unpinned}?plain=1` }]);
  assert.deepEqual(findGitHubLinkViolations(`[Homeserver](${homeserver})`, noExceptions), [{ line: 1, url: homeserver }]);
});

test('other GitHub projects, organisation pages, and lookalikes are automatically excluded', () => {
  const urls = [
    'https://github.com/other/project/blob/main/README.md',
    `https://github.com/other/pubky-homeserver/blob/${placeholder}/README.md`,
    'https://github.com/pubky',
    'https://github.com/pubky/',
    'https://github.com/pubky?tab=repositories',
    'https://github.com/pubky/pkarr',
    'https://github.com/pubky/pkarr/blob/main/README.md',
    `https://github.com/pubky/pkarr/blob/${placeholder}/README.md`,
    'https://github.com/PUBKY/PKARR/blob/main/README.md',
    'https://github.com/pubky-ish/pubky-homeserver/blob/main/README.md',
    'https://github.com/pubkys/pubky-homeserver/blob/main/README.md',
    'https://github.com/pubky/another-pubky-homeserver/blob/main/README.md',
    'https://github.com/pubky/pubky-homeserver-archive/blob/main/README.md',
    'https://github.com/pubky/pubky-homeservers/blob/main/README.md',
    'https://github.com/another/pubky/blob/main/README.md',
    'https://github.com.example.com/pubky/pubky-homeserver/blob/main/README.md',
    'https://github.com:invalid/pubky/pubky-homeserver-archive/blob/main/README.md',
  ];
  assert.deepEqual(findGitHubLinkViolations(urls.map((url) => `[Project](${url})`).join('\n'), noExceptions), []);
});

test('Homeserver scope matches decoded owner and repository names without case sensitivity', () => {
  const urls = [
    'https://GITHUB.COM/PUBKY/PUBKY-HOMESERVER/blob/main/README.md',
    'https://github.com/%70ubky/%70ubky-homeserver/blob/main/README.md',
  ];
  assert.deepEqual(findGitHubLinkViolations(urls.map((url) => `[Guide](${url})`).join('\n'), noExceptions),
    urls.map((url, index) => ({ line: index + 1, url })));
});

test('a placeholder in the wrong Homeserver URL position does not pass', () => {
  const urls = [
    `${homeserver}/blob/main/docs/${placeholder}/README.md`,
    `${homeserver}/blob/main/README.md?ref=${placeholder}`,
    `${homeserver}/blob/${placeholder}`,
    `${homeserver}/blob/${placeholder}/../README.md`,
    `${homeserver}/blob/${placeholder}/%2e%2e/README.md`,
  ];
  assert.equal(findGitHubLinkViolations(urls.map((url) => `[Guide](${url})`).join('\n'), noExceptions).length, urls.length);
});

test('HTTP, credentials, malformed escapes, and lookalike origins cannot form an approved pinned URL', () => {
  const urls = [
    pinned.replace('https:', 'http:'),
    pinned.replace('github.com', 'user:password@github.com'),
    pinned.replace('github.com', 'github.com:invalid'),
    `${pinned}/%zz`,
  ];
  assert.equal(findGitHubLinkViolations(urls.map((url) => `[Guide](${url})`).join('\n'), noExceptions).length, urls.length);
  assert.equal(isPinnedGitHubUrl(pinned.replace('github.com', 'github.com.example.com')), false);
  assert.equal(isPinnedGitHubUrl(pinned.replace('github.com', 'github.com@other.example')), false);
});

test('Markdown inline links, reference definitions, and autolinks report their source lines', () => {
  const content = [`[Inline](${unpinned})`, '', `[reference]: ${homeserver}`, '', `<${homeserver}/issues>`].join('\n');
  assert.deepEqual(findGitHubLinkViolations(content, noExceptions), [
    { line: 1, url: unpinned },
    { line: 3, url: homeserver },
    { line: 5, url: `${homeserver}/issues` },
  ]);
});

test('bare GitHub URLs in prose are checked while link labels and code are ignored', () => {
  const content = [
    `See ${unpinned}.`,
    '',
    'Related project: https://github.com/another/project.',
    '',
    `[${unpinned}](https://example.com)`,
    '',
    `\`${unpinned}\``,
    '',
    `(${homeserver}/issues).`,
    '',
    'Other Pubky project: https://github.com/pubky/pkarr.',
  ].join('\n');
  assert.deepEqual(findGitHubLinkViolations(content, noExceptions), [
    { line: 1, url: unpinned },
    { line: 9, url: `${homeserver}/issues` },
  ]);
});

test('placeholders are accepted only in Markdown destinations resolved by every output path', () => {
  assert.deepEqual(findGitHubLinkViolations(`<${pinned}>`, noExceptions), []);
  const examples = [
    { content: pinned },
    { content: `![Guide](${pinned})` },
    { content: `<a href="${pinned}">Guide</a>` },
    { content: `<Link href={'${pinned}'} />` },
    { content: `<a href="${pinned}">Guide</a>`, options: { astro: true } },
    { content: `---\nconst card = { href: '${pinned}' };\n---`, options: { astro: true } },
  ];
  for (const { content, options } of examples) {
    const violations = findGitHubLinkViolations(content, noExceptions, options);
    assert.equal(violations.length, 1);
    assert.match(violations[0].message, /use a Markdown link or a concrete URL with an explicit exception/);
  }
});

test('inline, fenced, and indented code examples and HTML comments are ignored', () => {
  const content = [
    `\`[Example](${unpinned})\``,
    `\`<a href="${unpinned}">Example</a>\``,
    '',
    '```markdown',
    `[Example](${unpinned})`,
    `<a href="${unpinned}">Example</a>`,
    '```',
    '',
    '~~~markdown',
    `[Example](${unpinned})`,
    '~~~',
    '',
    `    [Example](${unpinned})`,
    '',
    `<!-- <a href="${unpinned}">Comment</a> -->`,
  ].join('\n');
  assert.deepEqual(findGitHubLinkViolations(content, noExceptions), []);
});

test('static HTML and MDX href values are checked, including entity-encoded hostnames', () => {
  const content = [
    `<a href="${unpinned}">Guide</a>`,
    '',
    `<Link href={'${homeserver}'} />`,
    '',
    `<a href="https://github&#46;com/pubky/pubky-homeserver/issues">Issues</a>`,
    '',
    `<a title='href="${unpinned}"'>No link</a>`,
  ].join('\n');
  assert.deepEqual(findGitHubLinkViolations(content, noExceptions), [
    { line: 1, url: unpinned },
    { line: 3, url: homeserver },
    { line: 5, url: `${homeserver}/issues` },
  ]);
});

test('Astro static href attributes and frontmatter card destinations are checked without evaluating code', () => {
  const content = [
    '---',
    `const cards = [{ href: "${unpinned}" }];`,
    `// href: "${homeserver}/issues"`,
    `const example = 'href: "${homeserver}/actions"';`,
    '---',
    `<a href="${homeserver}">Repository</a>`,
  ].join('\n');
  assert.deepEqual(findGitHubLinks(content, { astro: true }), [
    { line: 2, url: unpinned },
    { line: 6, url: homeserver },
  ]);
});

test('exceptions need exact Homeserver URLs and nonempty reasons', () => {
  for (const entries of [
    {},
    [{ url: unpinned }],
    [{ url: unpinned, reason: '   ' }],
    [{ url: `${homeserver}/*`, reason: 'Too broad.' }],
    [{ url: pinned, reason: 'A placeholder is not a concrete URL.' }],
    [{ url: unpinned, reason: 'One.' }, { url: unpinned, reason: 'Two.' }],
  ]) {
    assert.throws(() => validateGitHubLinkExceptions(entries));
  }
});

test('exceptions for other projects and organisation pages are rejected as unnecessary', () => {
  const urls = [
    'https://github.com/other/project',
    'https://github.com/pubky',
    'https://github.com/pubky/pkarr',
    'https://github.com/pubky/pubky-homeserver-archive',
  ];
  for (const url of urls) {
    assert.throws(() => validateGitHubLinkExceptions([{ url, reason: 'Already automatically excluded.' }]),
      /Exception must be an exact HTTPS URL under github\.com\/pubky\/pubky-homeserver:/);
  }
});
