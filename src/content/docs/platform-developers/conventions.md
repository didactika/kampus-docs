---
title: Conventions
description: File headers, documentation comments, branches, commits and pull requests.
sidebar:
  order: 2
---

## The file header

Every source and configuration file outside the specification starts with the same Kampus header, in the comment syntax of its type: the KAMPUS banner, the notice of the GNU Affero General Public License, and the fields `@package` (the crate or component), `@copyright`, `@author` (name and address of who created the file), `@license` and `@since` (the version that added it). In Rust:

```rust
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
// @package   kampus-courses
// @copyright 2026 Didactika
// @author    Hector Arrechea <hectorlazaroarrechea@gmail.com>
// @license   https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0-or-later
// @since     0.1.0
//
// SPDX-License-Identifier: AGPL-3.0-or-later
// ------------------------------------------------------------------------------

//! What this module is for.
```

TOML, YAML, shell and Dockerfiles use `#`, CSS `/* */`, Svelte and HTML `<!-- -->`, SQL `--`, and Astro components put it inside their front matter. Files that cannot hold comments (JSON, lock files, images) are exempt. The repository check adds missing headers and rewrites outdated ones, keeping their `@since`:

```bash
docker compose -f tools/docs-check/compose.yaml run --rm repo --fix --author "Your Name <you@example.org>"
```

## Licence

Kampus is free software under the **GNU Affero General Public License, version 3 or later** (`AGPL-3.0-or-later`). Whoever distributes Kampus or a part of it, or offers it to users over a network, must give them the complete source under the same licence. Dependencies must be compatible: permissive licences, MPL-2.0, LGPL, GPL-3.0 and AGPL-3.0; `cargo deny` refuses the rest.

## Documentation comments

Every item has a documentation comment above it, public or private: `//!` for a module and `///` for an item in Rust, TSDoc in TypeScript and Svelte. Say what the item is for and what a caller must know, not how it works. Comments inside bodies are only for what the code cannot say. Clippy fails on undocumented items (`missing_docs`, `missing_docs_in_private_items`).

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | Released versions only, tagged `vX.Y.Z` |
| `release/X.Y.Z` | Integration of the next version |
| `support/X.Y` | Patch releases of a supported minor version |
| `feat/<module>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>` | Work, cut from the release branch and merged back through a pull request |

## Commits and pull requests

Conventional Commits in English (`<type>(<scope>): <summary>`), with the reason in the body. One pull request per issue, with `Closes #n`, merged when every gate is green, and with its changelog entry.
