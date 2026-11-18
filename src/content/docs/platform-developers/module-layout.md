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
    summary: "Accounts, credentials, sign-in, second factors, sessions and API tokens",
    steps: crate::db::STEPS,
    permissions: crate::permissions::PERMISSIONS,
    templates: crate::permissions::TEMPLATES,
};
```

At start-up the server applies the pending upgrade steps of every module, synchronises their permissions, and merges the values each module gives to every role template. Events, observers, jobs, settings, routes, privacy handlers, web modules and help topics join the descriptor as the core modules that run them arrive.

## The folders

```text
crates/<module>/
  Cargo.toml        package kampus-<module>, [package.metadata.kampus] kind = "module"
  src/
    lib.rs          crate documentation, the service type, modules, re-exports
    module.rs       NAME and MODULE
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
  tests/            integration tests, one per business rule or use case
```

`src/lib.rs` and `src/module.rs` are the only files at the top of `src/`. A folder exists only when the module has something for it. The repository check fails when anything else appears, when the descriptor or a required declaration is missing, or when the server's registry is out of date.

Every crate also states what it is in `[package.metadata.kampus] kind`: `foundation`, `port`, `adapter`, `module` or `server`.

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
