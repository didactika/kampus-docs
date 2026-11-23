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
// @package   kampus-docs
// @copyright 2026 Didactika
// @author    Hector Arrechea <hectorlazaroarrechea@gmail.com>
// @license   https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0-or-later
// @since     0.1.0
//
// SPDX-License-Identifier: AGPL-3.0-or-later
// ------------------------------------------------------------------------------

/**
 * Checks the links between pages of the built site: every internal link (and its anchor) of every page of `dist/`
 * leads to a page that exists. Run it after `npm run build`.
 *
 * Usage: node tools/check-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.error('check-links: no dist/; run npm run build first');
  process.exit(2);
}

/**
 * Every HTML file under a folder.
 *
 * @param {string} dir Folder.
 * @returns {string[]} Paths.
 */
const pages = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return pages(p);
    return e.name.endsWith('.html') ? [p] : [];
  });

/** @type {Map<string, Set<string>>} The ids of each page, read on demand. */
const ids = new Map();

/**
 * The ids a page declares.
 *
 * @param {string} file The page.
 * @returns {Set<string>} Its ids.
 */
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

/**
 * The file a site path resolves to, if any.
 *
 * @param {string} target The path, without query or anchor.
 * @returns {string | null} The file.
 */
const resolve = (target) => {
  const clean = decodeURIComponent(target).replace(/^\/+/, '');
  for (const candidate of [path.join(dist, clean), path.join(dist, clean, 'index.html'), path.join(dist, `${clean}.html`)]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
};

const problems = [];
let links = 0;
for (const file of pages(dist)) {
  const html = fs.readFileSync(file, 'utf8');
  const here = `/${path.relative(dist, file).replaceAll('\\', '/').replace(/index\.html$/, '')}`;
  for (const [, href] of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(href)) continue;
    const [pathPart, anchor] = href.split('#');
    const absolute = pathPart === '' ? here : pathPart.startsWith('/') ? pathPart : new URL(pathPart, `http://site${here}`).pathname;
    const target = resolve(absolute.split('?')[0]);
    links += 1;
    if (!target) problems.push(`${here}: ${href} leads nowhere`);
    else if (anchor && !idsOf(target).has(decodeURIComponent(anchor))) problems.push(`${here}: ${href} has no anchor #${anchor}`);
  }
}

if (problems.length > 0) {
  console.error([...new Set(problems)].join('\n'));
  console.error(`check-links: ${new Set(problems).size} broken link(s)`);
  process.exit(1);
}
console.log(`check-links: ${links} internal links lead to pages that exist`);
