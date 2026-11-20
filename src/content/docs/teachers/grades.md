---
title: Grades
description: Organising the grade records of your course, setting grades, overriding and locking them, and what learners see.
sidebar:
  order: 4
---

Available since 0.1.0. Totals, scales and letters arrive in later releases.

## The records of a course

The records of a course form a tree. At the top is the course itself, with its total; inside it you add **categories** to group what is graded, and each category has a total of its own. A **grade record** is one graded thing: a manual item you define (an oral exam, participation) or one of the grades an activity gives, which Kampus creates when the activity declares it. A record has a title, a lowest and a highest grade, an optional passing grade, a weight, a multiplier and an offset. The counted grade is the grade multiplied and offset, kept inside the range of the record.

A category is deleted only when it is empty. Manual records can be deleted; the records of an activity disappear with the activity, and a total with its category.

## Setting grades

Choose a record and set the grades of several people at once: up to 500 in one go, all or none. Sending the same grade again changes nothing, so you can repeat an import safely. Every change is kept as an entry with where it came from (the activity, you, an import), who made it and when, and the history of a grade is that list of entries.

## Overriding, locking and hiding

- **Override** a grade when the activity gave one you want to replace. The override counts until you remove it, even if the activity later sends a new grade; the activity grade is still kept next to it.
- **Lock** a record to stop all changes to it and its grades, or one grade to protect it; unlock to change again. Sending the same grade to a locked one is not a change and is accepted; a different one is refused.
- **Hide** a record or a grade until a date. Until then learners do not see it; you still do.

## What people see

A learner sees their own grades when they are shown, and the structure of the records. Whoever may see everyone's grades gets them in the grader report, which loads a page of people at a time; hidden grades are shown only to those who may see hidden content. The same rule applies wherever grades appear, so a hidden grade never leaks through another view.

| Permission | What it allows | Default roles |
| --- | --- | --- |
| `records.view_own` | See the own grades and the structure of the records | Everyone in the course |
| `records.view_all` | See everyone's grades and the grader report | Teachers, non-editing teachers, managers, administrators |
| `records.view_hidden` | See hidden records and grades | Teachers, managers, administrators |
| `records.grade` | Set grades | Teachers, non-editing teachers, managers, administrators |
| `records.override` | Override grades | Teachers, managers, administrators |
| `records.lock` | Lock and unlock records and grades | Teachers, managers, administrators |
| `records.hide` | Hide records and grades until a date | Teachers, managers, administrators |
| `records.manage` | Add and change categories and records | Teachers, managers, administrators |
| `records.export` | Export the grades of a course | Teachers, managers, administrators |
