---
title: Settings and activity of the campus
description: Changing the settings of the campus, following its background tasks and deliveries, and reading its audit log.
sidebar:
  order: 9
---

<!-- covers: changeSetting, monitorTasks, retryDeliveries, reviewAuditLog -->

Available since 0.1.0.

## Settings

Every part of Kampus declares its settings, which you set for the campus, a category, a course or a section, as each setting allows. A place takes the value of the nearest place above that sets it, unless that place **locks** it; locking a value for the campus keeps every course from changing it. Every change is recorded with the value before and after, and you can go back to the value from above at any time. The [settings reference](/reference/settings/) lists every setting with what it accepts and who may change it. Until the administration pages arrive, settings are changed with the commands in the [operator guide](/operators/#settings).

## Background tasks

Work that does not happen while someone waits, such as deleting accounts whose grace period ended or keeping system group enrolments in step, runs as **jobs**. Scheduled jobs run on their own; you can see the latest jobs and their state, retry one that failed and change a schedule (see [background jobs](/operators/#background-jobs) and the [jobs reference](/reference/jobs/)).

## Deliveries

Parts of Kampus tell each other what changed through events. A delivery that keeps failing is retried with a growing wait and, after eight attempts, waits for you as **dead**; the events after it go on. Once you have fixed what made it fail, run the dead deliveries again (see [events and the audit log](/operators/#events-and-the-audit-log)).

## Audit log

Significant changes, such as giving a role, removing an enrolment, overriding a grade or archiving a course, are written in the audit log with who made them, when and what changed. Nobody can change an entry, and entries are kept for two years. Managers read the entries of the places they manage.
