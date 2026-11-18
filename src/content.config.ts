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
 * Content collections of the site: the Starlight documentation pages.
 */
import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/** The documentation pages, in `src/content/docs`. */
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
