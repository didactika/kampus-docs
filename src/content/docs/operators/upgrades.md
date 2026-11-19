---
title: Upgrades
description: Upgrade from any supported release to the latest one in one run.
sidebar:
  order: 1
---

## One run, from any supported release

You never upgrade release by release. Every module keeps all its upgrade steps, so a campus on any supported release reaches the target release in one run:

1. Back up the database and the file storage.
2. Run the new image with `kampus-server upgrade`. It applies every pending step of every module in order, then the data upgrade jobs.
3. Start the new image in its roles.

The server refuses to start when its code is older than the database, or when an upgrade step it knows was changed, so a wrong image never touches your data. Several instances started at the same time upgrade one after the other, and a database that holds other Kampus installations (other prefixes) needs `--new-installation` before a new one is created next to them.

## Components, versions and history

Every module, plugin and adapter of the build is a component with its own version. The installation records the version of each and every run that changed them.

| Command | Does |
| --- | --- |
| `kampus-server components` | Lists every component of the build and of the installation: versions, maturity, state and what each lacks; `--json` for scripts |
| `kampus-server history` | Shows the latest upgrades, downgrades and uninstalls, with what each did to each component, failed runs included |
| `kampus-server check` | Says whether the installation matches the build, without changing it |
| `kampus-server upgrade` | Applies the pending steps and registers the new versions |
| `kampus-server downgrade --yes` | Run with an older build: undoes the newer steps and takes the components back; refused, naming the steps, when one cannot be undone |
| `kampus-server uninstall <component> --yes` | Removes a component you took out of the build, with its data, unless another component requires it |

Kampus refuses to start when a component is installed in a newer version than the build, when a component is installed but missing from the build, or when the components of the build do not fit together (names, supported releases, requirements); the message lists every problem.

## Zero downtime

Upgrade steps only **add** to the database within a release (expand); what the new code no longer reads is removed by a later release (contract). The previous release therefore still runs on the upgraded database: you can roll the new image out instance by instance, and roll back by running the previous image, without restoring anything.

## What keeps working

Within a major version, the HTTP API, the plugin SDK, event payloads, settings and configuration variables only change in a compatible way. Anything removed is deprecated first, keeps working, is announced in the [changelog](/releases/changelog/) and disappears only in the next major version, with its upgrade step.

## Support

The latest minor version of the current major version, and the last minor version of the previous major version, receive security and bug fixes. Each release states when support ends for the versions it replaces.
