---
title: Permissions
description: Every permission of Kampus, its kind, its risks, the lowest scope it applies to and the roles that grant it.
sidebar:
  order: 1
---

<!-- Generated from the declarations of Kampus 0.1.0; do not edit. -->

A permission is allowed, denied or forbidden in a scope by the roles a person holds there (see [roles and permissions](/administrators/roles-and-permissions/)). **Granted by** lists the role templates that allow it out of the box; a campus can change them.

## `access`

Scopes, principals, roles, grants, overrides and permission checks.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `access.grant.create` | write | `trust_escalation` | section | `campus_administrator`, `manager`, `platform_administrator`, `section_leader`, `teacher` |
| `access.grant.delete` | write | `trust_escalation` | section | `campus_administrator`, `manager`, `platform_administrator` |
| `access.override.update` | write | `trust_escalation` | activity | `campus_administrator`, `manager`, `platform_administrator` |
| `access.override.risky` | write | `trust_escalation` | activity | `campus_administrator`, `platform_administrator` |
| `access.role.manage` | write | `trust_escalation`, `configuration` | campus | `campus_administrator`, `platform_administrator` |
| `access.scope.freeze` | write | `data_loss` | activity | `campus_administrator`, `platform_administrator` |
| `access.view_as` | read | — | activity | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `access.review` | read | `personal_data` | activity | `campus_administrator`, `manager`, `non_editing_teacher`, `platform_administrator`, `section_leader`, `teacher` |

## `identity`

Accounts, credentials, sign-in, second factors, sessions and API tokens.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `identity.account.invite` | write | `personal_data`, `spam` | campus | `campus_administrator`, `manager`, `platform_administrator` |
| `identity.account.suspend` | write | `personal_data` | campus | `campus_administrator`, `manager`, `platform_administrator` |
| `identity.account.delete` | write | `personal_data`, `data_loss` | campus | `campus_administrator`, `platform_administrator` |
| `identity.account.read` | read | `personal_data` | campus | `campus_administrator`, `manager`, `platform_administrator` |
| `identity.provider.manage` | write | `trust_escalation`, `configuration` | campus | `campus_administrator`, `platform_administrator` |
| `identity.token.manage_own` | write | — | campus | `authenticated_user`, `campus_administrator`, `manager`, `platform_administrator` |
| `identity.token.manage_any` | write | `trust_escalation` | campus | `campus_administrator`, `platform_administrator` |
| `identity.policy.manage` | write | `configuration`, `trust_escalation` | campus | `campus_administrator`, `platform_administrator` |

## `files`

Uploads, de-duplicated storage and permission-checked serving of files.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `files.quota.manage` | write | `configuration` | course | `campus_administrator`, `manager`, `platform_administrator` |

## `customise`

Terminology, feature flags, custom fields, layouts, menus and themes resolved through the scope tree.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `customise.term.manage` | write | `configuration` | section | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `customise.flag.manage` | write | `configuration` | section | `campus_administrator`, `manager`, `platform_administrator` |
| `customise.field.manage` | write | `configuration`, `data_loss` | course | `campus_administrator`, `manager`, `platform_administrator` |
| `customise.field.view` | read | `personal_data` | activity | `campus_administrator`, `manager`, `non_editing_teacher`, `platform_administrator`, `teacher` |
| `customise.field.edit` | write | — | activity | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `customise.layout.manage` | write | `configuration` | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `customise.menu.manage` | write | `configuration` | course | `campus_administrator`, `manager`, `platform_administrator` |
| `customise.theme.manage` | write | `configuration` | course | `campus_administrator`, `manager`, `platform_administrator` |
| `customise.rule.manage` | write | `configuration` | course | `campus_administrator`, `manager`, `platform_administrator` |
| `customise.package.manage` | write | `configuration` | course | `campus_administrator`, `manager`, `platform_administrator` |

## `users`

Profiles, preferences and system groups.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `users.profile.update_own` | write | — | campus | `authenticated_user`, `campus_administrator`, `manager`, `platform_administrator` |
| `users.profile.update_any` | write | `personal_data` | campus | `campus_administrator`, `manager`, `platform_administrator` |
| `users.system_group.manage` | write | `personal_data` | category | `campus_administrator`, `manager`, `platform_administrator` |

## `courses`

Categories, courses, sections, groups and group sets.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `courses.category.manage` | write | `configuration`, `data_loss` | category | `campus_administrator`, `manager`, `platform_administrator` |
| `courses.course.create` | write | — | category | `campus_administrator`, `course_creator`, `manager`, `platform_administrator` |
| `courses.course.update` | write | — | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `courses.course.archive` | write | — | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `courses.course.delete` | write | `data_loss` | course | `campus_administrator`, `manager`, `platform_administrator` |
| `courses.hidden.view` | read | — | section | `campus_administrator`, `manager`, `non_editing_teacher`, `platform_administrator`, `section_leader`, `teacher` |
| `courses.section.manage` | write | — | section | `campus_administrator`, `manager`, `platform_administrator`, `section_leader`, `teacher` |
| `courses.groups.manage` | write | `personal_data` | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `courses.groups.access_all` | read | `personal_data` | section | `campus_administrator`, `manager`, `non_editing_teacher`, `platform_administrator`, `teacher` |

## `enrol`

Method instances, enrolments and requests to join.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `enrol.instance.manage` | write | `trust_escalation` | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `enrol.enrolment.manage` | write | `personal_data`, `trust_escalation` | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `enrol.enrolment.read` | read | `personal_data` | course | `campus_administrator`, `manager`, `non_editing_teacher`, `platform_administrator`, `teacher` |
| `enrol.request.decide` | write | `personal_data` | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `enrol.self` | write | — | course | `authenticated_user`, `campus_administrator`, `manager`, `platform_administrator` |

## `activities`

Course modules: activities and materials placed in the sections of a course.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `activities.module.manage` | write | `data_loss` | activity | `campus_administrator`, `manager`, `platform_administrator`, `section_leader`, `teacher` |
| `activities.exception.manage` | write | — | activity | `campus_administrator`, `manager`, `platform_administrator`, `section_leader`, `teacher` |
| `activities.conditions.manage` | write | — | activity | `campus_administrator`, `manager`, `platform_administrator`, `section_leader`, `teacher` |
| `activities.conditions.ignore` | read | — | activity | `campus_administrator`, `manager`, `platform_administrator`, `section_leader`, `teacher` |

## `records`

Academic records: the grade records of a course, their categories and the grades people get.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `records.view_own` | read | — | course | `campus_administrator`, `learner`, `manager`, `non_editing_teacher`, `platform_administrator`, `teacher` |
| `records.view_all` | read | `personal_data` | course | `campus_administrator`, `manager`, `non_editing_teacher`, `platform_administrator`, `teacher` |
| `records.view_hidden` | read | `personal_data` | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `records.grade` | write | — | course | `campus_administrator`, `manager`, `non_editing_teacher`, `platform_administrator`, `teacher` |
| `records.override` | write | — | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `records.lock` | write | — | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `records.hide` | write | — | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `records.manage` | write | `data_loss` | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `records.export` | read | `personal_data` | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |

## `progress`

Progress: whether a person has done what a course module asks, derived from rules and kept apart from teacher decisions.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `progress.view_own` | read | — | activity | `campus_administrator`, `learner`, `manager`, `non_editing_teacher`, `platform_administrator`, `teacher` |
| `progress.view_all` | read | `personal_data` | activity | `campus_administrator`, `manager`, `non_editing_teacher`, `platform_administrator`, `teacher` |
| `progress.mark_own` | write | — | activity | `learner` |
| `progress.exception` | write | — | activity | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `progress.manage` | write | — | activity | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |
| `progress.tracked` | read | — | activity | `learner` |

## `notify`

Notifications: types declared by modules, the inbox of each person and their preferences, and messaging.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `notify.template.manage` | write | `configuration`, `spam` | campus | `campus_administrator`, `platform_administrator` |
| `notify.defaults.manage` | write | `configuration` | campus | `campus_administrator`, `platform_administrator` |
| `notify.message.attach` | write | `spam` | campus | `authenticated_user`, `campus_administrator`, `platform_administrator` |
| `notify.message.anyone` | write | `spam` | campus | `campus_administrator`, `platform_administrator` |

## `calendar`

Calendar: entries of campuses, courses and people, and the dates of activities.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `calendar.view` | read | — | course | `campus_administrator`, `learner`, `manager`, `non_editing_teacher`, `platform_administrator`, `teacher` |
| `calendar.manage` | write | — | course | `campus_administrator`, `manager`, `platform_administrator`, `teacher` |

## `privacy`

Privacy: exports of personal data answered by each module, and the policies of a campus.

| Permission | Kind | Risks | Lowest scope | Granted by |
| --- | --- | --- | --- | --- |
| `privacy.request.manage` | read | `personal_data` | campus | `campus_administrator`, `platform_administrator` |
| `privacy.request.approve` | write | `data_loss`, `personal_data` | campus | `campus_administrator`, `platform_administrator` |
| `privacy.hold.manage` | write | `personal_data` | campus | `campus_administrator`, `platform_administrator` |
| `privacy.retention.manage` | write | `data_loss` | campus | `campus_administrator`, `platform_administrator` |
| `privacy.policy.manage` | write | `configuration` | campus | `campus_administrator`, `platform_administrator` |
