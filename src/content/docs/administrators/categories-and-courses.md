---
title: Categories and courses
description: The category tree of a campus, creating courses, their lifecycle, hidden content and deleting.
sidebar:
  order: 3
---

Available since 0.1.0.

## Categories

Courses live in a tree of categories under the campus. A category can hold courses and other categories, as deep as you need. With `courses.category.manage` you create, rename, describe, move and delete categories; holding it in a category lets you manage everything below it.

The order of categories is your own: you place each one first, last, or right before or after another, and moving one never changes the others. A category's code is optional and unique in the campus, whatever its capital letters. You can only delete an empty category: move or delete its courses and categories first.

Moving a category moves everything in it, and the roles people hold there move with it.

## Creating a course

With `courses.course.create` in a category, a person creates courses in it. A new course is a **draft** with one untitled section. Its creator becomes its **owner** and a **teacher** in it, so they can prepare it straight away. A course's short name is unique in the campus, whatever its capital letters, and so is its code when it has one. When a course has dates, it ends after it starts.

Give the **Course creator** role in a category to the people who should create courses there.

## Lifecycle

| State | What it means |
| --- | --- |
| Draft | Being prepared |
| Published | Open to its participants |
| Archived | Kept read-only: nothing in it can change until it is published again |
| Deletion scheduled | Deleted when the grace period ends (14 days) |

Teachers publish a course and take it back to draft, as long as nobody takes part in it. Archiving and unarchiving need `courses.course.archive`. Its owners, or people with `courses.course.delete`, schedule its deletion from any state, and cancelling it brings the course back to draft. A teacher who does not own the course cannot delete it.

## Hidden content

Each category, course and section is shown, hidden, or shown only between two dates. Hiding something never changes what is inside it: a learner sees a course only when the course and every category above it are shown, so hiding a category and showing it again brings back exactly what was there, including a course that was hidden on its own.

People with `courses.hidden.view` see hidden content, marked as hidden. Administrators, managers, teachers, non-editing teachers and section leaders hold it in their scope.

## Course permissions

| Permission | What it allows | Default roles |
| --- | --- | --- |
| `courses.category.manage` | Create, edit, move and delete categories | Administrators, Manager |
| `courses.course.create` | Create courses in a category | Administrators, Manager, Course creator |
| `courses.course.update` | Edit a course, publish it and take it back to draft | Administrators, Manager, Teacher |
| `courses.course.archive` | Archive a course and bring it back | Administrators, Manager, Teacher |
| `courses.course.delete` | Schedule and cancel the deletion of a course; its owners may too | Administrators, Manager |
| `courses.hidden.view` | See hidden categories, courses and sections | Administrators, Manager, Teacher, Non-editing teacher, Section leader |
| `courses.section.manage` | Add, edit, move, hide and delete sections | Administrators, Manager, Teacher, Section leader |
| `courses.groups.manage` | Create groups and group sets and manage their members | Administrators, Manager, Teacher |
| `courses.groups.access_all` | See and work with every group | Administrators, Manager, Teacher, Non-editing teacher |
