# Changelog

All notable changes to the Kampus documentation are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The documentation is versioned with Kampus.

## [Unreleased]

### Changed

- The documentation is free software under the GNU Affero General Public License, version 3 or later, like Kampus, and every source file carries the standard Kampus header.

### Added

- The operator guide: installing with Docker Compose (one server, HTTPS with Caddy) and on Kubernetes with the Helm chart, backup and restore, and monitoring (health, metrics, logs and alerts); the proxies whose address Kampus believes, and the variables of the web client.
- Connections for platform developers: never hold one while calling another service, and the `_in` variants that pass it on.
- A reference section generated from the declarations of every module: permissions with the roles that grant them, settings, features and terms, events, notifications and jobs.
- Guides of grades and progress and of files for learners; people, settings and rules of a course for teachers; settings, background tasks, deliveries and the audit log for administrators; the language of the interface and the help of each screen.
- Checks in CI: headers, the coverage of every available use case by the guides of its roles, the build and the internal links.

- Database connections for operators: the pool of each process, sizing `max_connections`, and which PgBouncer modes Kampus works with.
- Profiles, preferences and changing the email for learners; system groups and the users permissions for administrators.
- Commands of components, for platform developers and operators.
- Installing Kampus and the configuration file, section by section, for operators.
- The version file of each component and the organisation of tests, in the module layout guide.
- The version file of the platform, for platform developers and operators.
- Components with versions: names and folders, the manifest, the registry, install actions, going back and uninstalling, for platform developers; the component commands and history for operators.
- The layout of every kind of crate (foundation, port, adapter, server, module), with the folder map of each crate, in the module layout guide.
- Module layout guide for platform developers: the descriptor the server reads, the folders of a module crate, how to add a module (also from outside the repository) and a new kind of contribution; plugin developers are pointed to it.
- Identity providers and their linking policies for administrators, and signing in with your organisation for learners.
- Second factors and access recovery in the account guide for learners, and requiring a second factor for a role in the roles guide for administrators.
- Accounts guide for administrators (statuses, invitations, suspension, deletion with its grace period, service accounts, identity permissions and the default policy), the account guide for learners, and the API tokens guide for integrators.
- Roles and permissions guide for administrators: the default roles, the access permissions, how a check is decided, allowances, safety rules and "view as".
- The development server and the content layer watch files by polling, so new and edited pages show up without a restart under Docker on Windows.
- Adapters as sub-plugins of their port, how to add one (also from outside the repository), and the storage and cache variables for operators.
- Database schema guide for platform developers: the neutral schema, the linter, upgrades, error classes and capabilities.
- Infrastructure ports for platform developers: storage and cache, their adapters and conformance suites, and the services Compose starts for them.
- Running Kampus with Docker Compose, the commands of `kampus-server`, the new configuration variables, the file header and the licence.
- The documentation site, with the look of Didactika's documentation, in English and Spanish, served with Docker at http://localhost:8096.
- One guide per audience: learners, teachers, administrators, operators, integrators, plugin developers and platform developers, with the use cases of each audience and their status, synchronised from the Kampus specification.
- Operator guide: infrastructure, configuration and upgrades from any supported release in one run.
- Platform developer guides: getting started, conventions (file headers, documentation comments, branches, commits), versions and changelog, architecture.
- The changelog of Kampus and its versions and support.
