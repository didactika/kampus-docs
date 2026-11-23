---
title: Backup and restore
description: What to back up, how often, and how to bring an installation back from a backup.
sidebar:
  order: 3
---

Available since 0.1.0.

## What to back up

| Piece | Why | How often |
| --- | --- | --- |
| The database | Everything except the content of files | Every day, and before every upgrade |
| The files | The content of every file, kept by its hash | Every day; content is never changed in place, so each backup only adds |
| The secret key (`KAMPUS_SECURITY_SECRET_KEY`) | Second-factor secrets and signed links are sealed with it | Once, kept apart from the backups |
| The configuration (`.env`, `config.toml` or the values and Secret of the release) | To start an identical installation | When it changes |

Restore the database and the files of the same moment: a file the database names but the store lacks cannot be read, and content the database no longer names is removed after seven days.

## With Docker Compose

From `deploy/compose`:

```sh
# The database, compressed
docker compose exec -T postgres pg_dump -U kampus -Fc kampus > kampus-$(date +%F).dump
# The files
docker run --rm -v kampus_files:/files -v "$PWD":/backup alpine:3.22 \
  tar -czf /backup/kampus-files-$(date +%F).tar.gz -C /files .
```

Copy both, with the configuration, to another machine or a bucket. Check now and then that a backup restores, on another server.

## With Kubernetes

Back up PostgreSQL with the tools of your platform (snapshots or `pg_dump`) and the bucket of files with its versioning or replication. Keep the Secret of the release, or the place your secrets come from.

## Restoring

1. Stop Kampus so nothing writes: `docker compose stop kampus web` (or scale the Deployments to zero).
2. Restore the database into an empty one:

   ```sh
   docker compose exec -T postgres dropdb -U kampus kampus
   docker compose exec -T postgres createdb -U kampus kampus
   docker compose exec -T postgres pg_restore -U kampus -d kampus < kampus-<date>.dump
   ```

3. Restore the files of the same day into the volume (or the bucket):

   ```sh
   docker run --rm -v kampus_files:/files -v "$PWD":/backup alpine:3.22 \
     sh -c "rm -rf /files/* && tar -xzf /backup/kampus-files-<date>.tar.gz -C /files"
   ```

4. Start again with the same secret key: `docker compose up -d`. If the backup comes from an older release, the setup applies its upgrade steps before Kampus serves.
