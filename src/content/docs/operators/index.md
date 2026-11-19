---
title: Operators
description: How Kampus is deployed, configured and kept up to date.
sidebar:
  order: 0
---

Kampus ships as **one container image** that runs in three roles: `server` (HTTP), `worker` (background jobs) and `scheduler` (scheduled tasks), or all of them in one process (`all`). State lives only in the database, the file storage and the cache, so every role scales horizontally.

:::caution[In development]
Kampus 0.1.0 has no released image yet. You can already build and run it with Docker Compose from the repository (see [getting started](/platform-developers/getting-started/#run-kampus)); the installation guide arrives with the first release.
:::

## Commands

| Command | What it does |
| --- | --- |
| `kampus-server install` | Writes the configuration file, asking for what is missing, and creates the installation with its first campus and administrator; an installed database is left as it is |
| `kampus-server serve` | The default: serves the role of `KAMPUS_SERVER_ROLE` until it receives a stop signal, then finishes the requests in flight |
| `kampus-server upgrade` | Applies every pending upgrade step, from whichever release the installation is on, and creates the installation if it does not exist |
| `kampus-server upgrade --new-installation` | The same, when the database already holds other Kampus installations with other prefixes |
| `kampus-server check` | Reports whether the database matches the build, without changing anything; exits with an error when it does not |

Every role answers `/health/live` (the process runs) and `/health/ready` (the database answers and matches the build, and the file storage and the cache answer) on `KAMPUS_SERVER_HTTP_ADDRESS`. The scheme of each URL chooses the adapter among those of the build.

Every component can add its own commands: `kampus-server <component> --help` lists them, and `kampus-server <component> <command>` runs one (for example `kampus-server identity purge` or `kampus-server tasks jobs`).

## Background jobs

Work that does not happen in a request runs as **jobs** in a queue kept in the database: purging expired sessions, deleting accounts and courses whose grace period ended, keeping system group enrolments in step, applying the expiry of enrolments. Nothing is lost when a process stops: a job whose worker stopped is taken again once its time runs out, a failing job is retried with a growing wait, and one that runs out of attempts stays **failed** with its error until you retry it.

| Role | Background work |
| --- | --- |
| `server` | None |
| `worker` | Runs jobs; run as many as you need |
| `scheduler` | Fires the schedules; several can run, each schedule fires once |
| `all` | Both, for small installations |

| Command | What it does |
| --- | --- |
| `kampus-server tasks jobs [state]` | The latest jobs, optionally only `queued`, `running`, `succeeded`, `failed` or `cancelled` |
| `kampus-server tasks job <id>` | A job with its attempts and their errors |
| `kampus-server tasks retry <id>` | Queues a failed job again |
| `kampus-server tasks cancel <id>` | Cancels a job; a running one stops at its next step |
| `kampus-server tasks schedules` | Every schedule with its rule, time zone and next run |
| `kampus-server tasks schedule <job> "<cron>" <time-zone> [on\|off]` | Changes the rule of a schedule, or turns it off |
| `kampus-server tasks run <job>` | Runs a scheduled job now |

The schedules of 0.1.0, all in UTC, which you can change:

| Job | Rule | What it does |
| --- | --- | --- |
| `identity.purge` | `0 3 * * *` | Removes expired one-time tokens and sessions, and old sign-in attempts |
| `identity.run_deletions` | `15 * * * *` | Deletes the accounts whose grace period ended |
| `courses.run_deletions` | `20 * * * *` | Deletes the courses whose scheduled deletion is due |
| `enrol.sync` | `*/15 * * * *` | Keeps the enrolments of system groups in step with their groups |
| `enrol.run_expiry` | `5 * * * *` | Applies the expiry rule to ended enrolments |
| `tasks.purge` | `30 3 * * *` | Removes finished jobs older than 30 days |
| `events.purge` | `45 3 * * *` | Removes events older than 90 days and audit entries older than two years |

## Events and the audit log

Parts of Kampus tell each other what changed through **events**, delivered by the `worker` and `all` roles after each change is saved. A delivery that keeps failing is retried with a growing wait and, after eight attempts, is **dead**: it waits for you, and the events about the same object after it go on. Significant changes, such as removing an enrolment or archiving a course, also write an entry in the **audit log**, which cannot be changed and is kept for two years.

| Command | What it does |
| --- | --- |
| `kampus-server events deliveries [pending\|done\|dead]` | The latest deliveries in a state, dead ones by default, with their errors |
| `kampus-server events replay [event]` | Runs the dead deliveries again, of one event or all |
| `kampus-server events listener <module> <name> off\|on` | Turns a listener off, for example while you fix what it depends on; its deliveries wait and run when you turn it on |
| `kampus-server events audit` | The latest entries of the audit log |

## Settings

What each part of Kampus lets you configure is a **setting**, set for the platform, a campus, a category, a course or a section, as each setting allows. A scope below takes the value of the nearest scope above that sets it, unless that scope **locks** it. Every change is recorded with the value before and after.

| Command | What it does |
| --- | --- |
| `kampus-server settings list` | Every setting with its default and the scopes where it may be set |
| `kampus-server settings get <key> <scope\|platform>` | The value in a scope and where it comes from |
| `kampus-server settings set <key> <scope\|platform> <value> [locked]` | Sets a value, written as JSON: `true`, `12`, `"text"`; `locked` keeps the scopes below from changing it |
| `kampus-server settings unset <key> <scope\|platform>` | Removes the value, so it comes from above again |
| `kampus-server settings history <key> <scope\|platform>` | The changes of a setting in a scope |

For example, to let visitors sign up on every campus and require longer passwords on one:

```sh
kampus-server settings set identity.self_sign_up platform true
kampus-server settings set identity.password_min_length <campus> 16
```

## Infrastructure

| Piece | First release | Later |
| --- | --- | --- |
| Database | PostgreSQL 17 | MySQL and MariaDB, SQLite, SQL Server, Oracle |
| File storage | Local disk, S3-compatible | Azure Blob, Google Cloud Storage, WebDAV, SFTP |
| Cache | In-process, Redis or Valkey | Memcached |
| Sessions, task queue, search | The database | Redis or Valkey, NATS, Meilisearch or OpenSearch |
| Mail | SMTP | Provider APIs |

## Installing

`kampus-server install` sets an installation up in one go:

1. It reads `config.toml` (or the file `KAMPUS_CONFIG_FILE` names) and the environment, and asks only for what is still missing: the site's address, the database, the schema prefix, the file storage, the cache and how campuses are served. Without a terminal, or with `--non-interactive`, it asks nothing and lists every missing value at once.
2. It generates the secret key when there is none, and writes the file, readable only by its owner. Values given by variables stay in the variables.
3. When the database already holds the installation, it changes nothing in it and says whether `kampus-server upgrade` is due: a filled `config.toml` pointing at an installed database is all a new server needs. An installation that has no campus yet, such as one an upgrade or the first start created, gets its first campus and administrator as in the next step.
4. Otherwise it creates the installation, the first campus with its roles, and the campus administrator: email, username and password are asked, or read from `KAMPUS_ADMIN_EMAIL`, `KAMPUS_ADMIN_USERNAME` and `KAMPUS_ADMIN_PASSWORD`, which only the installer reads.

```sh
docker compose run --rm -it server install
```

## The configuration file

`config.toml` has one table per section; [`config.example.toml`](https://github.com/didactika/kampus/blob/release/0.1.0/config.example.toml) at the root of the repository shows them all. Every key has its environment variable, `KAMPUS_<SECTION>_<KEY>`, which takes precedence over the file. Each role checks at start-up only what it reads and refuses to start when a value is missing or invalid, listing every problem at once. The file holds secrets: keep it out of version control and readable only by Kampus.

| Key | Variable | Used by | Default | Description |
| --- | --- | --- | --- | --- |
| `site.url` | `KAMPUS_SITE_URL` | server | required | The public address of the site, used in links and mail |
| `server.role` | `KAMPUS_SERVER_ROLE` | all | `all` | `server`, `worker`, `scheduler` or `all` |
| `server.http_address` | `KAMPUS_SERVER_HTTP_ADDRESS` | all | `0.0.0.0:8080` | The address of the HTTP listener |
| `server.upgrade_on_start` | `KAMPUS_SERVER_UPGRADE_ON_START` | all | `false` | Apply pending upgrades when the process starts |
| `database.url` | `KAMPUS_DATABASE_URL` | all | required | The PostgreSQL connection |
| `database.prefix` | `KAMPUS_DATABASE_PREFIX` | all | `kmp_` | The prefix of every schema, set once at installation |
| `database.pool_size` | `KAMPUS_DATABASE_POOL_SIZE` | all | `10` | Connections per process |
| `storage.url` | `KAMPUS_STORAGE_URL` | server, worker | required | `file:///path` or `s3://bucket/prefix` |
| `storage.s3_endpoint`, `s3_region`, `s3_access_key_id`, `s3_secret_access_key` | `KAMPUS_STORAGE_S3_…` | server, worker | with `s3://` | The S3-compatible store: endpoint (omit for AWS), region and credentials |
| `cache.url` | `KAMPUS_CACHE_URL` | server, worker | in-process | `redis://`, `rediss://` or `valkey://`; without it only one instance may run |
| `security.secret_key` | `KAMPUS_SECURITY_SECRET_KEY` | server, worker | required | 32 bytes in base64 that seal stored secrets; generated by the installer, never changed afterwards |
| `tenancy.mode` | `KAMPUS_TENANCY_MODE` | all | `single` | `single`: one campus at the site's address; `multi`: a campus per domain |
| `tenancy.base_domain` | `KAMPUS_TENANCY_BASE_DOMAIN` | all | with `multi` | The domain under which each campus has its own (`a.campuses.example.org`) |
| `log.level` | `KAMPUS_LOG_LEVEL` | all | `info` | `error`, `warn`, `info`, `debug` or `trace` |
| `log.format` | `KAMPUS_LOG_FORMAT` | all | `json` | `json` lines for collectors, or `text` |

`KAMPUS_CONFIG_FILE` names another file; the container image reads `/etc/kampus/config.toml`. Mail, sessions, the task queue and search get their sections with the modules that use them.

In 0.1.0 the API serves one campus: with `tenancy.mode = "multi"` every route answers that the address has no campus until campuses get their domains. Mail is not delivered yet either: invitations, confirmation and recovery links and codes by email are logged as due, without their links, until the module that sends mail arrives. The development `compose.yaml` sets a first administrator for `install` (`admin`, with the password in `KAMPUS_ADMIN_PASSWORD`).

Next: [upgrades](/operators/upgrades/).
