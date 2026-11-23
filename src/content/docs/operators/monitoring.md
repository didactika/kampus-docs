---
title: Monitoring
description: The health of each process, its metrics, its logs, and what to be alerted about.
sidebar:
  order: 4
---

Available since 0.1.0.

## Health

Every role answers on `KAMPUS_SERVER_HTTP_ADDRESS`:

| Path | Answers 200 when |
| --- | --- |
| `/health/live` | The process runs; restart it otherwise |
| `/health/ready` | The database answers and matches the build, and the file store, the cache and the malware scanner, when configured, answer; send no traffic to it otherwise |

The images use them as health checks, and the Helm chart as probes.

## Metrics

Every role serves its metrics at `/metrics`, in the text format of Prometheus. Scrape each process on its own address, inside your network: the path is not served through the web client, and should not be published.

| Metric | What it measures |
| --- | --- |
| `kampus_http_requests_total{method, route, status}` | Requests answered, by the template of their route (`/api/v1/courses/courses/{id}`), never by the path asked |
| `kampus_http_request_duration_seconds{method, route}` | How long requests take, as a histogram from 5 ms to 10 s |
| `kampus_jobs_total{job, outcome}` | Jobs run by the `worker` role, by type and outcome: `succeeded`, `failed` or `timed_out` |
| `kampus_job_duration_seconds{job}` | How long jobs take |
| `kampus_db_connections`, `kampus_db_connections_idle` | The connections of the pool of the process, and those free |
| `kampus_build_info{version}` | The version of the build, always 1 |

## Logs

With `KAMPUS_LOG_FORMAT=json` (the default) every line is a JSON object with its level, message and fields, ready for a log collector; `text` writes lines for people. Every request carries an `x-request-id`, written in its log lines and returned in the answer and in every error, so a person can tell you the id of a failure and you find its lines. `KAMPUS_LOG_LEVEL` takes a level or a filter such as `info,kampus_identity=debug`.

## What to be alerted about

| Alert | Rule of thumb |
| --- | --- |
| A process is not ready | `/health/ready` fails for more than a minute |
| Errors | The share of 5xx answers in `kampus_http_requests_total` goes over 1% for five minutes |
| Slow answers | The 95th percentile of `kampus_http_request_duration_seconds` goes over 500 ms for ten minutes |
| The pool is full | `kampus_db_connections_idle` stays at 0 while requests wait: add connections or pods |
| Jobs fail | `kampus_jobs_total{outcome!="succeeded"}` grows: see `kampus-server tasks jobs failed` |
| Dead deliveries | `kampus-server events deliveries dead` lists any |
