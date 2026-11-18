// ------------------------------------------------------------------------------
//
//     _  __    _    __  __ ____  _   _ ____
//    | |/ /   / \  |  \/  |  _ \| | | / ___|
//    | ' /   / _ \ | |\/| | |_) | | | \___ \
//    | . \  / ___ \| |  | |  __/| |_| |___) |
//    |_|\_\/_/   \_\_|  |_|_|    \___/|____/
//
//    Knowledge Academic Modular Platform for Universal Study
//
// ------------------------------------------------------------------------------
//
// This file is part of Kampus - https://github.com/didactika/kampus
//
// Kampus is free software: you can redistribute it and/or modify it under the terms of the
// GNU Affero General Public License as published by the Free Software Foundation, either
// version 3 of the License, or (at your option) any later version.
//
// Kampus is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
// even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with Kampus.
// If not, see <https://www.gnu.org/licenses/>.
//
// @package   tools/repo-check
// @copyright 2026 Didactika
// @author    Hector Arrechea <hectorlazaroarrechea@gmail.com>
// @license   https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0-or-later
// @since     0.1.0
//
// SPDX-License-Identifier: AGPL-3.0-or-later
// ------------------------------------------------------------------------------

/**
 * The standard file header of DEC-083: which files need it, how it is written in each comment syntax,
 * and how a missing or outdated one is replaced.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Comment syntax per file kind: line prefix, or opening and closing lines for block comments. */
const STYLES = {
  slash: { line: '//' },
  hash: { line: '#' },
  dash: { line: '--' },
  block: { open: '/*', line: ' *', close: ' */' },
  markup: { open: '<!--', line: '   ', close: '-->' },
  astro: { open: '---', line: '//', close: null, inside: true },
};

/** File name patterns mapped to their comment syntax. */
const KINDS = [
  [/\.(rs|js|mjs|cjs|ts|tsx|jsx)$/, 'slash'],
  [/\.astro$/, 'astro'],
  [/\.(toml|ya?ml|sh|bash)$/, 'hash'],
  [/(^|\/)(Dockerfile|\.gitignore|\.gitattributes|\.dockerignore|\.env\.example|\.editorconfig)$/, 'hash'],
  [/\.(css|scss)$/, 'block'],
  [/\.(svelte|html)$/, 'markup'],
  [/\.sql$/, 'dash'],
];

/** Paths that never carry the header: the specification, generated or binary files, the licence. */
const EXEMPT = [/^docs\//, /\.md$/, /\.mdx$/, /\.json$/, /\.lock$/, /^LICENSE$/, /\.(svg|png|jpg|ico|woff2?)$/, /(^|\/)node_modules\//, /^target\//];

/** The project line every header starts its notice with. */
export const MARKER = 'This file is part of Kampus';

/** The licence of Kampus (DEC-085). */
export const SPDX = 'AGPL-3.0-or-later';

/** The KAMPUS banner, in the standard FIGlet font. */
const BANNER = [
  String.raw` _  __    _    __  __ ____  _   _ ____`,
  String.raw`| |/ /   / \  |  \/  |  _ \| | | / ___|`,
  String.raw`| ' /   / _ \ | |\/| | |_) | | | \___ \ `,
  String.raw`| . \  / ___ \| |  | |  __/| |_| |___) |`,
  String.raw`|_|\_\/_/   \_\_|  |_|_|    \___/|____/`,
];

/** The width of the rules that frame the banner. */
const RULE = '-'.repeat(78);

/**
 * Returns the comment syntax of a file, or null when it needs no header.
 *
 * @param {string} file Path relative to the repository root, with forward slashes.
 * @returns {string|null} A key of STYLES.
 */
export function styleOf(file) {
  if (EXEMPT.some((re) => re.test(file))) return null;
  return KINDS.find(([re]) => re.test(file))?.[1] ?? null;
}

/**
 * Derives the `@package` of a file from where it lives.
 *
 * @param {string} file Path relative to the repository root.
 * @param {string} project The package of files at the root (`kampus`, `kampus-docs`).
 * @returns {string} The crate, the component or the project.
 */
export function packageOf(file, project = 'kampus') {
  const parts = file.split('/');
  if (parts[0] === 'crates' && parts.length > 2) return parts[1];
  if (['tools', 'web', 'handbook'].includes(parts[0]) && parts.length > 2) return `${parts[0]}/${parts[1]}`;
  return project;
}

/**
 * The lines of the header, without comment syntax.
 *
 * @param {{pkg: string, author: string, since: string, year: string}} fields Header fields.
 * @returns {string[]} The lines.
 */
export function headerLines({ pkg, author, since, year }) {
  const banner = BANNER.map((line) => `   ${line}`.trimEnd());
  return [
    RULE,
    '',
    ...banner,
    '',
    '   Knowledge Academic Modular Platform for Universal Study',
    '',
    RULE,
    '',
    `${MARKER} - https://github.com/didactika/kampus`,
    '',
    'Kampus is free software: you can redistribute it and/or modify it under the terms of the',
    'GNU Affero General Public License as published by the Free Software Foundation, either',
    'version 3 of the License, or (at your option) any later version.',
    '',
    'Kampus is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without',
    'even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the',
    'GNU Affero General Public License for more details.',
    '',
    'You should have received a copy of the GNU Affero General Public License along with Kampus.',
    'If not, see <https://www.gnu.org/licenses/>.',
    '',
    `@package   ${pkg}`,
    `@copyright ${year} Didactika`,
    `@author    ${author}`,
    `@license   https://www.gnu.org/licenses/agpl-3.0.html ${SPDX}`,
    `@since     ${since}`,
    '',
    `SPDX-License-Identifier: ${SPDX}`,
    RULE,
  ];
}

/**
 * Builds the header text of a file in its comment syntax.
 *
 * @param {string} style A key of STYLES.
 * @param {{pkg: string, author: string, since: string, year: string}} fields Header fields.
 * @returns {string} The header, ending with a blank line (for `astro`, the lines that go inside the front matter).
 */
export function header(style, fields) {
  const s = STYLES[style];
  const lines = headerLines(fields).map((l) => (l ? `${s.line} ${l}` : s.line).trimEnd());
  if (s.inside) return `${lines.join('\n')}\n\n`;
  return [...(s.open ? [s.open] : []), ...lines, ...(s.close ? [s.close] : []), '', ''].join('\n');
}

/**
 * Tells whether a file starts with a complete, current header.
 *
 * @param {string} text File contents.
 * @returns {boolean} True when the banner, the notice and every field are present.
 */
export function hasHeader(text) {
  const head = text.split('\n').slice(0, 45).join('\n');
  return head.includes(MARKER) && head.includes('GNU Affero General Public License') && head.includes(`SPDX-License-Identifier: ${SPDX}`)
    && ['@package', '@copyright', '@author', '@license', '@since'].every((field) => new RegExp(`${field}\\s+\\S`).test(head))
    && head.includes('Knowledge Academic Modular Platform for Universal Study') && head.includes(BANNER[4]);
}

/**
 * Removes an earlier Kampus header from the start of a file and returns what it recorded.
 *
 * @param {string} text File contents, after any shebang or front matter opening.
 * @returns {{rest: string, since: string|null}} The text without the old header, and its `@since`.
 */
function stripOldHeader(text) {
  const lines = text.split('\n');
  let start = 0;
  if (/^(\/\*|<!--)\s*$/.test(lines[0] ?? '')) start = 1;
  let end = start;
  while (end < lines.length && /^(\/\/|#|--|\s\*|\s*$)/.test(lines[end]) && !/^\s*\*\/\s*$/.test(lines[end]) && !/^-->/.test(lines[end])) {
    if (/^\s*$/.test(lines[end]) && end > start) break;
    end += 1;
  }
  const block = lines.slice(0, end + 1).join('\n');
  if (!block.includes(MARKER)) return { rest: text, since: null };
  let cut = end;
  if (/^(\s*\*\/|-->)\s*$/.test(lines[cut] ?? '')) cut += 1;
  while (cut < lines.length && /^\s*$/.test(lines[cut])) cut += 1;
  const since = block.match(/@since\s+(\S+)/)?.[1] ?? null;
  return { rest: lines.slice(cut).join('\n'), since };
}

/**
 * Checks, and optionally fixes, the headers of the given files.
 *
 * @param {string} root Repository root.
 * @param {string[]} files Paths relative to the root.
 * @param {{fix: boolean, author: string, since: string, project?: string}} options Fix mode and the fields of new headers.
 * @returns {{problems: string[], summary: string}} Problems left and a one-line summary.
 */
export function checkHeaders(root, files, { fix, author, since, project = 'kampus' }) {
  const problems = [];
  let checked = 0;
  let fixed = 0;
  for (const file of files) {
    const style = styleOf(file);
    if (!style) continue;
    checked += 1;
    const full = path.join(root, file);
    if (!fs.existsSync(full)) continue;
    const text = fs.readFileSync(full, 'utf8');
    if (hasHeader(text)) continue;
    if (!fix) {
      problems.push(`${file}: missing or outdated standard header (run tools/repo-check with --fix)`);
      continue;
    }
    let lead = '';
    let body = text;
    if (text.startsWith('#!')) {
      lead = `${text.split('\n')[0]}\n`;
      body = text.slice(lead.length);
    }
    if (style === 'astro' && body.startsWith('---\n')) {
      lead += '---\n';
      body = body.slice(4);
    }
    const old = stripOldHeader(body);
    const fields = { pkg: packageOf(file, project), author, since: old.since ?? since, year: new Date().getFullYear().toString() };
    fs.writeFileSync(full, lead + header(style, fields) + old.rest);
    fixed += 1;
  }
  return { problems, summary: `${checked} file(s) with headers${fixed ? `, ${fixed} written` : ''}` };
}
