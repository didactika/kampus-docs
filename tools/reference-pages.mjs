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
 * Writes the reference pages of the handbook from `docs/03-design/reference.json` of the Kampus repository, the
 * snapshot of what every module of the build declares. A server test keeps that snapshot equal to the build, so
 * these pages never drift from the code.
 */
import fs from 'node:fs';
import path from 'node:path';

/**
 * Escapes a value for a Markdown table cell.
 *
 * @param {unknown} value Any value.
 * @returns {string} The text of the cell.
 */
const cell = (value) => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');

/**
 * Formats a list as inline code, or a dash when it is empty.
 *
 * @param {readonly string[]} items Items.
 * @returns {string} The cell.
 */
const codes = (items) => (items.length === 0 ? '—' : items.map((i) => `\`${i}\``).join(', '));

/**
 * Builds a Markdown table.
 *
 * @param {readonly string[]} head Column names.
 * @param {readonly (readonly string[])[]} rows Cells.
 * @returns {string} The table.
 */
const table = (head, rows) =>
  [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');

/**
 * Describes what a setting accepts.
 *
 * @param {{type: string, default: unknown, options?: string[], min?: number, max?: number}} accepts The kind.
 * @returns {string} A short description.
 */
const accepted = (accepts) => {
  switch (accepts.type) {
    case 'boolean':
      return `yes or no (default \`${accepts.default}\`)`;
    case 'choice':
      return `one of ${codes(accepts.options ?? [])} (default \`${accepts.default}\`)`;
    case 'integer':
      return `a whole number from ${accepts.min} to ${accepts.max} (default \`${accepts.default}\`)`;
    default:
      return `text up to ${accepts.max} characters${accepts.default ? ` (default \`${accepts.default}\`)` : ''}`;
  }
};

/**
 * One page of the reference: a section per module that declares something of its kind.
 *
 * @param {object} page The page.
 * @param {string} page.title Title.
 * @param {string} page.description Description.
 * @param {number} page.order Place in the sidebar.
 * @param {string} page.lead The paragraph under the title.
 * @param {readonly object[]} modules The modules of the reference.
 * @param {(module: object) => string | null} section The body of a module, or null when it declares nothing.
 * @param {string} version The version of Kampus.
 * @returns {string} The Markdown of the page.
 */
const page = ({ title, description, order, lead }, modules, section, version) => {
  const parts = modules.map((m) => [m, section(m)]).filter(([, body]) => body);
  return `---\ntitle: ${title}\ndescription: ${description}\nsidebar:\n  order: ${order}\n---\n\n<!-- Generated from the declarations of Kampus ${version}; do not edit. -->\n\n${lead}\n\n${parts
    .map(([m, body]) => `## \`${m.name}\`\n\n${m.summary}.\n\n${body}`)
    .join('\n\n')}\n`;
};

/**
 * Writes the reference pages when the snapshot exists.
 *
 * @param {string} repo The Kampus repository.
 * @param {(file: string, text: string) => void} write Writes a file only when it changes.
 * @returns {number} How many modules the reference has, or 0 without a snapshot.
 */
export function writeReference(repo, write) {
  const source = path.join(repo, 'docs/03-design/reference.json');
  if (!fs.existsSync(source)) return 0;
  const { version, modules } = JSON.parse(fs.readFileSync(source, 'utf8'));
  const dir = path.resolve('src/content/docs/reference');
  fs.mkdirSync(dir, { recursive: true });
  const pages = {
    'permissions.md': page(
      {
        title: 'Permissions',
        description: 'Every permission of Kampus, its kind, its risks, the lowest scope it applies to and the roles that grant it.',
        order: 1,
        lead: 'A permission is allowed, denied or forbidden in a scope by the roles a person holds there (see [roles and permissions](/administrators/roles-and-permissions/)). **Granted by** lists the role templates that allow it out of the box; a campus can change them.',
      },
      modules,
      (m) =>
        m.permissions.length === 0
          ? null
          : table(
              ['Permission', 'Kind', 'Risks', 'Lowest scope', 'Granted by'],
              m.permissions.map((p) => [`\`${p.code}\``, p.kind, codes(p.risks), p.lowest_scope, codes(p.granted_by)]),
            ),
      version,
    ),
    'settings.md': page(
      {
        title: 'Settings',
        description: 'Every setting of Kampus, what it accepts, where it can be set and who may change it.',
        order: 2,
        lead: 'A setting is resolved through the scopes, from the platform down to the place where it is read; a lower scope overrides a higher one unless the higher one locks it. **Levels** are the scopes where it can be set.',
      },
      modules,
      (m) =>
        m.settings.length === 0
          ? null
          : table(
              ['Setting', 'What it does', 'Accepts', 'Levels', 'Permission', 'Restart'],
              m.settings.map((s) => [`\`${s.key}\``, s.summary, accepted(s.accepts), codes(s.levels), `\`${s.permission}\``, s.restart_required ? 'yes' : 'no']),
            ),
      version,
    ),
    'features-and-terms.md': page(
      {
        title: 'Features and terms',
        description: 'The features a scope turns on or off, and the terms a campus can rename.',
        order: 3,
        lead: 'Features are turned on or off per scope, and locked for the scopes below. Terms are the names of things a campus can change, in each language.',
      },
      modules,
      (m) => {
        const parts = [];
        if (m.flags.length > 0) parts.push(`### Features\n\n${table(['Feature', 'What it does', 'On by default'], m.flags.map((f) => [`\`${f.code}\``, f.summary, f.default ? 'yes' : 'no']))}`);
        if (m.terms.length > 0)
          parts.push(
            `### Terms\n\n${table(
              ['Term', 'Language', 'Singular', 'Plural'],
              m.terms.flatMap((term) => term.forms.map((f) => [`\`${term.code}\``, f.language, f.singular, f.plural])),
            )}`,
          );
        return parts.length === 0 ? null : parts.join('\n\n');
      },
      version,
    ),
    'events.md': page(
      {
        title: 'Events',
        description: 'Every event Kampus publishes, its version, its fields and whether it is audited.',
        order: 4,
        lead: 'Modules publish events after their changes commit; listeners in other modules and plugins react to them. **Personal fields** are removed when the person is forgotten; **audited** events are kept in the audit log.',
      },
      modules,
      (m) =>
        m.events.length === 0
          ? null
          : table(
              ['Event', 'Version', 'What happened', 'Fields', 'Personal fields', 'Audited'],
              m.events.map((e) => [`\`${e.code}\``, e.version, e.summary, codes(e.fields), codes(e.personal_fields), e.audited ? 'yes' : 'no']),
            ),
      version,
    ),
    'notifications.md': page(
      {
        title: 'Notifications',
        description: 'Every type of notification, the channels it can use and whether people can turn it off.',
        order: 5,
        lead: 'People choose the channels of each type in their notification preferences; a **required** type cannot be turned off.',
      },
      modules,
      (m) =>
        m.notification_types.length === 0
          ? null
          : table(
              ['Type', 'What it tells', 'Channels', 'Required'],
              m.notification_types.map((n) => [`\`${n.code}\``, n.summary, codes(n.channels), n.required ? 'yes' : 'no']),
            ),
      version,
    ),
    'jobs.md': page(
      {
        title: 'Jobs',
        description: 'Every background job of Kampus, its attempts and its schedule.',
        order: 6,
        lead: 'Jobs run in the `worker` role; scheduled ones are fired by the `scheduler` role (see [operators](/operators/#background-jobs)). Schedules can be changed with `kampus-server tasks schedule`.',
      },
      modules,
      (m) =>
        m.jobs.length === 0
          ? null
          : table(
              ['Job', 'What it does', 'Attempts', 'Schedule'],
              m.jobs.map((j) => [`\`${j.code}\``, j.summary, j.max_attempts, j.schedule ? `\`${j.schedule.cron}\` ${j.schedule.time_zone}` : 'on demand']),
            ),
      version,
    ),
  };
  for (const [file, text] of Object.entries(pages)) write(path.join(dir, file), text);
  return modules.length;
}
