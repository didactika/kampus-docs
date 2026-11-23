---
title: Activities and materials
description: Adding pages and files to your course, placing and moving them, and getting back what you delete.
sidebar:
  order: 3
---

<!-- covers: addActivity, restrictAccess, grantException, copyActivity, deleteActivity -->

Available since 0.1.0.

## Adding content

Each section of your course holds **course modules**: the activities people do and the materials they read. You add one by choosing its type, giving it a title and placing it in a section, first, last or next to another. Kampus provides two materials today:

| Type | What it is |
| --- | --- |
| Page | A page of text |
| File | A file to download, such as a syllabus or slides |

Other parts of Kampus add more types, such as quizzes or assignments, and they appear in the same list.

For each course module you choose whether it is **shown**, **hidden** or **shown only for a while**, and whether it is listed on the course page. A hidden module, or one in a hidden section, is not seen by learners; you still see it, marked as hidden. The file of a material can be read by exactly the people who can see the material.

## Changing, moving and copying

You can edit a course module at any time; if someone else changed it meanwhile, Kampus tells you instead of overwriting their work. Move a module to another place in its section, or to another section of the same course; copy it to any section, and a copied file material gets its own copy of the file without using more space for the same content.

## The recycle bin

Deleting a course module sends it to the recycle bin of the course, where it stays 30 days. From there you can restore it to the place where it was, as long as its section still exists. After 30 days Kampus removes it for good, with its file; if removing fails, it stays in the bin with the reason so you can see it.

## Exceptions for a person or a group

Some types, such as quizzes and assignments, let you give one person or one group a different opening or closing date, due date, cut-off date, time limit or number of attempts, without changing the activity for everyone else. Each person or group has at most one exception per course module; granting another replaces it, and you can add a reason. Kampus decides what applies to someone in this order, setting by setting: their own exception, then the most generous of the exceptions of the groups they belong to (the earliest opening, the latest closing, the largest limit), then the activity itself. A type that does not support exceptions, such as a page, refuses them.

## Restricting access

You can say who may open a course module, or everything in a section, with **access conditions**. Each condition is one of these:

| Condition | It holds when |
| --- | --- |
| Date | Now is after a moment, before a moment, or between both |
| Group | The person belongs to a group you choose, to one of the groups of a set, or to any group of the course |
| Profile | A field of their profile (name, display name, language, time zone) is, is not, contains, starts or ends with a value, or is empty |
| Progress | Another course module of the course is done, not done, passed or failed |
| Grade | A grade of the course is at least a percentage of its range, below one, or between both |

You combine them in a tree: **all** of them, **any** of them, or **not** one of them, and you can nest these as deep as ten levels. Conditions on a section apply to every course module in it and in its subsections, together with their own.

When someone does not meet the conditions, you choose whether they still see the course module listed, without its content, so they know what they have to do, or they do not see it at all. Grades and progress are read as Kampus keeps them, even when the person cannot see their grade yet. Teachers and whoever holds `activities.conditions.ignore` open everything.

Deleting a course module that a progress condition depends on is refused, so you never break a path by accident; you can instead choose to remove those conditions while deleting it. If a group, a set or a grade record that a condition depends on is deleted, that condition can no longer hold: the tree shows it as broken, and the course module stays closed until you fix it.

| Permission | What it allows | Default roles |
| --- | --- | --- |
| `activities.module.manage` | Add, change, move, copy, delete and restore course modules | Administrators, Manager, Teacher, Section leader |
| `activities.exception.manage` | Grant, change and remove exceptions of dates, time limits and attempts | Administrators, Manager, Teacher, Section leader |
| `activities.conditions.manage` | Set and remove the access conditions of course modules and sections | Administrators, Manager, Teacher, Section leader |
| `activities.conditions.ignore` | Open course modules whatever their conditions say | Administrators, Manager, Teacher, Section leader |
