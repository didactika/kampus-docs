---
title: Installing on Kubernetes
description: Installing Kampus with its Helm chart, each role scaled on its own, with PostgreSQL, Valkey and an S3 store you run.
sidebar:
  order: 2
---

Available since 0.1.0.

The chart `deploy/helm/kampus` of the repository installs Kampus with each role in its own Deployment (`server`, `worker` and `scheduler`), the web client and an Ingress. It does not run PostgreSQL, Valkey or the file store: use the services of your platform or your own, since their backups and upgrades are yours.

## What you need

| Need | Detail |
| --- | --- |
| Kubernetes | 1.29 or later, Helm 3.14 or later, an ingress controller and a way to get certificates (such as cert-manager) |
| PostgreSQL | 17, with a database and a user for Kampus |
| Valkey or Redis | For the cache shared by every pod |
| An S3-compatible store | For files, since every pod reads and writes them |
| Images | The images of Kampus and of the web client in a registry your cluster can pull from (see below) |

## 1. Images

Build the two images from the repository at the release tag and push them to your registry:

```sh
docker build -t registry.example.org/kampus:0.1.0 .
docker build -f web/Dockerfile -t registry.example.org/kampus-web:0.1.0 .
docker push registry.example.org/kampus:0.1.0
docker push registry.example.org/kampus-web:0.1.0
```

## 2. The secret

Keep the secrets in a Secret of your own rather than in the values of the release:

```sh
kubectl create namespace kampus
kubectl -n kampus create secret generic kampus-secrets \
  --from-literal=KAMPUS_DATABASE_URL='postgres://kampus:<password>@postgres.example.org:5432/kampus' \
  --from-literal=KAMPUS_SECURITY_SECRET_KEY="$(head -c 32 /dev/urandom | base64 | tr -d =)" \
  --from-literal=KAMPUS_ADMIN_EMAIL='admin@example.org' \
  --from-literal=KAMPUS_ADMIN_USERNAME='admin' \
  --from-literal=KAMPUS_ADMIN_PASSWORD='<a password of 12 characters or more, without spaces>' \
  --from-literal=KAMPUS_STORAGE_S3_ACCESS_KEY_ID='<key>' \
  --from-literal=KAMPUS_STORAGE_S3_SECRET_ACCESS_KEY='<secret>' \
  --from-literal=KAMPUS_MAIL_URL='smtp://user:password@smtp.example.org:587'
```

Copy the secret key somewhere safe: a backup cannot be restored without it.

## 3. The values

```yaml
# values.yaml
image: { repository: registry.example.org/kampus, tag: "0.1.0" }
webImage: { repository: registry.example.org/kampus-web, tag: "0.1.0" }
siteUrl: https://campus.example.org
existingSecret: kampus-secrets
config:
  KAMPUS_STORAGE_URL: s3://kampus-files/files
  KAMPUS_STORAGE_S3_ENDPOINT: https://s3.example.org
  KAMPUS_STORAGE_S3_REGION: eu-west-1
  KAMPUS_CACHE_URL: valkey://valkey.example.org:6379
  KAMPUS_MAIL_FROM: Campus <no-reply@example.org>
  KAMPUS_SERVER_TRUSTED_PROXIES: 10.0.0.0/8
ingress:
  className: nginx
  host: campus.example.org
  annotations: { cert-manager.io/cluster-issuer: letsencrypt }
  tls: { enabled: true, secretName: kampus-tls }
roles:
  server: { replicas: 3 }
  worker: { replicas: 2 }
```

Every key of `config` is an environment variable of every Kampus process (see [the configuration file](/operators/#the-configuration-file)). Set `KAMPUS_SERVER_TRUSTED_PROXIES` to the networks of your pods and your ingress controller, and nothing wider: Kampus believes the address of people that those networks forward, and counts sign-in failures by it.

## 4. Install

```sh
helm install kampus ./deploy/helm/kampus -n kampus -f values.yaml
kubectl -n kampus get pods -w
```

The Job `kampus-setup-1` installs Kampus on the empty database and exits; the Kampus pods wait for it in their init container, which runs `kampus-server check` until the database matches the build. Then open `https://campus.example.org` and sign in as the administrator.

## Upgrading

```sh
helm upgrade kampus ./deploy/helm/kampus -n kampus -f values.yaml --set image.tag=<new> --set webImage.tag=<new>
```

Each revision runs its own setup Job (`kampus-setup-<revision>`), which applies the upgrade steps; the new pods start once the database matches them, while the old ones keep serving (see [zero downtime](/operators/upgrades/#zero-downtime)). Back up the database first.

## Sizing

| Role | Scale by | Start with |
| --- | --- | --- |
| `server` | Requests; each pod holds `KAMPUS_DATABASE_POOL_SIZE` connections | 2, 250m CPU, 256 MiB |
| `worker` | The jobs waiting (`kampus_jobs_total` grows slower than the queue) | 1 |
| `scheduler` | Never more than needed: each schedule fires once whatever the number | 1 |
| `web` | Page loads | 2 |

Keep the sum of the pools of every pod under the connections PostgreSQL allows, or put PgBouncer in `session` mode in front of it (see [database connections](/operators/#database-connections)).
