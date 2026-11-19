---
title: Platform developers
description: How Kampus is built, and how to contribute to it.
sidebar:
  order: 0
---

Kampus is a modular monolith in Rust: one crate per module, a strict ranking of modules (a module calls only modules below it and hears about the ones above through events), PostgreSQL first behind a database port, and a web client made of UI modules loaded into a shell.

The specification (requirements, domain and data models, API fragments, use cases and decisions) lives in the `docs/` folder of the Kampus repository. These guides explain how to work on the code.

| Guide | What it covers |
| --- | --- |
| [Getting started](/platform-developers/getting-started/) | The development environment in Docker and the commands of every quality gate |
| [Your first module](/platform-developers/first-module/) | A module built end to end: crate, version file, schema, permissions, service, routes, descriptor, tests and checks |
| [Module layout](/platform-developers/module-layout/) | The reference of every piece of a module and of every other crate: descriptor, folders, routes, commands, versions, install actions, going back |
| [Conventions](/platform-developers/conventions/) | File headers, documentation comments, branches, commits and pull requests |
| [Versions and changelog](/platform-developers/versions/) | The platform version, the changelog entry of every pull request, releases and support branches |
| [Architecture](/platform-developers/architecture/) | The modules, their levels, the rules the build enforces and the infrastructure ports |
| [Database schema](/platform-developers/database/) | How a module declares its tables, upgrades them and handles database errors |
