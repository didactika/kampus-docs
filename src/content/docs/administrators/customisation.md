---
title: Customisation
description: The words your campus uses, features you turn off, and custom fields on courses, set per scope.
sidebar:
  order: 4
---

Available since 0.1.0.

Customisation changes Kampus without code. Everything here is set in a scope (the platform, a campus, a category, a course or a section) and applies there and below: the nearest scope that sets something wins, unless a scope above **locks** it. Every answer says where its value came from, and every change is recorded with who made it, before and after.

## The words of your campus

Kampus calls things by their usual names: course, category, section. With `customise.term.manage` you rename them, per language, with a singular and a plural: a faculty can call its courses "subjects" while another keeps "courses". A language you do not rename keeps the declared word, and removing your word brings back the one from above.

| Term | English | Spanish |
| --- | --- | --- |
| `courses.category` | category / categories | categoría / categorías |
| `courses.course` | course / courses | curso / cursos |
| `courses.section` | section / sections | sección / secciones |

Lock a word to keep it in every scope below: renaming it there is refused until you unlock it.

## Turning features off

With `customise.flag.manage` you turn features on or off in a scope. Turning one off hides what it offers there, and keeps its data: turning it back on brings everything back.

| Feature | On by default | When it is off |
| --- | --- | --- |
| `courses.groups` | Yes | Nobody can create groups in the courses below; existing groups stay |

A course or a section can turn a feature back on, unless a scope above locks it off.

## Custom fields on courses

With `customise.field.manage` in a campus or a category you add fields that every course below it has, for example credits, a level or a tutor. Each field has a code unique in its scope, a name, and a type:

| Type | Holds |
| --- | --- |
| Text | Text up to its length (1000 characters unless you set one) |
| Integer | A whole number |
| Date | A day |
| Boolean | Yes or no |
| Choice | One of its choices |
| Choices | Any of its choices |
| Account | A person of the campus |

A field is **public**, seen by whoever sees the course, or **private**, seen only with `customise.field.view`. Teachers fill the fields of their courses with `customise.field.edit`. When a category defines a field with the same code as one of the campus, its own applies to its courses. Deleting a field deletes its values.

## Customisation permissions

| Permission | What it allows | Default roles |
| --- | --- | --- |
| `customise.term.manage` | Rename the words of a scope | Administrators, Manager, Teacher |
| `customise.flag.manage` | Turn features on or off | Administrators, Manager |
| `customise.field.manage` | Add and delete custom fields | Administrators, Manager |
| `customise.field.view` | See private custom fields | Administrators, Manager, Teacher, Non-editing teacher |
| `customise.field.edit` | Fill the custom fields of a course | Administrators, Manager, Teacher |
