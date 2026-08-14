const CODE_LANGUAGE_META =
  /(?:^|\s)code-language="(javascript|react-native|rust)"/;

const LANGUAGE_LABELS = {
  javascript: 'JavaScript',
  'react-native': 'React Native',
  rust: 'Rust',
};

const LANGUAGE_ORDER = ['javascript', 'react-native', 'rust'];

/**
 * Turn consecutive language-specific code fences into an accessible,
 * synchronized language group. Every group has JavaScript and Rust, while
 * individual groups may also offer React Native.
 *
 * Usage:
 *
 *   ```js code-language="javascript"
 *   ```
 *   ```js code-language="react-native"
 *   ```
 *   ```rust code-language="rust"
 *   ```
 */
export default function remarkLanguageCodeGroups() {
  return (tree) => {
    let groupIndex = 0;

    walk(tree, () => {
      groupIndex += 1;
      return groupIndex;
    });
  };
}

function walk(parent, nextGroupIndex) {
  if (!Array.isArray(parent.children)) return;

  for (let index = 0; index < parent.children.length; index += 1) {
    const first = getLanguageCode(parent.children[index]);
    if (!first) {
      walk(parent.children[index], nextGroupIndex);
      continue;
    }

    const groupedCodes = [];
    for (let cursor = index; cursor < parent.children.length; cursor += 1) {
      const code = getLanguageCode(parent.children[cursor]);
      if (!code) break;
      groupedCodes.push(code);
    }

    if (groupedCodes.length < 2) {
      throw new Error(
        `language code group: ${first.language} block must be followed by its paired language block`,
      );
    }

    const blocks = new Map();
    for (const code of groupedCodes) {
      if (blocks.has(code.language)) {
        throw new Error(
          `language code group: duplicate ${code.language} block`,
        );
      }
      blocks.set(code.language, code.node);
    }

    if (!blocks.has('javascript') || !blocks.has('rust')) {
      throw new Error(
        'language code group: each group must contain one JavaScript block and one Rust block',
      );
    }

    const groupId = `language-code-${nextGroupIndex()}`;
    const languages = LANGUAGE_ORDER.filter((language) => blocks.has(language));
    for (const language of languages) {
      const block = blocks.get(language);
      block.meta = withUnframedCodeWindow(block.meta);
    }

    const replacement = [
      {
        type: 'html',
        value: renderGroupStart(groupId, languages),
      },
      blocks.get(languages[0]),
    ];

    for (const language of languages.slice(1)) {
      replacement.push(
        {
          type: 'html',
          value: renderPanelSwitch(groupId, language),
        },
        blocks.get(language),
      );
    }
    replacement.push({
      type: 'html',
      value: '</div>\n</div>\n</div>',
    });

    parent.children.splice(index, groupedCodes.length, ...replacement);

    index += replacement.length - 1;
  }
}

function getLanguageCode(node) {
  if (node?.type !== 'code' || !node.meta) return null;

  const language = getCodeLanguage(node.meta);
  if (!language) return null;

  return {
    language,
    node,
  };
}

export function getCodeLanguage(meta) {
  return meta?.match(CODE_LANGUAGE_META)?.[1] ?? null;
}

export function stripCodeLanguage(meta) {
  return meta
    .replace(
      /(^|\s+)code-language="(?:javascript|react-native|rust)"/,
      '$1',
    )
    .trim() || null;
}

export function getCodeLanguageLabel(language) {
  return LANGUAGE_LABELS[language] ?? language;
}

function withUnframedCodeWindow(meta) {
  return [stripCodeLanguage(meta), 'frame="none"'].filter(Boolean).join(' ');
}

function renderGroupStart(groupId, languages) {
  const firstLanguage = languages[0];
  const tabs = languages
    .map((language, index) => {
      const active = index === 0;
      const activeClass = active ? ' active' : '';
      const tabIndex = active ? '' : ' tabindex="-1"';

      return `<button class="tab${activeClass}" id="${groupId}-${language}-tab" type="button" role="tab" aria-selected="${active}" aria-controls="${groupId}-${language}-panel"${tabIndex} data-index="${language}" data-code-language="${language}">${LANGUAGE_LABELS[language]}</button>`;
    })
    .join('\n');

  return `<div class="language-code-group not-content" data-language-code-group>
<div class="language-code-terminal">
<div class="terminal-bar">
<div class="dots" aria-hidden="true">
<span class="dot dot-red"></span>
<span class="dot dot-yellow"></span>
<span class="dot dot-green"></span>
</div>
<div class="tabs" role="tablist" aria-label="Code language" data-language-count="${languages.length}">
${tabs}
</div>
</div>
<div class="language-code-panel command active" id="${groupId}-${firstLanguage}-panel" role="tabpanel" aria-labelledby="${groupId}-${firstLanguage}-tab" data-index="${firstLanguage}" data-language-code-panel="${firstLanguage}">`;
}

function renderPanelSwitch(groupId, language) {
  return `</div>
<div class="language-code-panel command" id="${groupId}-${language}-panel" role="tabpanel" aria-labelledby="${groupId}-${language}-tab" data-index="${language}" data-language-code-panel="${language}" hidden>`;
}
