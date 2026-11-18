// This file is part of Kampus - Knowledge Academic Modular Platform for Universal Study.
//
// Copyright (c) 2026 Didactika. All rights reserved.
// Proprietary and confidential: see the LICENSE file at the root of the repository.
// SPDX-License-Identifier: LicenseRef-Didactika-Proprietary
//
// @package   kampus-docs
// @author    hector-ae21
// @since     0.1.0

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
