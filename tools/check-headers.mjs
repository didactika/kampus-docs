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
 * Checks, or with `--fix` writes, the standard Kampus header of every source file of the documentation
 * site (DEC-083 of Kampus).
 *
 * Usage: node tools/check-headers.mjs [--fix] [--author "Name <address>"]
 */
import fs from 'node:fs';
import path from 'node:path';
import { checkHeaders } from './headers.mjs';

const args = process.argv.slice(2);
const author = args.includes('--author') ? args[args.indexOf('--author') + 1] : 'unknown';
const ignored = new Set(['.git', 'node_modules', 'dist', '.astro']);

/**
 * Lists every file of the tree, relative to the root.
 *
 * @param {string} dir Directory relative to the root.
 * @returns {string[]} Paths with forward slashes.
 */
const walk = (dir) =>
  fs.readdirSync(path.join('.', dir), { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const rel = dir ? `${dir}/${entry.name}` : entry.name;
    return entry.isDirectory() ? walk(rel) : [rel];
  });

const result = checkHeaders('.', walk(''), { fix: args.includes('--fix'), author, since: '0.1.0', project: 'kampus-docs' });
if (result.problems.length) {
  console.error(result.problems.join('\n'));
  process.exit(1);
}
console.log(`Headers OK: ${result.summary}.`);
