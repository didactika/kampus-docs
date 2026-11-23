---
title: Installing with Docker Compose
description: A complete installation on one server, with HTTPS, from an empty machine to the first sign-in.
sidebar:
  order: 1
---

Available since 0.1.0.

This guide installs Kampus on one server with Docker Compose: PostgreSQL, Valkey, Kampus in one process (`all`), the web client and Caddy, which gets and renews the HTTPS certificate. It suits a campus of up to a few thousand people; beyond that, see [installing on Kubernetes](/operators/installation-kubernetes/).

## What you need

| Need | Detail |
| --- | --- |
| A server | Linux with 2 CPU, 4 GB of memory and 20 GB of disk to start; more disk as files grow |
| Docker | Docker Engine 27 or later with the Compose plugin |
| A domain | A name such as `campus.example.org` whose DNS points at the server, and ports 80 and 443 open, so Caddy can get the certificate |
| Mail (optional) | An SMTP server, for invitations, recovery links and notifications by email |

## 1. Get Kampus

```sh
git clone --branch v0.1.0 https://github.com/didactika/kampus.git
cd kampus/deploy/compose
cp .env.example .env
```

Everything you set lives in `.env`, next to `compose.yaml`. Keep it out of version control and readable only by you (`chmod 600 .env`).

## 2. Fill `.env`

Make the two secrets first, each once, with any small image:

```sh
docker run --rm alpine:3.22 sh -c "head -c 32 /dev/urandom | base64 | tr -d ="   # KAMPUS_SECURITY_SECRET_KEY
docker run --rm alpine:3.22 sh -c "head -c 24 /dev/urandom | base64 | tr -d =/+"  # POSTGRES_PASSWORD
```

| Variable | What to put |
| --- | --- |
| `KAMPUS_DOMAIN` | The domain, without `https://` |
| `POSTGRES_PASSWORD` | The second value above |
| `KAMPUS_SECURITY_SECRET_KEY` | The first value above: 32 random bytes in base64 (`kampus-server secret-key` makes one too). It seals second-factor secrets and signs links; losing it means people set up their second factors again |
| `KAMPUS_ADMIN_EMAIL`, `KAMPUS_ADMIN_USERNAME`, `KAMPUS_ADMIN_PASSWORD` | The first administrator, created on the first start only. The password has at least 12 characters, no spaces, and does not contain the username or the email |
| `KAMPUS_MAIL_URL`, `KAMPUS_MAIL_FROM` | `smtp://user:password@smtp.example.org:587` and `Campus <no-reply@example.org>`; leave both empty to send no mail |
| `KAMPUS_HELP_URL` | The address of the handbook the help of each screen opens; empty for none |

Write the secret key and the database password somewhere safe as well: a backup cannot be restored without them.

## 3. Build and start it

```sh
docker compose up -d --build
```

The first build takes several minutes; later ones reuse what did not change. The `setup` service then installs Kampus on the empty database (the first campus, its roles and the administrator) and exits; Kampus, the web client and Caddy start after it. Follow it with `docker compose logs -f setup kampus`. When `docker compose ps` shows `kampus` as healthy, open `https://<your domain>` and sign in as the administrator.

## Upgrading

```sh
git fetch --tags && git checkout v<new version>
docker compose up -d --build
```

`setup` runs again before Kampus starts: it applies the upgrade steps from whichever release the installation is on (see [upgrades](/operators/upgrades/)) and changes nothing when there are none. Take a backup first.

## What runs

| Service | Role |
| --- | --- |
| `postgres` | The database, in the volume `database` |
| `valkey` | The cache, in the volume `cache` |
| `setup` | Installs or upgrades, then exits |
| `kampus` | The API, the background jobs and the schedules (`all`), with the files in the volume `files` |
| `web` | The web client; it reaches the API inside the network |
| `proxy` | Caddy: HTTPS on ports 80 and 443, in front of the web client |

Only Caddy is published. Kampus believes the address of people that the web client forwards because it reaches Kampus only inside this network (`KAMPUS_SERVER_TRUSTED_PROXIES`, see [the configuration file](/operators/#the-configuration-file)).
