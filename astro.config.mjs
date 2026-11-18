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
 * Site configuration of the Kampus documentation: Starlight with the look of Didactika's documentation,
 * one sidebar group per audience, English and Spanish.
 */
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

/** Version of Kampus this documentation describes; it follows the version of the platform (DEC-081). */
const KAMPUS_VERSION = '0.1.0';

/**
 * Builds a sidebar group of an audience from its folder.
 *
 * @param {string} label Label in English.
 * @param {string} es Label in Spanish.
 * @param {string} directory Folder under `src/content/docs`.
 * @returns {object} A Starlight sidebar group.
 */
const audience = (label, es, directory) => ({
  label,
  translations: { es },
  collapsed: true,
  items: [{ autogenerate: { directory } }],
});

export default defineConfig({
  site: 'http://localhost:8096',
  devToolbar: { enabled: false },
  vite: {
    server: { watch: { usePolling: process.env.KAMPUS_DOCS_POLL === '1', interval: 1000 } },
  },
  integrations: [
    starlight({
      title: { en: 'Kampus Docs', es: 'Kampus Docs' },
      description: `The documentation of Kampus ${KAMPUS_VERSION} for every role.`,
      logo: { src: './src/assets/kampus-docs-logo.svg', alt: 'Kampus Docs' },
      favicon: '/favicon.svg',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        es: { label: 'Español', lang: 'es' },
      },
      customCss: ['./src/styles/kampus-docs.css'],
      components: { SiteTitle: './src/components/SiteTitle.astro' },
      lastUpdated: false,
      pagination: true,
      sidebar: [
        audience('Learners', 'Estudiantes', 'learners'),
        audience('Teachers', 'Profesores', 'teachers'),
        audience('Administrators', 'Administradores', 'administrators'),
        audience('Operators', 'Operadores', 'operators'),
        audience('Integrators', 'Integradores', 'integrators'),
        audience('Plugin developers', 'Desarrolladores de plugins', 'plugin-developers'),
        audience('Platform developers', 'Desarrolladores de la plataforma', 'platform-developers'),
        audience('Releases', 'Versiones', 'releases'),
      ],
    }),
  ],
});
