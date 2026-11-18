---
title: Changelog
description: What changes in each version of Kampus, with the upgrade steps.
sidebar:
  order: 1
---

All notable changes to Kampus are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Versions, support branches and upgrades follow DEC-081 and DEC-082; the **Upgrade** group lists every action an operator must take.

## [Unreleased]

### Changed

- Kampus is free software under the GNU Affero General Public License, version 3 or later (DEC-085), instead of a proprietary licence.

### Upgrade

- New configuration variables: `KAMPUS_HTTP_ADDRESS`, `KAMPUS_CONFIG_FILE`, `KAMPUS_UPGRADE_ON_START`, `KAMPUS_LOG_FORMAT`. A new installation is created by `kampus-server upgrade`, or at start with `KAMPUS_UPGRADE_ON_START=true`.

### Added

- `kampus-common`: the error model with problem-details kinds, typed UUIDv7 identifiers, UTC instants with an injectable clock, cursor pagination and request identifiers.
- `kampus-db`: the installation prefix, ordered and checksummed upgrade steps per module, and the upgrade runner that brings any supported release to the current one in one run, serialised across replicas, refusing a database newer than the code or with changed steps.
- `kampus-server`: configuration from a file and `KAMPUS_*` variables validated per role, the commands `serve`, `upgrade` and `check`, liveness and readiness endpoints, request identifiers, problem details, JSON logs and graceful shutdown.
- Container image (`Dockerfile`) and a `server` service in Docker Compose at http://localhost:8100, plus a separate `kampus_test` database for the tests.
- The standard file header with the KAMPUS banner, the licence notice and the author in every file (DEC-083).
- Rust workspace (edition 2024, toolchain 1.100.0) with shared lints that require documentation on every item, and the first crate, `kampus-common`.
- Quality gates in CI: formatting, Clippy with warnings as errors, tests against PostgreSQL 17, `cargo deny` with the licence policy of DEC-085, `cargo audit`, and `tools/repo-check` for file headers, version and changelog, and the dependency rules of the crates.
- Local development with Docker Compose: PostgreSQL 17 and a Rust toolbox image with the same tools as CI.
- The specification of version 0.1.0: requirements, domain models, data models, API fragments, use cases, decisions DEC-001 to DEC-085 and highlights.
- The handbook for every role lives in the private repository `didactika/kampus-docs`, served locally at http://localhost:8096 (DEC-084).
