---
title: Getting started
description: The development environment of Kampus, in Docker only.
sidebar:
  order: 1
---

Nothing but **Git** and **Docker** is needed on your machine. The repository's `compose.yaml` provides PostgreSQL 17 and a toolbox image with the pinned Rust toolchain (`rust-toolchain.toml`, 1.100.0), `cargo deny` and `cargo audit`: the same tools as CI.

```bash
git clone git@github.com:didactika/kampus.git
cd kampus
git switch release/0.1.0
docker compose up -d postgres        # PostgreSQL 17 on localhost:55432 (kampus / kampus)
```

## Quality gates

Every pull request runs these checks in CI; run them locally before pushing:

```bash
docker compose run --rm rust cargo fmt --all
docker compose run --rm rust cargo clippy --workspace --all-targets --locked -- -D warnings
docker compose run --rm rust cargo test --workspace --locked
docker compose run --rm rust cargo deny --all-features check
docker compose run --rm rust cargo audit
docker compose -f tools/docs-check/compose.yaml run --rm repo
docker compose -f tools/docs-check/compose.yaml run --rm check
docker compose -f tools/docs-check/compose.yaml run --rm openapi
```

| Gate | What fails it |
| --- | --- |
| Formatting | Code not formatted by `rustfmt` |
| Clippy | Any warning, including an item without a documentation comment |
| Tests | Any failing test; tests run against PostgreSQL 17 |
| Licences and advisories | A dependency outside the licence allow-list (MIT, Apache-2.0, BSD, ISC, Zlib, MPL-2.0, Unicode-3.0, CDLA-Permissive-2.0), a known vulnerability, a yanked crate or an unknown source |
| Repository | A file without its header, a version that does not match the release branch, a malformed changelog, a pull request without its changelog entry, or a crate that breaks the dependency rules |
| Documentation | Broken links, diagrams that do not render, a foreign key to a later module, an invalid OpenAPI fragment |

Tests read the database from `KAMPUS_TEST_DATABASE_URL`, which the toolbox sets for you.
