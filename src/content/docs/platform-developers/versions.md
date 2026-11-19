---
title: Versions and changelog
description: The platform version, the changelog entry of every pull request, releases and support.
sidebar:
  order: 3
---

## One version for the platform

Kampus has one semantic version (`MAJOR.MINOR.PATCH`) for the server, the web client, this documentation and the container image. It lives in `[workspace.package]` of the root `Cargo.toml`; everything else reads it from there. On `release/X.Y.Z` it equals `X.Y.Z`, and CI checks it.

The interfaces others depend on have their own semantic versions: the HTTP API (`/api/v1`), the plugin SDK, every event type and the schema of every module (its upgrade steps).

## The version file

`version.toml`, at the root of the repository, describes the release. The core reads it when it is built (`kampus_common::PLATFORM`), compares it with the release recorded in the installation, and registers the platform as the component `kampus`; the repository check keeps it equal to the workspace version.

| Key | Meaning |
| --- | --- |
| `name` | The product, `Kampus` |
| `version` | The release, semantic; equal to `[workspace.package] version` of `Cargo.toml` and to the branch `release/X.Y.Z` |
| `maturity` | `alpha`, `beta`, `rc` or `stable` |
| `date` | The date of the release, or of the start of its development, `YYYY-MM-DD` |
| `upgrade_from` | The oldest release an installation can be upgraded from in one run; columns may be dropped only when it no longer reads them |

An installation newer than the build is refused; one older than `upgrade_from` is told to upgrade to that release first.

## The changelog

`CHANGELOG.md` follows Keep a Changelog. Every pull request that changes anything outside the specification adds its entry under `## [Unreleased]`, in one of these groups:

| Group | For |
| --- | --- |
| Added | New features |
| Changed | Changes in existing behaviour |
| Deprecated | What will be removed in a later major version |
| Removed | What is gone |
| Fixed | Bug fixes |
| Security | Vulnerabilities fixed |
| Upgrade | Every action an operator must take to upgrade |

CI refuses a pull request without its entry.

## Upgrade steps

Database migrations are forward-only, one transaction per step, and never edited once released. A release only adds to the schema; a later release removes what no supported release reads. Anything removed from an interface is deprecated first. That is what lets any supported release upgrade to the latest in one run: see [upgrades](/operators/upgrades/).

## Releasing

1. Move the `Unreleased` entries into `## [X.Y.Z] - YYYY-MM-DD`.
2. Merge `release/X.Y.Z` into `main` and tag `vX.Y.Z`.
3. Cut `support/X.Y` for its patch releases and open `release/<next version>`.
