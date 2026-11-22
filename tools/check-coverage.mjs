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
 * Checks that every use case available in this version of Kampus is documented for each of its roles: some guide in
 * the folder of each actor declares it with `<!-- covers: name, name -->`. The folders of each actor are read from the
 * `UseCaseList` of the index of each audience; actors without a folder (the system itself) need no guide.
 *
 * Usage: node tools/check-coverage.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const docs = path.resolve('src/content/docs');
const { version, useCases } = JSON.parse(fs.readFileSync(path.resolve('src/data/use-cases.json'), 'utf8'));

/** @type {Map<string, string[]>} The folders of each actor. */
const folders = new Map();
/** @type {Map<string, Set<string>>} The use cases each folder covers. */
const covered = new Map();

for (const entry of fs.readdirSync(docs, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === 'es') continue;
  const folder = path.join(docs, entry.name);
  const index = ['index.mdx', 'index.md'].map((f) => path.join(folder, f)).find((f) => fs.existsSync(f));
  const list = index ? fs.readFileSync(index, 'utf8').match(/<UseCaseList actors=\{\[([^\]]*)\]\}/) : null;
  for (const actor of list ? [...list[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : []) {
    folders.set(actor, [...(folders.get(actor) ?? []), entry.name]);
  }
  const names = new Set();
  for (const file of fs.readdirSync(folder).filter((f) => /\.mdx?$/.test(f))) {
    for (const m of fs.readFileSync(path.join(folder, file), 'utf8').matchAll(/<!-- covers: ([^>]*?) -->/g)) {
      for (const name of m[1].split(',')) names.add(name.trim());
    }
  }
  covered.set(entry.name, names);
}

const known = new Set(useCases.map((u) => u.name));
const problems = [];
for (const [folder, names] of covered) {
  for (const name of names) if (!known.has(name)) problems.push(`${folder}: covers ${name}, which is not a use case`);
}
let checked = 0;
for (const useCase of useCases.filter((u) => u.availableSince)) {
  for (const actor of useCase.actors) {
    const places = folders.get(actor);
    if (!places) continue;
    checked += 1;
    if (!places.some((f) => covered.get(f)?.has(useCase.name))) {
      problems.push(`${useCase.name} (${useCase.title}) has no guide for ${actor} in ${places.join(' or ')}`);
    }
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  console.error(`check-coverage: ${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`check-coverage: every use case of Kampus ${version} is documented for its roles (${checked} use case and role pairs)`);
