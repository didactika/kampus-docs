---
title: Database schema
description: How a module declares its tables, upgrades them and handles database errors.
sidebar:
  order: 5
---

A module never writes SQL for its tables. It declares them once in the **neutral schema** of `kampus_db::schema`, and the database port writes the SQL of each dialect, quotes every name and puts the installation prefix on the schema (`courses.group` becomes `"kmp_courses"."group"`).

## Declaring the steps of a module

Each module exposes its `ModuleSteps`: ordered steps, each a list of changes applied in one transaction. A released step is never edited; new needs are new steps.

```rust
use kampus_db::schema::{Change, Check, Column, ColumnDefault, ForeignKey, OnDelete, Table, Type};
use kampus_db::{ModuleSteps, Step};

pub const STEPS: ModuleSteps = ModuleSteps {
    module: "courses",
    steps: &[Step {
        sequence: 1,
        name: "groups",
        changes: &[Change::CreateTable(Table {
            name: "group",
            columns: &[
                Column::new("id", Type::Uuid),
                Column::new("course_id", Type::Uuid),
                Column::new("name", Type::Varchar(120)),
                Column::new("state", Type::Text).default(ColumnDefault::Text("active")),
                Column::new("created_at", Type::Timestamptz).default(ColumnDefault::Now),
            ],
            primary_key: &["id"],
            unique: &[&["course_id", "name"]],
            foreign_keys: &[ForeignKey {
                columns: &["course_id"], module: None, table: "course", references: &["id"], on_delete: OnDelete::Cascade,
            }],
            checks: &[Check::OneOf("state", &["active", "archived"])],
            ..Table::EMPTY
        })],
    }],
};
```

| Element | What you can say |
| --- | --- |
| Types | `Uuid`, `Text`, `Varchar(n)`, `Integer`, `BigInt`, `Numeric(p, s)`, `Boolean`, `Date`, `Timestamptz`, `Interval`, `Bytes`, `Json("schema name")`, `TextArray` |
| Columns | required by default; `.nullable()` only when absence means something; `.default(…)` with `Now`, a boolean, an integer or a text |
| Keys | the primary key, the natural keys (`unique`), and secondary indexes from the queries of the use cases |
| Foreign keys | to a table of the same module (`module: None`) or of an earlier one, with `Restrict`, `Cascade` or `SetNull`; the port indexes them |
| Checks | `OneOf` (enumerations), `After` (an end after its start), `Positive`, `NonNegative`, `ExactlyOne` (exclusive arcs) |
| Later steps | `AddColumn` (a required column needs a default), `AddForeignKey`, `AddCheck`, `AddIndex`, and `DropColumn` once no supported release reads the column |
| Escape hatch | `Change::Postgres { sql, reason }`, only for what the neutral schema cannot express, always with its reason |

## The linter

`kampus_db::lint` replays every module's steps and fails the build when a convention breaks: references without foreign keys, tables without a natural key or a reason, instants that are not `Timestamptz`, flags that are not `Boolean`, JSON without a schema, references to later modules, names that are not lower-case snake case, unsafe drops, required columns added without a default, and SQL without a reason.

## Upgrades

The upgrade runner applies every pending step of every module in one run, from any supported release, and creates a module's schema with its first step. See [upgrades](/operators/upgrades/) for what operators see.

## Errors

`kampus_db::classify` turns database failures into the error model:

| Failure | Error |
| --- | --- |
| A natural key is repeated | `conflict`, `db.unique_violation`, with the constraint |
| A reference is missing, or still used when deleting | `conflict`, `db.foreign_key_violation` |
| A check fails | `validation`, `db.check_violation`, naming the constraint |
| A required value is missing | `validation`, `db.not_null_violation`, naming the column |
| A serialisation failure or a deadlock | `unavailable`, `db.retry`: retry the operation |

## Capabilities

`Database::capabilities()` says what the adapter offers: rows that skip locked ones (job queues), upserts, advisory locks and schemas. Code that needs one asks for it, never for the dialect.
