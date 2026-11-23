---
title: Jobs
description: Every background job of Kampus, its attempts and its schedule.
sidebar:
  order: 6
---

<!-- Generated from the declarations of Kampus 0.1.0; do not edit. -->

Jobs run in the `worker` role; scheduled ones are fired by the `scheduler` role (see [operators](/operators/#background-jobs)). Schedules can be changed with `kampus-server tasks schedule`.

## `events`

Events with their outbox, listeners and the audit log.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `events.purge` | Remove events and audit entries past their retention | 3 | `45 3 * * *` UTC |

## `tasks`

Durable job queue and schedules.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `tasks.purge` | Remove finished jobs and their attempts past their retention | 3 | `30 3 * * *` UTC |

## `identity`

Accounts, credentials, sign-in, second factors, sessions and API tokens.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `identity.purge` | Remove expired one-time tokens and sessions, and sign-in attempts past their retention | 3 | `0 3 * * *` UTC |
| `identity.run_deletions` | Delete the accounts whose grace period ended, leaving their tombstones | 5 | `15 * * * *` UTC |

## `files`

Uploads, de-duplicated storage and permission-checked serving of files.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `files.convert` | Make a conversion of some content, such as a thumbnail | 5 | on demand |
| `files.purge` | Remove expired uploads, files nobody attached, and content past its time in the trash | 3 | `20 * * * *` UTC |

## `courses`

Categories, courses, sections, groups and group sets.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `courses.run_deletions` | Delete the courses whose scheduled deletion is due, with everything they own | 5 | `20 * * * *` UTC |

## `enrol`

Method instances, enrolments and requests to join.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `enrol.sync` | Bring the enrolments of every system group instance in step with its group | 5 | `*/15 * * * *` UTC |
| `enrol.run_expiry` | Apply the expiry rule to the enrolments whose end has passed | 5 | `5 * * * *` UTC |

## `activities`

Course modules: activities and materials placed in the sections of a course.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `activities.purge` | Remove the course modules whose time in the recycle bin ended | 3 | `30 3 * * *` UTC |

## `records`

Academic records: the grade records of a course, their categories and the grades people get.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `records.recalculate` | Recalculate the totals of the people whose grades changed | 5 | `* * * * *` UTC |
| `records.export` | Write the files of the exports of grades that were asked for | 3 | `*/5 * * * *` UTC |
| `records.export_expire` | Remove the files of the exports of grades whose week ended | 3 | `45 4 * * *` UTC |

## `progress`

Progress: whether a person has done what a course module asks, derived from rules and kept apart from teacher decisions.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `progress.recalculate` | Re-evaluate the people of the course modules whose rules changed | 5 | `*/5 * * * *` UTC |
| `progress.course_recalculate` | Evaluate the people of a course whose progress may have changed | 5 | `*/5 * * * *` UTC |
| `progress.course_timed` | Queue the people of the courses whose criteria depend on a date or a duration | 3 | `30 2 * * *` UTC |

## `notify`

Notifications: types declared by modules, the inbox of each person and their preferences, and messaging.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `notify.deliver` | Send the notifications of email and push whose time came | 3 | `* * * * *` UTC |
| `notify.message_purge` | Purge the messages every member deleted and those older than their campus keeps | 3 | `40 3 * * *` UTC |

## `calendar`

Calendar: entries of campuses, courses and people, and the dates of activities.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `calendar.refresh` | Read again the calendars scopes subscribe to whose time came | 3 | `*/15 * * * *` UTC |

## `privacy`

Privacy: exports of personal data answered by each module, and the policies of a campus.

| Job | What it does | Attempts | Schedule |
| --- | --- | --- | --- |
| `privacy.run` | Ask each module for its part of the pending privacy requests | 5 | `*/5 * * * *` UTC |
| `privacy.expire` | Forget the exported data whose time ended | 3 | `15 4 * * *` UTC |
| `privacy.retain` | Purge the data of deleted accounts whose retention period ended | 3 | `30 3 * * *` UTC |
