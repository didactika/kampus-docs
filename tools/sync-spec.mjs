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
 * Reads the Kampus repository (by default next to this one) and writes what the site shows from it:
 * the use cases with their status (`src/data/use-cases.json`) and the changelog
 * (`src/content/docs/releases/changelog.md`). A use case is available once its traceability row points
 * to code that exists.
 *
 * Usage: node tools/sync-spec.mjs [path to the kampus repository]
 */
import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(process.argv[2] ?? process.env.KAMPUS_REPO ?? '../kampus');
const dataFile = path.resolve('src/data/use-cases.json');
const changelogPage = path.resolve('src/content/docs/releases/changelog.md');
const casesDir = path.join(repo, 'docs/01-requirements/use-cases');

/**
 * Reads a field of the front matter of a use-case card.
 *
 * @param {string} text Card contents.
 * @param {string} name Field name.
 * @returns {string} The value, or an empty string.
 */
const field = (text, name) => text.match(new RegExp(`^${name}: (.*)$`, 'm'))?.[1]?.trim() ?? '';

/**
 * Writes a file only when its contents change, so the development server reloads only for real changes.
 *
 * @param {string} file Path of the file.
 * @param {string} text New contents.
 */
const write = (file, text) => {
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) fs.writeFileSync(file, text);
};

if (!fs.existsSync(casesDir)) {
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, `${JSON.stringify({ version: 'unknown', useCases: [] }, null, 2)}\n`);
  console.log(`sync-spec: no Kampus repository at ${repo}; the last synchronised data is kept`);
  process.exit(0);
}

const manifest = fs.readFileSync(path.join(repo, 'Cargo.toml'), 'utf8');
const version = manifest.match(/\[workspace\.package\][^[]*?version\s*=\s*"([^"]+)"/s)?.[1] ?? 'unknown';
const trace = fs
  .readFileSync(path.join(repo, 'docs/05-quality/traceability.csv'), 'utf8')
  .split('\n')
  .slice(1)
  .map((line) => line.split(','));

const useCases = fs
  .readdirSync(casesDir)
  .map((name) => {
    const card = fs.readFileSync(path.join(casesDir, name, 'README.md'), 'utf8');
    const code = trace.find((row) => row[2] === name)?.[5] ?? '';
    return {
      id: field(card, 'id'),
      name,
      title: field(card, 'title'),
      goal: card.match(/^\| Goal \| (.*) \|$/m)?.[1] ?? '',
      actors: field(card, 'actor').split(',').map((actor) => actor.trim()),
      availableSince: code && fs.existsSync(path.join(repo, code)) ? version : null,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

fs.mkdirSync(path.dirname(dataFile), { recursive: true });
write(dataFile, `${JSON.stringify({ version, useCases }, null, 2)}\n`);

const changelog = fs.existsSync(path.join(repo, 'CHANGELOG.md')) ? fs.readFileSync(path.join(repo, 'CHANGELOG.md'), 'utf8') : '';
const body = changelog.replace(/^# Changelog\n+/, '');
write(
  changelogPage,
  `---\ntitle: Changelog\ndescription: What changes in each version of Kampus, with the upgrade steps.\nsidebar:\n  order: 1\n---\n\n${body}`,
);
console.log(`sync-spec: ${useCases.length} use cases and the changelog of Kampus ${version}`);
