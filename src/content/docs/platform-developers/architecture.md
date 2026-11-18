---
title: Architecture
description: The modules of Kampus, their levels and the rules the build enforces.
sidebar:
  order: 4
---

## Modules

One crate per module, in a strict order: a module depends only on modules **before it** in this list, and hears about the ones after it through events.

| Level | Crates |
| --- | --- |
| 0 Foundation | `kampus-common`, `kampus-db`, `kampus-storage`, `kampus-cache`, `kampus-events`, `kampus-tasks` |
| 1 Platform | `kampus-access`, `kampus-settings`, `kampus-identity`, `kampus-i18n` |
| 2 People | `kampus-files`, `kampus-customise`, `kampus-users` |
| 3 Learning | `kampus-courses` |
| 4 Learning | `kampus-enrol`, `kampus-activities` |
| 5 Learning | `kampus-records`, `kampus-progress` |
| 6 Services | `kampus-notify`, `kampus-calendar`, `kampus-privacy` |
| 7 Edge | `kampus-api`, `kampus-plugin-host` |
| Binary | `kampus-server` |

## Rules the build enforces

1. A crate depends only on crates listed before it; Cargo forbids cycles and the repository check enforces the order.
2. A module never reads or writes another module's tables. A foreign key points only to its own module or to an earlier one; the documentation check enforces it on the data models.
3. Upward communication is by events, written to an outbox in the same transaction and dispatched after commit.
4. Contributions (permissions, settings, events, jobs, privacy handlers, routes, UI modules, help topics) are declared by each module and collected at start-up.
5. Infrastructure adapters are sub-plugins of their port (`crates/cache/adapters/redis`, …); modules depend only on the ports, and only `kampus-server` registers adapters.

## Data

Every module owns one PostgreSQL schema, named after it and prefixed per installation (`kmp_` by default): `courses.group` is `kmp_courses.group`. The database enforces integrity with real foreign keys, typed columns and natural keys.

## Infrastructure ports

Every piece of infrastructure is a port, a Rust trait in a foundation crate, with adapters in their own crates. Modules depend only on the port; only `kampus-server` chooses an adapter, from the configuration.

| Port | Crate | Adapters today |
| --- | --- | --- |
| Database | `kampus-db` | PostgreSQL |
| File storage | `kampus-storage` (`crates/storage`) | `adapters/opendal`: local disk (`file://`) and any S3-compatible bucket (`s3://`) |
| Cache | `kampus-cache` (`crates/cache`) | `adapters/moka` (`memory://`, in-process), `adapters/redis` (`redis://`, `valkey://`), and `Layered` to put the first in front of the second |

Each port has a **conformance suite** (the `conformance` feature of the port crate). An adapter is supported only when it passes it against a real backend, in CI and locally:

```bash
docker compose up -d postgres s3 s3-buckets valkey
docker compose run --rm rust cargo test --workspace --all-features --locked
```

## Adding an adapter

Adapters are sub-plugins of their port, like stores inside a cache subsystem:

1. Create `crates/<port>/adapters/<name>` with a crate named `kampus-<port>-<name>` that implements the port's trait.
2. Expose `ADAPTER`: its name, the URL schemes it serves and how it opens from its settings.
3. Add a test that runs the port's `conformance::run` against the backend, started by Compose and by the CI job.
4. Run `docker compose -f tools/docs-check/compose.yaml run --rm repo --fix --author "Your Name <you@example.org>"`: it registers the adapter in `kampus-server`. CI fails while an adapter folder is not registered.

The configuration then chooses it by URL alone: `KAMPUS_CACHE_URL=memcached://…` opens the adapter that serves `memcached`.

An adapter published outside the repository is declared in `crates/server/adapters.toml` with its source, and registered the same way:

```toml
[[adapter]]
port = "cache"
crate = "kampus-cache-memcached"
source = 'git = "https://example.org/kampus-cache-memcached.git", tag = "v1.0.0"'
```

Code that needs an optional feature asks the port for its capabilities (for example `presign_read` of the storage port), never for the adapter's name.

## Folders

Folders are named after what they hold, without the project prefix: `crates/common`, `crates/db`, `crates/cache`, `crates/server`… The package names keep it (`kampus-cache`), so imports stay unambiguous.
