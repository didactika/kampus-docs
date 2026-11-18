---
title: Conventions
description: File headers, documentation comments, branches, commits and pull requests.
sidebar:
  order: 2
---

## The file header

Every source and configuration file outside the specification starts with the Kampus header, in the comment syntax of its type. In Rust:

```rust
// This file is part of Kampus - Knowledge Academic Modular Platform for Universal Study.
//
// Copyright (c) 2026 Didactika. All rights reserved.
// Proprietary and confidential: see the LICENSE file at the root of the repository.
// SPDX-License-Identifier: LicenseRef-Didactika-Proprietary
//
// @package   kampus-common
// @author    Your Name
// @since     0.1.0

//! What this module is for.
```

`@package` is the crate or component, `@author` who created the file and `@since` the version that added it. TOML, YAML, shell and Dockerfiles use `#`, CSS `/* */`, Svelte and HTML `<!-- -->`, SQL `--`. Files that cannot hold comments (JSON, lock files, images) are exempt. The repository check adds missing headers:

```bash
docker compose -f tools/docs-check/compose.yaml run --rm repo --fix --author "Your Name"
```

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
