---
title: Events
description: Every event Kampus publishes, its version, its fields and whether it is audited.
sidebar:
  order: 4
---

<!-- Generated from the declarations of Kampus 0.1.0; do not edit. -->

Modules publish events after their changes commit; listeners in other modules and plugins react to them. **Personal fields** are removed when the person is forgotten; **audited** events are kept in the audit log.

## `events`

Events with their outbox, listeners and the audit log.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `events.any` | 1 | Any event: a listener of it receives every event; it is never published | — | — | no |

## `settings`

Typed settings resolved through the scope tree.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `settings.changed` | 1 | A setting changed in a scope | `key`, `scope` | — | yes |

## `files`

Uploads, de-duplicated storage and permission-checked serving of files.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `files.uploaded` | 1 | A file finished uploading into an area and waits to be attached | `file`, `area`, `size`, `media_type` | — | no |
| `files.attached` | 1 | A file was attached to the record that owns it | `file`, `area` | — | no |
| `files.detached` | 1 | A file was detached from its owner and deleted | `file`, `area` | — | no |
| `files.converted` | 1 | A conversion of some content, such as a thumbnail, finished | `conversion`, `kind`, `blob` | — | no |

## `customise`

Terminology, feature flags, custom fields, layouts, menus and themes resolved through the scope tree.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `customise.changed` | 1 | A customisation changed in a scope | `kind`, `object`, `scope` | — | yes |
| `customise.rule_failed` | 1 | A rule failed to run its actions for an event | `rule`, `event`, `error` | — | yes |

## `users`

Profiles, preferences and system groups.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `users.system_group_members_changed` | 1 | The members of a system group changed | `group` | — | no |

## `courses`

Categories, courses, sections, groups and group sets.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `courses.course_created` | 1 | A course was created | `course`, `category` | — | no |
| `courses.course_state_changed` | 1 | A course moved to another state of its lifecycle | `course`, `from`, `to` | — | yes |
| `courses.course_deleted` | 1 | A course was deleted with everything it owns | `course` | — | yes |

## `enrol`

Method instances, enrolments and requests to join.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `enrol.enrolment_created` | 1 | Someone was enrolled in a course | `enrolment`, `course`, `account`, `instance` | — | no |
| `enrol.enrolment_updated` | 1 | The status or period of an enrolment changed | `enrolment`, `course`, `account`, `status` | — | no |
| `enrol.enrolment_removed` | 1 | An enrolment was removed | `enrolment`, `course`, `account` | — | yes |

## `activities`

Course modules: activities and materials placed in the sections of a course.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `activities.module_created` | 1 | A course module was added to a section | `module`, `section`, `type` | — | no |
| `activities.module_updated` | 1 | A course module changed | `module`, `section`, `type` | — | no |
| `activities.module_moved` | 1 | A course module moved to another place | `module`, `section`, `type` | — | no |
| `activities.module_deleted` | 1 | A course module went to the recycle bin | `module`, `section`, `type` | — | no |
| `activities.module_restored` | 1 | A course module came back from the recycle bin | `module`, `section`, `type` | — | no |
| `activities.module_purged` | 1 | A course module was removed for good | `module`, `section`, `type` | — | no |
| `activities.exception_changed` | 1 | An exception of a course module was granted, changed or removed | `module`, `section`, `type` | — | no |
| `activities.conditions_changed` | 1 | The access conditions of a course module or a section changed | `module`, `section` | — | yes |

## `records`

Academic records: the grade records of a course, their categories and the grades people get.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `records.record_created` | 1 | A grade record was added to a course | `record`, `course` | — | no |
| `records.record_updated` | 1 | A grade record changed | `record`, `course` | — | no |
| `records.record_deleted` | 1 | A grade record was deleted | `record`, `course` | — | no |
| `records.grade_changed` | 1 | The grade of a person on a record changed | `record`, `course`, `account` | `account` | no |
| `records.overridden` | 1 | The grade of a person was overridden, or its override removed | `record`, `course`, `account` | `account` | yes |
| `records.total_changed` | 1 | A total of a person changed with the grades it adds up | `record`, `course`, `account` | `account` | no |
| `records.locked` | 1 | A record or a grade was locked or unlocked | `record`, `course` | `account` | yes |

## `progress`

Progress: whether a person has done what a course module asks, derived from rules and kept apart from teacher decisions.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `progress.activity_changed` | 1 | The state of a person on a course module changed | `module`, `course`, `account`, `state` | `account` | no |
| `progress.rules_changed` | 1 | The rules of a course module changed | `module`, `course` | — | no |
| `progress.exception_changed` | 1 | A teacher decided the state of a person on a course module, or removed the decision | `module`, `course`, `account` | `account` | yes |
| `progress.course_completed` | 1 | A person completed a course | `course`, `account` | `account` | yes |
| `progress.course_revoked` | 1 | The completion of a course by a person was revoked | `course`, `account` | `account` | yes |
| `progress.criteria_changed` | 1 | What a course requires changed | `course` | — | yes |
| `progress.approved` | 1 | Someone of a role approved a person for a criterion of a course | `course`, `criterion`, `account` | `account` | yes |
| `progress.prerequisites_changed` | 1 | The courses a course requires first changed | `course` | — | yes |

## `notify`

Notifications: types declared by modules, the inbox of each person and their preferences, and messaging.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `notify.delivered` | 1 | A notification was delivered to the inbox of a person | `notification`, `type`, `recipient` | `recipient` | no |

## `calendar`

Calendar: entries of campuses, courses and people, and the dates of activities.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `calendar.entry_created` | 1 | A calendar entry was created | `entry` | — | no |
| `calendar.entry_updated` | 1 | A calendar entry changed | `entry` | — | no |
| `calendar.entry_deleted` | 1 | A calendar entry was deleted | `entry` | — | no |
| `calendar.subscription_refreshed` | 1 | A calendar a scope subscribes to was read again | `subscription`, `added`, `changed`, `removed` | — | no |
| `calendar.feed_created` | 1 | A personal calendar feed was made | `feed`, `account` | `account` | yes |
| `calendar.feed_revoked` | 1 | A personal calendar feed was revoked | `feed`, `account` | `account` | yes |

## `privacy`

Privacy: exports of personal data answered by each module, and the policies of a campus.

| Event | Version | What happened | Fields | Personal fields | Audited |
| --- | --- | --- | --- | --- | --- |
| `privacy.request_created` | 1 | A request for personal data was made | `request`, `account` | `account` | yes |
| `privacy.request_completed` | 1 | Every part of a request for personal data was answered | `request`, `account` | `account` | yes |
| `privacy.policy_published` | 1 | A new version of a policy was published | `policy`, `code`, `version` | — | yes |
| `privacy.policy_accepted` | 1 | A person accepted a version of a policy | `policy`, `version`, `account` | `account` | yes |
| `privacy.request_decided` | 1 | A deletion of personal data was approved or rejected | `request`, `account`, `approved` | `account` | yes |
| `privacy.account_erased` | 1 | The personal data of an account was erased | `request`, `account` | `account` | yes |
| `privacy.hold_placed` | 1 | A legal hold was placed | `hold`, `account`, `campus` | `account` | yes |
| `privacy.hold_released` | 1 | A legal hold was released | `hold` | — | yes |
| `privacy.data_purged` | 1 | The data of a deleted account was purged when its retention period ended | `account`, `category` | `account` | yes |
