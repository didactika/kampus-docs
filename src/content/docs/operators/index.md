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
| `kampus-server serve` | The default: serves the role of `KAMPUS_ROLE` until it receives a stop signal, then finishes the requests in flight |
| `kampus-server upgrade` | Applies every pending upgrade step, from whichever release the installation is on, and creates the installation if it does not exist |
| `kampus-server upgrade --new-installation` | The same, when the database already holds other Kampus installations with other prefixes |
| `kampus-server check` | Reports whether the database matches the build, without changing anything; exits with an error when it does not |

Every role answers `/health/live` (the process runs) and `/health/ready` (the database answers and matches the build) on `KAMPUS_HTTP_ADDRESS`.

## Infrastructure

| Piece | First release | Later |
| --- | --- | --- |
| Database | PostgreSQL 17 | MySQL and MariaDB, SQLite, SQL Server, Oracle |
| File storage | Local disk, S3-compatible | Azure Blob, Google Cloud Storage, WebDAV, SFTP |
| Cache | In-process, Redis or Valkey | Memcached |
| Sessions, task queue, search | The database | Redis or Valkey, NATS, Meilisearch or OpenSearch |
| Mail | SMTP | Provider APIs |

## Configuration

A file (`kampus.toml`) plus environment variables, which take precedence. Each role checks at start-up only the variables it uses and refuses to start when one is missing or invalid, listing every problem at once.

| Variable | Used by | Required | Description |
| --- | --- | --- | --- |
| `KAMPUS_ROLE` | all | no (`all`) | `server`, `worker`, `scheduler` or `all` |
| `KAMPUS_PUBLIC_URL` | server, worker | yes | Public address of the campus |
| `KAMPUS_HTTP_ADDRESS` | all | no (`0.0.0.0:8080`) | Address of the HTTP listener |
| `KAMPUS_CONFIG_FILE` | all | no (`kampus.toml`) | The configuration file; its keys are the variable names without `KAMPUS_`, in lower case |
| `KAMPUS_UPGRADE_ON_START` | all | no (`false`) | Apply pending upgrade steps at start instead of with `kampus-server upgrade` |
| `KAMPUS_DATABASE_URL` | all | yes | Database connection |
| `KAMPUS_DATABASE_PREFIX` | all | no (`kmp_`) | Prefix of every database name, set once at installation |
| `KAMPUS_DATABASE_POOL_SIZE` | all | no | Connections per process |
| `KAMPUS_STORAGE_URL` | server, worker | yes | `file:///path` or `s3://bucket/prefix` |
| `KAMPUS_CACHE_URL` | server, worker | no | Redis or Valkey; without it, one instance only |
| `KAMPUS_SESSIONS_URL` | server | no | Sessions outside the database |
| `KAMPUS_QUEUE_URL` | all | no | Task queue outside the database |
| `KAMPUS_SEARCH_URL` | server, worker | no | Search engine outside the database |
| `KAMPUS_SECRET_KEY` | all | yes | Encrypts stored secrets, signs cookies and cursors |
| `KAMPUS_MAIL_URL` | worker | yes | `smtp://` or a provider |
| `KAMPUS_LOG_LEVEL` | all | no (`info`) | Log level |
| `KAMPUS_LOG_FORMAT` | all | no (`json`) | `json` lines or `text` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | all | no | OpenTelemetry collector |

Next: [upgrades](/operators/upgrades/).
