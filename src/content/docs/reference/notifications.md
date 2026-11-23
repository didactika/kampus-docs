---
title: Notifications
description: Every type of notification, the channels it can use and whether people can turn it off.
sidebar:
  order: 5
---

<!-- Generated from the declarations of Kampus 0.1.0; do not edit. -->

People choose the channels of each type in their notification preferences; a **required** type cannot be turned off.

## `records`

Academic records: the grade records of a course, their categories and the grades people get.

| Type | What it tells | Channels | Required |
| --- | --- | --- | --- |
| `records.grade_posted` | You have a new grade | `inbox` | no |

## `progress`

Progress: whether a person has done what a course module asks, derived from rules and kept apart from teacher decisions.

| Type | What it tells | Channels | Required |
| --- | --- | --- | --- |
| `progress.state_decided` | A teacher decided your progress on an activity | `inbox` | no |
| `progress.course_completed` | You completed a course | `inbox` | no |

## `notify`

Notifications: types declared by modules, the inbox of each person and their preferences, and messaging.

| Type | What it tells | Channels | Required |
| --- | --- | --- | --- |
| `notify.message_received` | You received a message | `inbox`, `push` | no |
