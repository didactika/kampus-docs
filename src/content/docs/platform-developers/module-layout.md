---
title: Module layout
description: The structure every module crate follows, the descriptor the server reads, and how to add a module or a new kind of contribution.
sidebar:
  order: 6
---

Every module crate has the same structure, whether it lives in the Kampus repository or is published outside it. The server never guesses from file names: it reads one **descriptor** per module. The layout tells you, reviewers and the repository checks where each part of a module lives.

## The descriptor

`src/module.rs` says what the module adds to the platform:

```rust
use kampus_module::Module;

pub const NAME: &str = "identity";

pub const MODULE: Module = Module {
    name: NAME,
    manifest: kampus_common::manifest!(),
    summary: "Accounts, credentials, sign-in, second factors, sessions and API tokens",
    steps: crate::db::STEPS,
    permissions: crate::permissions::PERMISSIONS,
    templates: crate::permissions::TEMPLATES,
    plugin_types: &[],
    commands: crate::commands::COMMANDS,
    preferences: crate::settings::PREFERENCES,
    events: crate::events::EVENTS,
    listeners: crate::observers::LISTENERS,
    jobs: crate::jobs::JOBS,
    schedules: crate::jobs::SCHEDULES,
    routes: Some(crate::http::routes),
};
```

At start-up the server applies the pending upgrade steps of every module, synchronises their permissions, and merges the values each module gives to every role template. The server serves its [routes](#routes) too. Events, observers, jobs, settings, privacy handlers, web modules and help topics join the descriptor as the core modules that run them arrive.

## The folders

```text
crates/<module>/
  Cargo.toml        package kampus-<module>, [package.metadata.kampus] kind = "module"
  src/
    lib.rs          crate documentation, the service type, modules, re-exports
    module.rs       NAME and MODULE
    commands/       its commands on the command line
    db/             steps.rs: the upgrade steps in the neutral schema
    permissions/    mod.rs: permissions; templates.rs: role template values
    model/          entities, identifiers and values
    service/        the service API, one file per area of use cases
    ports/          traits other modules implement for this one
    support/        internal helpers
    jobs/           one file per job
    events/         one file per event it publishes
    observers/      one file per event of another module it handles
    settings/       the settings it declares
    http/           its routes and their types
    privacy/        its export and erase handlers
  web/              its part of the web client
  lang/             its messages
  tests/            unit/, integration/, conformance/ and support/ (see Tests)
  version.toml      its version, maturity, supported releases and requirements
```

`src/lib.rs` and `src/module.rs` are the only files at the top of `src/`. A folder exists only when the module has something for it. The repository check fails when anything else appears, when the descriptor or a required declaration is missing, or when the server's registry is out of date.

Every crate also states what it is in `[package.metadata.kampus] kind`: `foundation`, `port`, `adapter`, `module` or `server`.

## Routes

A module serves HTTP through `routes` in its descriptor: a function that builds its `axum::Router` from the `ServiceContext`, the services the server built once for the process. A handler reads the services it needs by type and never builds one.

```rust
use axum::extract::State;
use axum::routing::get;
use axum::{Extension, Json, Router};
use kampus_identity::http::Caller;
use kampus_module::http::{ApiResult, Body, ServiceContext, if_match, with_etag};

pub fn routes(context: &ServiceContext) -> Router {
    let shared = Shared { users: context.service::<Users>().ok() };
    Router::new()
        .route("/me/profile", get(my_profile).put(update_my_profile))
        .with_state(shared)
}

async fn update_my_profile(
    State(shared): State<Shared>,
    Extension(caller): Extension<Caller>,
    headers: axum::http::HeaderMap,
    Body(fields): Body<ProfileFields>,
) -> ApiResult<axum::response::Response> {
    let account = caller.account()?;
    let profile = shared
        .users()?
        .update_profile(&caller.actor, account, fields, Some(if_match(&headers)?))
        .await?;
    let version = profile.version;
    Ok(with_etag(Json(profile), version))
}
```

The server serves every module's routes under `/api/v1`, after two layers:

| Layer | What the handler finds |
| --- | --- |
| Campus, from the server | `CurrentCampus`: the campus the request is for |
| Authentication, from identity | `Caller`: the actor, the session or API token, the campus, and where the request comes from |

`Caller` gives what each kind of route needs:

- `session()` for routes that manage credentials: passwords, sessions, second factors and tokens, which an API token never manages;
- `account()` for the person signed in;
- `acting(identity, permission, scope)` before an operation that needs a permission, which also keeps an API token within the permissions it carries. The service still checks the permission itself.

A browser authenticates with the `kampus_session` cookie, and every request that changes something with it carries the `X-Kampus` header; integrations send `Authorization: Bearer kmp_...`. A handler does not deal with either.

What every module's routes share lives in `kampus_module::http`:

| Item | Use |
| --- | --- |
| `ApiResult<T>` | Return a `kampus_common::Error` with `?`: it is answered as problem details with the request id |
| `Body<T>` | A JSON body; one that does not parse is a `validation` problem (`module.body_invalid`) |
| `id::<T>(segment)` | An identifier from the path; one that does not parse is `not_found`, like an unknown one |
| `if_match(headers)` | The version an update was made on; every update sends it, or gets `412` (`module.if_match_required`) |
| `with_etag(response, version)` | Answers a resource with its version as `ETag` |

The routes live in `src/http/`: `mod.rs` with `routes` and what the handlers share, and one file per area (`auth.rs`, `me.rs`, `accounts.rs`). Test them through the server, in `crates/server/tests/integration/`, as a client sees them: the test installs a site, builds its router and sends requests to it.

## Events and listeners

A module tells the others what changed by **publishing events**, and reacts to theirs with **listeners**; no module reads another's tables to find out. Events are declared in `src/events/mod.rs` and listeners in `src/observers/mod.rs`, exposed through `events` and `listeners` in the descriptor:

```rust
pub const EVENTS: &[EventDeclaration] = &[EventDeclaration {
    code: "enrol.enrolment_removed",
    version: 1,
    summary: "An enrolment was removed",
    fields: &["enrolment", "course", "account"],
    audited: true,
    personal_fields: &[],
}];

pub const LISTENERS: &[ListenerDeclaration] = &[ListenerDeclaration {
    event: "users.system_group_members_changed",
    name: "sync_linked_instances",
    run: sync_linked_instances,
}];
```

Publish inside the transaction of the change, with `Events::publish_in`: the event exists only if the change commits.

```rust
let mut event = Publish::new(ENROLMENT_REMOVED, Some(enrolment.as_uuid()), json!({ "enrolment": id, "course": course, "account": account }));
event.summary = Some(format!("enrolment {id} removed"));
Events::new(self.db.clone()).publish_in(&mut tx, event).await?;
```

| Rule | What it means for a module |
| --- | --- |
| Declared payload | Every field of `fields` is in the payload, or publishing fails; a change that breaks listeners is a new `version` |
| After commit | Listeners run after the transaction commits, never inside it, so a failing listener never undoes the change |
| At least once | A listener may receive an event twice: it uses the event's id or the state it finds, and does nothing twice |
| In order per object | Events about one `object` reach a listener in the order they happened; a delivery that keeps failing holds the next ones of that object until it is dead |
| Retries and dead letters | A failing delivery is retried with a wait that doubles, eight times, then it is dead and an operator replays it |
| Chains | A listener that publishes passes the event it handles as `cause`; a chain stops after ten events |
| Audit | An `audited` type writes an append-only entry of the audit log in the same transaction, with its `summary` |

Payloads hold identifiers, not copies of personal data; the fields that do hold it are listed in `personal_fields` for the privacy handlers. The `worker` and `all` roles run the deliveries; operators see and replay them with `kampus-server events`.

## Background jobs

Work that does not belong in a request, or that recurs, is a **job** in the queue of `kampus-tasks`. A module declares its kinds of job and their schedules in `src/jobs/mod.rs` and exposes them through `jobs` and `schedules` in its descriptor:

```rust
pub const JOBS: &[JobDeclaration] = &[JobDeclaration {
    code: "enrol.run_expiry",
    summary: "Apply the expiry rule to the enrolments whose end has passed",
    max_attempts: 5,
    backoff_seconds: 60,
    timeout_seconds: 1800,
    concurrency: Some("all"),
    run: run_expiry,
}];

pub const SCHEDULES: &[ScheduleDeclaration] = &[ScheduleDeclaration {
    job: "enrol.run_expiry",
    cron: "5 * * * *",
    time_zone: "UTC",
}];

fn run_expiry(run: JobRun<'_>) -> JobFuture<'_> {
    Box::pin(async move {
        run.services.service::<Enrol>()?.run_expiry().await?;
        Ok(())
    })
}
```

| Field | Meaning |
| --- | --- |
| `code` | `<module>.<name>`, unique in the build |
| `max_attempts` | Runs before the job is failed, with its last error kept and logged |
| `backoff_seconds` | The wait before the first retry; it doubles at each one |
| `timeout_seconds` | How long one run may take; a run past it is stopped and counts as a failed attempt. The worker's lease lasts as long, so a job whose worker stops is taken again |
| `concurrency` | A payload field: jobs of the type with the same value run one at a time (`Some("course")`); a field absent from the payload, such as `"all"`, keeps the whole type one at a time |
| `run` | The handler; it gets the job's id, its payload and the [`ServiceContext`](#routes) |

A handler may run again after a failure or a stopped worker, so it does what is left and nothing twice. Payloads hold identifiers, never copies of personal data. A long job reports its progress with `Tasks::report_progress` and stops at its next step when `Tasks::cancelled` says so.

To enqueue a job from a change, use `Tasks::enqueue_in` inside the change's transaction: the job exists only if the change commits.

The server synchronises job types and schedules at start-up; a schedule keeps the rule an operator set. The `worker` and `all` roles run jobs; the `scheduler` and `all` roles fire schedules, once per instant across every node. Operators see and steer them with `kampus-server tasks`.

## Commands of a component

A module offers commands on the command line in `src/commands/mod.rs`, listed in the `commands` field of its descriptor. The server reads them from the registry, so every module, inside the repository or not, gets its commands without any change to the server:

```text
kampus-server identity --help          lists the commands of identity
kampus-server identity purge           runs one
kampus-server access grant <user> [until]
```

```rust
pub const COMMANDS: &[Command] = &[Command {
    name: "purge",
    summary: "Remove expired one-time tokens and sessions",
    arguments: &[],
    run: purge,
}];

fn purge<'c>(context: &'c CommandContext, _arguments: &'c [String]) -> CommandFuture<'c> {
    Box::pin(async move {
        let purged = identity(context)?.purge().await?;
        Ok(vec![format!("{} session(s) removed", purged.sessions)])
    })
}
```

A command receives the database of the installation and its secret key in a `CommandContext`, gets its arguments already counted against its declaration, and returns the lines it reports. Names are in kebab case; a wrong number of arguments answers with the usage line.

## Tests

Tests never live in the code: no `#[cfg(test)]` in `src/`. Each crate keeps them in `tests/`, in one folder per kind; each folder is one test binary whose `main.rs` declares one file per topic:

```text
tests/
  unit/          pure checks, without databases or services
    main.rs      mod keys; mod schema; …
    schema.rs
  integration/   against PostgreSQL and the services of Docker Compose
    main.rs
    rules.rs     one test per behaviour
  conformance/   adapters: the conformance suite of their port
    main.rs
  support/       helpers shared by the folders above, included with #[path]
```

Tests go through the public API of the crate, as any caller would. `tools/repo-check` rejects a `#[cfg(test)]` in `src/`, a file directly in `tests/`, any other folder, and a folder without its `main.rs`.

## Every other crate

Foundation, port, adapter and server crates follow the same principle: `src/` holds only its entry files, and everything else lives in a folder named after its concern, each with a `mod.rs`. Folder names are snake case. Public paths do not depend on folders: `lib.rs` re-exports what callers use.

| Kind | At the top of `src/` | Required folders | Also at the crate root |
| --- | --- | --- | --- |
| `foundation` | `lib.rs` | — | — |
| `port` | `lib.rs` | `port/` (the trait and its types), `registry/` (`Adapter` and `open`), `conformance/` (the suite every adapter passes) | `adapters/` |
| `adapter` | `lib.rs` with `ADAPTER` | `store/` (the implementation) | — |
| `server` | `lib.rs`, `main.rs` | `commands/`, `config/`, `http/`, `wiring/` (the generated registries and the composition) | `adapters.toml`, `modules.toml` |
| `module` | `lib.rs`, `module.rs` | `db/`, `permissions/`, and the folders above | `web/`, `lang/`, `assets/` |

The crates of the repository today:

| Crate | Folders of `src/` |
| --- | --- |
| `kampus-common` | `adapter/` (settings of adapters), `clock/` (instants and clocks), `error/` (the error model), `id/` (typed identifiers), `page/` (pagination), `request/` (request context) |
| `kampus-db` | `connection/` (pool, prefix, error classes), `schema/` (the neutral schema), `upgrade/` (steps and the runner), `lint/` (the schema linter) |
| `kampus-module` | `descriptor/` (`Module`), `permission/` (the vocabulary of declarations) |
| `kampus-storage`, `kampus-cache` | `port/`, `registry/`, `conformance/`; the cache adds `layered/` |
| `kampus-server` | `commands/` (serve, upgrade, check), `config/`, `http/`, `wiring/` |

`tools/repo-check` rejects a file at the top of `src/` that is not an entry file, a folder without `mod.rs`, a missing required folder, and a crate without its kind.

## Names and folders

The name of a component comes from its package, and its folder follows from its name:

| Component | Package | Name | Folder |
| --- | --- | --- | --- |
| Core module | `kampus-identity` | `identity` | `crates/identity` |
| Adapter of the `cache` port | `kampus-cache-redis` | `cache_redis` | `crates/cache/adapters/redis` |
| Plugin of a type that a module defines | `kampus-<type>-<name>` | `<type>_<name>` | `crates/<owner>/<type>/<name>` |

Plugins and adapters carry their type as prefix, so their names never collide with the core. Only plugins and adapters may come from outside the repository; they are declared in `crates/server/modules.toml` or `crates/server/adapters.toml`. A module that defines a plugin type lists it in `plugin_types` of its descriptor.

`tools/repo-check` checks that every package matches its folder. The server checks names, versions, supported releases and requirements before it installs, upgrades or starts, and refuses with the list of problems.

## The version file

Every component has a `version.toml` next to its `Cargo.toml`, in the same form as the platform's `version.toml` at the root. The descriptor reads it with `kampus_common::manifest!()`, so no version data is written in code:

```toml
[component]
version = "1.2.0"
maturity = "beta"
kampus = ">=0.1.0, <0.3.0"
date = "2026-11-19"

[requires]
access = ">=0.1.0"
```

```rust
manifest: kampus_common::manifest!(),
```

| Key | Default | Meaning |
| --- | --- | --- |
| `component.version` | required | The version, semantic; equal to the package version |
| `component.maturity` | `stable` | `alpha`, `beta`, `rc` or `stable` |
| `component.kampus` | any release | The Kampus releases it works with, as a Cargo version requirement |
| `component.date` | none | The date of its release, `YYYY-MM-DD` |
| `component.icon` | `assets/icon.svg` when it exists, otherwise a generic icon | Another path, relative to the crate, only when the icon lives elsewhere |
| `[requires]` | none | Other components it needs, each with the versions it works with |

Name, summary and licence come from `Cargo.toml`. Everything but the version is optional: a component without it builds and runs, and `kampus-server components` shows what it lacks. A version that differs from the package, an unknown maturity, a malformed date or an icon that does not exist stops the build with the file and the key. Core components share the Kampus version (`version.workspace = true`); external ones have their own.

## Versions and the registry

The installation records the installed version of every component and every run that changed it:

| Table | Holds |
| --- | --- |
| `component` | Each installed component: kind, origin, version, maturity, when it was installed and last changed |
| `upgrade_run` | Each upgrade, downgrade or uninstall: the releases before and after, when, and how it ended |
| `component_change` | What each run did to each component: versions before and after, and how many steps |

A component with a new version needs an upgrade, even when it has no new steps. A component installed in a newer version than the build, or installed but missing from the build, stops the start: the operator downgrades, adds it back, or uninstalls it.

## Install actions and data migrations

A step may carry an action: Rust code that runs after the step's changes, in the same transaction, once. The action of step 1 is what the component sets up when it is installed; actions of later steps migrate data:

```rust
Step {
    sequence: 1,
    name: "create notes",
    revert: &[],
    action: Some(Action { name: "first note", run: first_note }),
    changes: &[/* tables */],
}

fn first_note<'c>(conn: &'c mut PgConnection, context: &'c ActionContext) -> ActionFuture<'c> {
    Box::pin(async move {
        sqlx::query(sqlx::AssertSqlSafe(format!("insert into {} (id) values ($1)", context.table("note"))))
            .bind(uuid::Uuid::now_v7())
            .execute(conn)
            .await
            .map(drop)
            .map_err(kampus_db::classify)
    })
}
```

If the action fails, the step's changes are undone with it and the run is recorded as failed. The action's name is part of the step's checksum, so renaming it after a release counts as changing the step.

## Going back

Versions never go back by themselves. A step that can be undone says how in `revert`; the SQL is kept in the installation when the step is applied, so an older build can undo steps it has never seen:

```rust
Step {
    sequence: 2,
    name: "add note text",
    revert: &[Change::DropColumn { table: "note", column: "body", unused_since: "1.1.0" }],
    action: None,
    changes: &[Change::AddColumn { table: "note", column: Column::new("body", Type::Text).nullable() }],
}
```

`kampus-server downgrade --yes`, run with the older build, undoes every newer step, newest first, and takes the components back to the build's versions. When a newer step left no way back, nothing is undone and the command names the steps. Actions are not undone: a step whose action changes data must say in `revert` how to bring the data back, or leave `revert` empty.

## Uninstalling

`kampus-server uninstall <component> --yes` removes a component that is installed but no longer in the build: its tables, its steps in the ledger and its registration. It is refused while a component of the build requires it.

## Commands of the operator

| Command | Does |
| --- | --- |
| `kampus-server components [--json]` | Lists the components of the build and of the installation: versions, maturity, state and what each lacks |
| `kampus-server history [--limit N]` | Shows the latest upgrades, downgrades and uninstalls, with what each did to each component |
| `kampus-server check` | Says whether the installation matches the build, without changing it |
| `kampus-server upgrade` | Applies the pending steps and registers the components |
| `kampus-server downgrade --yes` | Goes back to the build's versions |
| `kampus-server uninstall <component> --yes` | Removes a component no longer in the build |

## Adding a module

1. Add its row to the module table of the architecture: its level decides which modules it may depend on.
2. Create the crate with the layout above and its descriptor.
3. Run the repository check with `--fix`: it registers the module in `kampus-server`, in dependency order.

A module published outside the repository is declared in `crates/server/modules.toml`, and is registered after the modules of the repository:

```toml
[[module]]
crate = "kampus-attendance"
source = 'git = "https://example.org/kampus-attendance", tag = "v1.0.0"'
```

## Adding a kind of contribution

A new kind of contribution is introduced by the core module that owns it, in one pull request: a field in `kampus_module::Module`, its folder in the layout and in the repository check, what the server does with it, and its section in this guide. From then on, every module, inside the repository or not, uses it the same way.
