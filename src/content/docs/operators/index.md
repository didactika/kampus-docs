---
title: Operators
description: How Kampus is deployed, configured and kept up to date.
sidebar:
  order: 0
---

Kampus ships as **one container image** that runs in three roles: `server` (HTTP), `worker` (background jobs) and `scheduler` (scheduled tasks), or all of them in one process (`all`). State lives only in the database, the file storage and the cache, so every role scales horizontally.

:::caution[In development]
Kampus 0.1.0 has no installable release yet. This guide describes the deployment the platform is being built for; the installation steps arrive with the first release.
:::

## Infrastructure

| Piece | First release | Later |
| --- | --- | --- |
| Database | PostgreSQL 17 | MySQL and MariaDB, SQLite, SQL Server, Oracle |
| File storage | Local disk, S3-compatible | Azure Blob, Google Cloud Storage, WebDAV, SFTP |
| Cache | In-process, Redis or Valkey | Memcached |
| Sessions, task queue, search | The database | Redis or Valkey, NATS, Meilisearch or OpenSearch |
| Mail | SMTP | Provider APIs |

## Configuration

A file (`kampus.toml`) plus environment variables, which take precedence. Each role checks at start-up only the variables it uses and refuses to start when one is missing or invalid.

| Variable | Used by | Required | Description |
| --- | --- | --- | --- |
| `KAMPUS_ROLE` | all | no (`all`) | `server`, `worker`, `scheduler` or `all` |
| `KAMPUS_PUBLIC_URL` | server, worker | yes | Public address of the campus |
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
| `OTEL_EXPORTER_OTLP_ENDPOINT` | all | no | OpenTelemetry collector |

Next: [upgrades](/operators/upgrades/).
