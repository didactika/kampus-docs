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
5. Infrastructure adapters (`kampus-db-postgres`, `kampus-storage-s3`, …) live in their own crates; modules depend only on the ports, and only `kampus-server` wires adapters in.

## Data

Every module owns one PostgreSQL schema, named after it and prefixed per installation (`kmp_` by default): `courses.group` is `kmp_courses.group`. The database enforces integrity with real foreign keys, typed columns and natural keys.
