---
title: Settings
description: Every setting of Kampus, what it accepts, where it can be set and who may change it.
sidebar:
  order: 2
---

<!-- Generated from the declarations of Kampus 0.1.0; do not edit. -->

A setting is resolved through the scopes, from the platform down to the place where it is read; a lower scope overrides a higher one unless the higher one locks it. **Levels** are the scopes where it can be set.

## `identity`

Accounts, credentials, sign-in, second factors, sessions and API tokens.

| Setting | What it does | Accepts | Levels | Permission | Restart |
| --- | --- | --- | --- | --- | --- |
| `identity.self_sign_up` | Whether visitors may sign up by themselves | yes or no (default `false`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.allowed_domains` | The email domains allowed to sign up, separated by commas; empty allows any | text up to 2000 characters | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.password_min_length` | The shortest password | a whole number from 8 to 128 (default `12`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.second_factor_required` | Whether every account needs a second factor | yes or no (default `false`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.confirmation_hours` | How long a confirmation link lasts, in hours | a whole number from 1 to 168 (default `24`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.invitation_days` | How long an invitation link lasts, in days | a whole number from 1 to 90 (default `7`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.recovery_minutes` | How long a recovery link lasts, in minutes | a whole number from 5 to 1440 (default `30`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.session_idle_hours` | How long a session lasts without being used, in hours | a whole number from 1 to 720 (default `8`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.session_lifetime_days` | How long a session lasts at most, in days | a whole number from 1 to 365 (default `7`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.step_up_minutes` | How old the last sign-in may be for a sensitive operation, in minutes | a whole number from 1 to 1440 (default `15`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.token_default_days` | The lifetime of an API token when none is asked, in days | a whole number from 1 to 3650 (default `90`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.token_max_days` | The longest lifetime of an API token, in days | a whole number from 1 to 3650 (default `365`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.deletion_grace_days` | The grace period before a deletion runs, in days | a whole number from 0 to 365 (default `14`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.attempt_retention_days` | How long sign-in attempts are kept, in days | a whole number from 1 to 3650 (default `30`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.throttle_slow_after` | Failed sign-ins after which each new try waits longer | a whole number from 1 to 1000 (default `3`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.throttle_lock_after` | Failed sign-ins after which sign-in locks | a whole number from 1 to 1000 (default `10`) | `platform`, `campus` | `identity.policy.manage` | no |
| `identity.throttle_lock_minutes` | How long a sign-in lock lasts, in minutes | a whole number from 1 to 1440 (default `15`) | `platform`, `campus` | `identity.policy.manage` | no |

## `courses`

Categories, courses, sections, groups and group sets.

| Setting | What it does | Accepts | Levels | Permission | Restart |
| --- | --- | --- | --- | --- | --- |
| `courses.group_mode` | Whether people work in groups: none, separate (each group on its own) or visible | one of `none`, `separate`, `visible` (default `none`) | `course`, `section`, `activity` | `courses.groups.manage` | no |

## `progress`

Progress: whether a person has done what a course module asks, derived from rules and kept apart from teacher decisions.

| Setting | What it does | Accepts | Levels | Permission | Restart |
| --- | --- | --- | --- | --- | --- |
| `progress.notify` | Whether the people of a course are told when they complete it or a teacher decides their progress | yes or no (default `true`) | `campus`, `category`, `course` | `progress.manage` | no |

## `notify`

Notifications: types declared by modules, the inbox of each person and their preferences, and messaging.

| Setting | What it does | Accepts | Levels | Permission | Restart |
| --- | --- | --- | --- | --- | --- |
| `notify.messaging` | Who may write to whom: people who take part in a course together, anyone of the campus, or nobody | one of `course`, `campus`, `nobody` (default `course`) | `campus` | `notify.defaults.manage` | no |
| `notify.message_retention_days` | How many days messages are kept before they are removed; 0 keeps them until every member deletes them | a whole number from 0 to 3650 (default `0`) | `campus` | `notify.defaults.manage` | no |
