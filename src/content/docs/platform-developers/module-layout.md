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
    settings: crate::settings::SETTINGS,
    terms: &[],
    flags: &[],
    field_kinds: &[],
    page_kinds: &[],
    widgets: &[],
    menu_kinds: &[],
    rule_actions: &[],
    file_areas: &[],
    activity_types: &[],
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

The server serves the routes of each module under `/api/v1/<module>`, the name of the module: the route above is `/api/v1/users/me/profile`. A module writes its paths without that prefix, so two modules, or one written later, never collide whatever routes they add; a path does not repeat the name of its module either. Links a module builds to its own routes use its name from `src/module.rs`.

Before any handler the server runs two layers:

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
| Every event | A listener of `events.any` receives the events of every type; nothing publishes `events.any` itself |
| Audit | An `audited` type writes an append-only entry of the audit log in the same transaction, with its `summary` |

Payloads hold identifiers, not copies of personal data; the fields that do hold it are listed in `personal_fields` for the privacy handlers. The `worker` and `all` roles run the deliveries; operators see and replay them with `kampus-server events`.

## Settings

What a campus, a category, a course or a section may configure is a **setting** the module declares in `src/settings/mod.rs` and exposes through `settings` in its descriptor. Values are kept per scope and resolved by `kampus-settings`:

```rust
pub const SETTINGS: &[SettingDeclaration] = &[SettingDeclaration {
    key: "courses.group_mode",
    summary: "Whether people work in groups: none, separate or visible",
    kind: ValueKind::Choice { options: &["none", "separate", "visible"], default: "none" },
    levels: &[ScopeKind::Course, ScopeKind::Section, ScopeKind::Activity],
    permission: GROUPS_MANAGE,
    restart_required: false,
}];
```

| Field | Meaning |
| --- | --- |
| `key` | `<module>.<name>`, unique in the build |
| `kind` | `Boolean`, `Integer` with its bounds, `Text` with its length or `Choice` with its options, and the default; a value of another kind is refused |
| `levels` | The kinds of scope where a value may be set; anywhere else it is refused |
| `permission` | The permission, declared by the module, that sets it in a scope |
| `restart_required` | The roles that read it apply a change only at their next start |

Read a value with `Settings::resolve(key, scope)`, or every setting of a module at once with `Settings::resolve_prefix("<module>.", scope)`: the value of the nearest scope that sets it wins, unless a scope above set it **locked**; without any, the default. The answer says where the value came from. Every change records who made it with the value before and after, and publishes `settings.changed`.

A module never reads a setting it does not declare, and never keeps its own table of options: identity, for example, reads the policy of a campus (`identity.*`) through its `Policies` port from settings.

## Customisation

What a campus changes without code beyond settings, a module offers in `src/settings/customise.rs` and exposes through `terms`, `flags`, `field_kinds`, `page_kinds`, `widgets`, `menu_kinds` and `rule_actions` in its descriptor; `kampus-customise` keeps it per scope and resolves it like settings, from the nearest scope up to the platform, sections included, unless a scope above **locks** its value. Every answer says where it came from (declared, or the scope that set it), every change is recorded with before and after and publishes `customise.changed`.

```rust
pub const TERMS: &[TermDeclaration] = &[TermDeclaration {
    code: "courses.course",
    forms: &[
        TermForms { language: "en", singular: "course", plural: "courses" },
        TermForms { language: "es", singular: "curso", plural: "cursos" },
    ],
}];
pub const FLAGS: &[FlagDeclaration] = &[FlagDeclaration {
    code: "courses.groups",
    summary: "Groups and group sets in courses",
    default: true,
}];
pub const FIELD_KINDS: &[FieldKindDeclaration] = &[FieldKindDeclaration {
    code: "courses.course",
    summary: "Courses",
}];
```

| Declaration | A scope | The module |
| --- | --- | --- |
| A **term**, with its singular and plural per language | Renames it per language (`customise.term.manage`); a language the module does not declare falls back to its first | Shows `Customise::term(code, scope, language)` instead of a fixed word |
| A **flag**, with its default | Turns the feature on or off (`customise.flag.manage`); its data stays | Guards what the feature offers with `Customise::require_flag(code, scope)`, which answers `conflict` (`customise.feature_off`) |
| A **kind of entity** | Defines typed custom fields for it (`customise.field.manage`): text, integer, date, boolean, choice, choices or account, public or private (`customise.field.view`) | Keeps a link table `<entity>_field` (entity, field, value, all `CASCADE`), writes values with `Customise::write_value_in` inside its own transaction and reads them with `Customise::values` |
| A **page kind**, with its regions | Arranges widgets in its regions (`customise.layout.manage`, which teachers hold in their courses), each with its settings and, optionally, the permission that shows it; the layout of the nearest scope applies whole | Shows the placements of `Customise::layout(actor, page_kind, scope)`, or its own arrangement when the origin is declared; a widget no module declares any more is left out, never breaks the page |
| A **widget**, with the page kinds it fits and its typed settings (`WidgetSetting` with a `ValueKind`) | Places it; a setting it does not declare, or of another kind, is refused, and the defaults fill what is left out | Renders it from its settings |
| A **kind of menu** | Sets its items (`customise.menu.manage`): a label, a path or web address, a permission, at most 3 levels | Shows `Customise::menu(actor, kind, scope)`: only the items the reader may see |
| A **rule action**, with typed parameters (`RuleParameter`), the payload fields it reads (`needs`), the permission its rule owner needs and the events it may publish | Writes rules (`customise.rule.manage`): when an event of a declared type happens in the scope or below and the conditions on its declared fields hold, the actions run in order | Runs the action from `RuleActionRun` (event, parameters with defaults, owner, services), does nothing twice, and publishes with the event as `cause` |

Customisation never owns an entity of another module: the values of custom fields belong to their entity through the owning module's link table, so there is no polymorphic owner, and deleting the entity, the field or the value takes the link with it.

The theme of a scope is not declared by modules: it is a fixed set of design tokens (colours, font, sizes, motion) that each scope may set over those above it, checked for WCAG 2.2 AA contrast (`customise.theme.manage`). Modules style their pages with the `--kampus-*` custom properties of `GET /scopes/{scope}/theme.css`, never with colours of their own.

## External references

Every record an integration touches carries the identifiers other systems give it, as external references (system, identifier), never as a column of the record and never in its human `code`. A module adds one table per kind of record in a step, with `kampus_db::reference_table!("course_reference", "course")`, and reaches it through `kampus_db::references::References::new(&db, module::NAME, "course_reference")`: `set`/`set_in`, `remove`, `find` and `of`. `ExternalReference::new(system, external_id)` checks and trims what a caller sends.

| A module | Does |
| --- | --- |
| Sets and removes references | With the permission that manages the record, which also decides who reads them |
| Finds a record by one | `GET /api/v1/<module>/campuses/{campus}/<records>/by-reference/{system}/{external_id}` |
| Creates or updates by one, when integrations create the record | Sets the reference in the transaction that creates the record, so it never exists without it; `PUT …/by-reference/{system}/{external_id}` answers 201 or 200 |

## Activity types

A module that provides activities or materials declares their **types** in `src/settings/` and exposes them through `activity_types` in its descriptor; `kampus-activities` registers them, places course modules of them in sections, and never reads what a type keeps of its own:

```rust
pub const TYPES: &[ActivityTypeDeclaration] = &[ActivityTypeDeclaration {
    code: "activities.page",
    kind: ActivityKind::Material,
    summary: "A page of text",
    features: &["copy"],
    settings: &[ActivitySetting { key: "content", kind: ValueKind::Text { max: 20_000, default: "" } }],
}];
```

A course module is created, updated, copied and moved in one transaction with the settings its type declares, each checked against its kind with the defaults filled in. A type that keeps data of its own references `activities.course_module` with a foreign key and `CASCADE`, in its own table, and an activity that owns files declares a file area whose `readable` asks `Activities::visible_to`.

### Giving grades

An activity that grades declares one **record** for each grade it gives, when its course module is created or changed, and sends the grades as they arrive; both are idempotent, so repeating them changes nothing:

```rust
let record = records
    .declare_activity_record(module, 0, RecordFields::new("Lab report", Decimal::from(10)))
    .await?;
records
    .submit_activity_grade(record.id, GradeWrite { account, raw: Some(Decimal::from(7)), text: None, feedback: None })
    .await?;
```

Declaring a record again updates its title and range and leaves what a teacher set (weight, category, hiding). A grade a teacher has overridden or locked keeps counting as set; the activity grade is still kept as the raw grade, and every change leaves an entry. The module has already checked who may submit; `records.grade` is for people.

### Reporting what a person did

An activity tells progress what people do with it, after it has checked that they may; both calls are idempotent:

```rust
progress.notify_view(module, account).await?;
progress.notify_submission(module, account).await?;
```

Grades need no call: progress listens to `records.grade_changed` and `records.overridden`, and finds the course module of the grade record. A module that shows progress reads it through `Progress::state_of` and `Progress::states_for`, which apply the visibility of grades, and never from the tables.

## File areas

A module that keeps files declares its **areas** in `src/settings/files.rs` and exposes them through `file_areas` in its descriptor; `kampus-files` stores the content once and runs the one upload pipeline, and the module owns its files through a link table of its own:

```rust
pub const FILE_AREAS: &[FileAreaDeclaration] = &[FileAreaDeclaration {
    code: "users.picture",
    summary: "The profile picture of a person",
    max_size: 5 * 1024 * 1024,
    allowed_types: &["image/png", "image/jpeg", "image/gif", "image/webp"],
    upload_permission: PROFILE_UPDATE_OWN,
    readable: picture_readable,
}];
```

| Field | Meaning |
| --- | --- |
| `max_size`, `allowed_types` | The largest file and the media types it accepts, exact or as a family (`image/*`); the type is read from the content, never taken from the sender |
| `upload_permission` | The permission an uploader holds in the scope the upload is for |
| `readable` | Whether a principal may read one of its files, given the file: when they may read the record that owns it. Files asks it, and has no other way to grant reading |

The owning module keeps a table `<entity>_file` (or a column in a table of its own) with foreign keys to its record and to `files.file`, both `CASCADE`, and calls `Files::attach_in` and `Files::detach_in` inside the transaction that links or unlinks them: the count of the uses of the content moves with them, and a file nobody attaches is removed after a day. A file is read through `POST /api/v1/files/files/{id}/url`, a link of a few minutes that never runs content in the platform's origin.

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

## Notification types

A module that tells people things declares the **types** in `src/settings/notifications.rs` and exposes them through `notification_types` in its descriptor; `kampus-notify` registers them, creates the notifications from events after the change commits, and delivers them according to each person's preferences:

```rust
pub const TYPES: &[NotificationTypeDeclaration] = &[NotificationTypeDeclaration {
    code: "records.grade_posted",
    summary: "You have a new grade",
    channels: &["inbox"],
    required: false,
}];
```

A module never sends anything inside the request that causes it. Notify listens to the events, asks the owner of the data whether the person may see what the notification is about (a grade, through `Records::grades_for`), and calls `Notify::notify(type, person, payload, dedupe)`, where `dedupe` is the id of the event so a repeated delivery notifies once.

## Privacy handlers

A module that keeps personal data declares a **handler** in `src/privacy/mod.rs` and exposes it through `privacy_handlers` in its descriptor. Privacy asks each handler for the data of one account in a job, so it never depends on the module it serves:

```rust
pub const HANDLERS: &[PrivacyHandlerDeclaration] = &[PrivacyHandlerDeclaration {
    code: "records.grades",
    purpose: "Grades and the history of the changes to them",
    export,
    erase,
}];
```

The `export` handler returns JSON by table; it reads only its own schema and never copies the data anywhere else. The `erase` handler runs when a deletion was approved and returns a report of what it did: it deletes what only concerns the person (notifications, personal calendar entries), or keeps what belongs to the academic record (grades, progress) and says so, since those rows keep pointing to the tombstone the account becomes.

## Condition kinds

A module can offer a kind of access condition in `src/settings/conditions.rs` and expose it through `condition_kinds` in its descriptor. Activities keeps the tree of `all`, `any` and `not`; each leaf of your kind lives in a table of your own schema, keyed by `condition_id` with a foreign key to `activities.condition` (`CASCADE`) and foreign keys to what it depends on:

```rust
pub const KINDS: &[ConditionKindDeclaration] = &[ConditionKindDeclaration {
    code: "records.grade",
    summary: "A grade of the course is at least a percentage of its range",
    store,
    params,
    met,
    depending_on: nothing_depends,
}];
```

`store` checks the parameters and writes the leaf with the connection it receives, which is the transaction of the whole tree: a validation error refuses the tree and nothing is kept. What a leaf depends on must be in the course it gets. `params` gives the parameters back for the editor, or `None` when the leaf lost what it depended on, which marks it as broken. `met` answers for one person, reading your own tables; it must never be true by mistake, so a missing row answers false. `depending_on` lists the leaves that ask about a course module, so its deletion can be refused or remove them; kinds that never point to a course module use `nothing_depends`.
