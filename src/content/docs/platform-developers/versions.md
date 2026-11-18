---
title: Versions and changelog
description: The platform version, the changelog entry of every pull request, releases and support.
sidebar:
  order: 3
---

## One version for the platform

Kampus has one semantic version (`MAJOR.MINOR.PATCH`) for the server, the web client, this documentation and the container image. It lives in `[workspace.package]` of the root `Cargo.toml`; everything else reads it from there. On `release/X.Y.Z` it equals `X.Y.Z`, and CI checks it.

The interfaces others depend on have their own semantic versions: the HTTP API (`/api/v1`), the plugin SDK, every event type and the schema of every module (its upgrade steps).

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
