---
title: Your first module
description: Build a module end to end, from the crate to a tested HTTP route, the way every core module is built.
sidebar:
  order: 2
---

Available since 0.1.0.

This tutorial builds `bookmarks`, a small module where people keep links in their account. It goes through every piece a module has, in the order you write them, and ends with the checks that must pass before a pull request. Every core module, and every external one, is built the same way; the [module layout](../module-layout/) is the reference for each piece.

## 1. The crate

A module is a crate in `crates/<name>`, with the package `kampus-<name>`:

```text
crates/bookmarks/
  Cargo.toml
  version.toml
  assets/icon.svg
  src/
    lib.rs
    module.rs
    db/mod.rs, db/steps.rs
    permissions/mod.rs, permissions/templates.rs
    service/mod.rs, service/bookmark.rs
    http/mod.rs
  tests/
    unit/main.rs
    integration/main.rs, integration/rules.rs
```

`Cargo.toml` says it is a module, so the repository check and the server registry find it:

```toml
[package]
name = "kampus-bookmarks"
description = "Links people keep in their account"
version.workspace = true
edition.workspace = true
rust-version.workspace = true
license.workspace = true
repository.workspace = true
publish.workspace = true

[package.metadata.kampus]
kind = "module"

[dependencies]
kampus-common.workspace = true
kampus-db.workspace = true
kampus-module.workspace = true
kampus-access.workspace = true
kampus-identity = { path = "../identity" }
axum.workspace = true
serde.workspace = true
sqlx.workspace = true

[lints]
workspace = true
```

A module depends only on modules before it in the module table of the architecture; add a row for `kampus-bookmarks` after the modules it uses. That row also sets the order in which the server installs modules.

## 2. The version file

`version.toml` holds every version fact of the component, in the same form as the platform's:

```toml
[component]
version = "0.1.0"
maturity = "alpha"
kampus = ">=0.1.0, <0.2.0"

[requires]
identity = ">=0.1.0, <0.2.0"
```

`assets/icon.svg` is read on its own; without it the build only warns. See [versions](../module-layout/#the-version-file) for every key.

## 3. The schema

`src/db/steps.rs` declares the upgrade steps in the neutral schema. The server creates the module's own PostgreSQL schema and applies the steps in order; a released step is never edited, and a change is a new step.

```rust
use kampus_db::Step;
use kampus_db::schema::{Change, Column, ColumnDefault, ForeignKey, OnDelete, Table, Type};

pub const STEPS: &[Step] = &[Step {
    sequence: 1,
    name: "bookmarks",
    revert: &[],
    action: None,
    changes: &[Change::CreateTable(Table {
        name: "bookmark",
        columns: &[
            Column::new("id", Type::Uuid),
            Column::new("account_id", Type::Uuid),
            Column::new("url", Type::Text),
            Column::new("title", Type::Text),
            Column::new("created_at", Type::Timestamptz).default(ColumnDefault::Now),
        ],
        primary_key: &["id"],
        unique: &[&["account_id", "url"]],
        foreign_keys: &[ForeignKey {
            columns: &["account_id"],
            module: Some("identity"),
            table: "account",
            references: &["id"],
            on_delete: OnDelete::Cascade,
        }],
        ..Table::EMPTY
    })],
}];
```

`revert` holds the changes that undo the step, so an installation can go back a version; `action` runs code with the step, for data the schema alone cannot move. Both are described in [install actions](../module-layout/#install-actions-and-data-migrations) and [going back](../module-layout/#going-back). The linter refuses a table without a natural key unless it says why.

## 4. Permissions

`src/permissions/mod.rs` declares what the module lets people do, and `templates.rs` what the default roles get:

```rust
use kampus_access::{PermissionDeclaration, PermissionKind, ScopeKind};

pub mod templates;
pub use templates::TEMPLATES;

/// Keep one's own bookmarks.
pub const MANAGE_OWN: &str = "bookmarks.bookmark.manage_own";

pub const PERMISSIONS: &[PermissionDeclaration] = &[PermissionDeclaration {
    code: MANAGE_OWN,
    kind: PermissionKind::Write,
    risks: &[],
    lowest_kind: ScopeKind::Campus,
}];
```

```rust
use kampus_access::{RoleTemplateDeclaration, Value};

use super::MANAGE_OWN;

pub const TEMPLATES: &[RoleTemplateDeclaration] = &[RoleTemplateDeclaration {
    code: "authenticated_user",
    version: 1,
    values: &[(MANAGE_OWN, Value::Allow)],
}];
```

The server synchronises permissions and templates at every start: a permission no module declares any more is retired.

## 5. The service

The service is the module's API: other modules and the routes call it, never its tables. It checks permissions itself, so no caller can skip them.

```rust
impl Bookmarks {
    /// Keeps a link for the actor's account.
    pub async fn add(&self, actor: &Actor, campus: ScopeId, url: &str, title: &str) -> Result<BookmarkId> {
        self.access.require(actor, MANAGE_OWN, campus).await?;
        let Actor::Principal(account) = actor else {
            return Err(Error::unauthenticated("bookmarks.sign_in_required"));
        };
        let id = BookmarkId::generate();
        sqlx::query(sql(format!(
            "insert into {} (id, account_id, url, title) values ($1, $2, $3, $4)",
            self.table("bookmark")
        )))
        .bind(id.as_uuid())
        .bind(account.as_uuid())
        .bind(url)
        .bind(title)
        .execute(self.db.pool())
        .await
        .map_err(kampus_db::classify)?;
        Ok(id)
    }
}
```

Errors are `kampus_common::Error` with a stable code (`bookmarks.<what>`); `kampus_db::classify` turns a unique violation into a `conflict`. Only quoted, prefixed table names are interpolated into SQL, and every value is bound.

## 6. Routes

`src/http/mod.rs` builds the module's router from the services the server composed:

```rust
pub fn routes(context: &ServiceContext) -> Router {
    let shared = Shared { bookmarks: context.service::<Bookmarks>().ok() };
    Router::new()
        .route("/me/bookmarks", post(add))
        .with_state(shared)
}

async fn add(
    State(shared): State<Shared>,
    Extension(caller): Extension<Caller>,
    Body(body): Body<NewBookmark>,
) -> ApiResult<Response> {
    let id = shared
        .bookmarks()?
        .add(&caller.actor, caller.campus, &body.url, &body.title)
        .await?;
    Ok((StatusCode::CREATED, Json(json!({ "id": id }))).into_response())
}
```

The server serves it under the name of the module, as `POST /api/v1/bookmarks/me/bookmarks`, after finding the campus and authenticating the caller; see [routes](../module-layout/#routes) for what `Caller`, `Body`, `if_match` and `with_etag` do.

## 7. The descriptor

`src/module.rs` puts it all together; the server reads nothing else:

```rust
pub const NAME: &str = "bookmarks";

pub const MODULE: Module = Module {
    name: NAME,
    manifest: kampus_common::manifest!(),
    summary: "Links people keep in their account",
    steps: crate::db::STEPS,
    permissions: crate::permissions::PERMISSIONS,
    templates: crate::permissions::TEMPLATES,
    plugin_types: &[],
    commands: &[],
    preferences: &[],
    settings: &[],
    terms: &[],
    flags: &[],
    field_kinds: &[],
    page_kinds: &[],
    widgets: &[],
    menu_kinds: &[],
    rule_actions: &[],
    file_areas: &[],
    activity_types: &[],
    events: &[],
    listeners: &[],
    jobs: &[],
    schedules: &[],
    routes: Some(crate::http::routes),
};
```

## 8. Register it

```sh
docker compose -f tools/docs-check/compose.yaml run --rm repo --fix --author "Your Name <you@example.org>" --files new-files.txt
```

The repository check, with `--fix`, writes the module into the server's registry and its dependencies, and the header into every new file listed. Then build the service in `crates/server/src/wiring/services.rs` and add it to the `ServiceContext`, next to the others:

```rust
let bookmarks = Bookmarks::new(parts.db.clone(), access.clone());
let context = ServiceContext::default()
    // ...
    .with(bookmarks);
```

An external module is declared in `crates/server/modules.toml` instead, with its source; see [adding a module](../module-layout/#adding-a-module).

## 9. Tests

Tests live in `tests/`, never in `src/`: `unit/` for pure checks and `integration/` against PostgreSQL and the services of Docker Compose, each a test binary with one file per topic. An integration test installs a fresh schema prefix of its own, so tests never see each other's data:

```rust
#[tokio::test]
async fn a_person_keeps_a_link_once() {
    let w = world().await;
    let ana = w.person("ana@example.org").await;
    w.bookmarks.add(&ana, w.campus, "https://example.org", "Example").await.unwrap();
    let again = w.bookmarks.add(&ana, w.campus, "https://example.org", "Example").await;
    assert_eq!(again.unwrap_err().kind(), ErrorKind::Conflict);
}
```

Routes are tested through the server, in `crates/server/tests/integration/`, as a client sees them: the test installs a site, builds its router and sends requests to it.

## 10. The checks

Everything runs in Docker:

```sh
docker compose run --rm rust cargo fmt --all --check
docker compose run --rm rust cargo clippy --workspace --all-targets -- -D warnings
docker compose run --rm rust cargo test --workspace
docker compose run --rm rust cargo deny check
docker compose -f tools/docs-check/compose.yaml run --rm repo
docker compose -f tools/docs-check/compose.yaml run --rm check
```

The repository check rejects a file outside the layout, a test in `src/`, a missing header, a registry out of date and a specification identifier in code. Add the module's entry to the `CHANGELOG.md`, its OpenAPI fragment in `docs/03-design/api/`, and its pages in this guide, and open the pull request.
