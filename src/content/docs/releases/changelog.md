---
title: Changelog
description: What changes in each version of Kampus, with the upgrade steps.
sidebar:
  order: 1
---

All notable changes to Kampus are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Versions, support branches and upgrades follow DEC-081 and DEC-082; the **Upgrade** group lists every action an operator must take.

## [Unreleased]

### Added

- Rust workspace (edition 2024, toolchain 1.100.0) with shared lints that require documentation on every item, and the first crate, `kampus-common`.
- Quality gates in CI: formatting, Clippy with warnings as errors, tests against PostgreSQL 17, `cargo deny` with the licence policy of DEC-010, `cargo audit`, and `tools/repo-check` for file headers, version and changelog, and the dependency rules of the crates.
- Local development with Docker Compose: PostgreSQL 17 and a Rust toolbox image with the same tools as CI.
- The specification of version 0.1.0: requirements, domain models, data models, API fragments, use cases, decisions DEC-001 to DEC-083 and highlights.
