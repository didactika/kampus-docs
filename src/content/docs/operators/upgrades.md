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

## Zero downtime

Upgrade steps only **add** to the database within a release (expand); what the new code no longer reads is removed by a later release (contract). The previous release therefore still runs on the upgraded database: you can roll the new image out instance by instance, and roll back by running the previous image, without restoring anything.

## What keeps working

Within a major version, the HTTP API, the plugin SDK, event payloads, settings and configuration variables only change in a compatible way. Anything removed is deprecated first, keeps working, is announced in the [changelog](/releases/changelog/) and disappears only in the next major version, with its upgrade step.

## Support

The latest minor version of the current major version, and the last minor version of the previous major version, receive security and bug fixes. Each release states when support ends for the versions it replaces.
