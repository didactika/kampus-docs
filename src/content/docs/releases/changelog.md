---
title: Changelog
description: What changes in each version of Kampus, with the upgrade steps.
sidebar:
  order: 1
---

All notable changes to Kampus are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Versions, support branches and upgrades follow DEC-081 and DEC-082; the **Upgrade** group lists every action an operator must take.

## [Unreleased]

### Changed

- Crate folders drop the project prefix (`crates/common`, `crates/db`, `crates/server`…), and adapters become sub-plugins of their port in `crates/<port>/adapters/<name>`, registered by URL scheme in a registry `tools/repo-check --fix` writes; external adapters are declared in `crates/server/adapters.toml` (DEC-086).
- The server opens the file storage and the cache from its configuration, through the adapters of the build, and its readiness checks both.
- Kampus is free software under the GNU Affero General Public License, version 3 or later (DEC-085), instead of a proprietary licence.

### Upgrade

- `KAMPUS_STORAGE_URL` is now required for the `server`, `worker` and `all` roles (`file:///path` or `s3://bucket/prefix` with `KAMPUS_STORAGE_S3_ENDPOINT`, `_REGION`, `_ACCESS_KEY_ID`, `_SECRET_ACCESS_KEY`); `KAMPUS_CACHE_URL` turns on the shared cache.
- New configuration variables: `KAMPUS_HTTP_ADDRESS`, `KAMPUS_CONFIG_FILE`, `KAMPUS_UPGRADE_ON_START`, `KAMPUS_LOG_FORMAT`. A new installation is created by `kampus-server upgrade`, or at start with `KAMPUS_UPGRADE_ON_START=true`.

### Added

- `kampus-identity` (`crates/identity`): accounts of a campus, unique by username and email without regard to case, each the principal of access with its own user scope; sign-up with an email link that never reveals whether an account exists; invitations; the account lifecycle with its history, `If-Match` and one permission per transition; deletion after a grace period that leaves a tombstone; Argon2id passwords checked against the campus policy; hashed, expiring one-time tokens; one sign-in pipeline with throttling per account, per name and per address; server-side sessions revoked at once on suspension or password change, with step-up for sensitive operations; scoped, expiring API tokens; and service accounts that use only tokens. One test per business rule (RN-022 to RN-027, RN-031 to RN-035, RN-039).
- The `unauthenticated` error kind (HTTP 401), for missing or wrong credentials and expired sessions.
- `kampus-access` (`crates/access`): the scope tree with nested sections and its closure table, principals, roles made from versioned templates with their allowances, manual and module-owned grants, overrides, permission checks that explain themselves, "view as", the history of every change, and the default roles of a campus; one test per business rule (RN-001 to RN-021). The server synchronises the declared permissions and templates at start-up.
- The neutral schema of `kampus-db`: modules declare tables, portable types, keys, foreign keys, checks and indexes, and the port writes quoted, prefixed PostgreSQL and indexes every foreign key; upgrade steps are lists of these changes, and SQL outside it needs a reason.
- The schema linter (`kampus_db::lint`), run on every build over every module, and the conformance suite of the database port: every type, reference behaviour, check, error class and `SKIP LOCKED`.
- `kampus_db::classify`, which maps database failures to the error model, and the capabilities of the database port.
- `kampus-storage`: the file storage port (keys, hash-verified writes, ranges, copies, presigned reads as a capability) with its conformance suite, and `kampus-storage-opendal`, which stores on the local disk or in any S3-compatible bucket.
- `kampus-cache`: the cache port (entries with a time to live, counters with a window, locks with a lease) with its conformance suite and the two-level `Layered` cache, and its adapters `kampus-cache-moka` (in-process) and `kampus-cache-redis` (Redis or Valkey).
- Docker Compose: an S3-compatible store (SeaweedFS, localhost:58333, buckets `kampus` and `kampus-test`) and Valkey (localhost:56379); CI runs the conformance suites against both.
- `kampus-common`: the error model with problem-details kinds, typed UUIDv7 identifiers, UTC instants with an injectable clock, cursor pagination and request identifiers.
- `kampus-db`: the installation prefix, ordered and checksummed upgrade steps per module, and the upgrade runner that brings any supported release to the current one in one run, serialised across replicas, refusing a database newer than the code or with changed steps.
- `kampus-server`: configuration from a file and `KAMPUS_*` variables validated per role, the commands `serve`, `upgrade` and `check`, liveness and readiness endpoints, request identifiers, problem details, JSON logs and graceful shutdown.
- Container image (`Dockerfile`) and a `server` service in Docker Compose at http://localhost:8100, plus a separate `kampus_test` database for the tests.
- The standard file header with the KAMPUS banner, the licence notice and the author in every file (DEC-083).
- Rust workspace (edition 2024, toolchain 1.100.0) with shared lints that require documentation on every item, and the first crate, `kampus-common`.
- Quality gates in CI: formatting, Clippy with warnings as errors, tests against PostgreSQL 17, `cargo deny` with the licence policy of DEC-085, `cargo audit`, and `tools/repo-check` for file headers, version and changelog, and the dependency rules of the crates.
- Local development with Docker Compose: PostgreSQL 17 and a Rust toolbox image with the same tools as CI.
- The specification of version 0.1.0: requirements, domain models, data models, API fragments, use cases, decisions DEC-001 to DEC-086 and highlights.
- The handbook for every role lives in the private repository `didactika/kampus-docs`, served locally at http://localhost:8096 (DEC-084).
