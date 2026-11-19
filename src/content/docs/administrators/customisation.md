---
title: Customisation
description: The words your campus uses, features you turn off, custom fields on courses, page layouts, menus, the theme and rules, set per scope.
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

## Page layouts

Each kind of page has regions, and you choose which widgets go in each one, in order, with `customise.layout.manage`. The page of a course has the regions top, main and side:

| Widget | Shows | Settings |
| --- | --- | --- |
| `courses.outline` | The sections of the course the reader sees | Collapsed or not |
| `courses.summary` | The summary and dates of the course | None |
| `customise.text` | A heading and a text, on any page | Heading, text |

A widget can be shown only to people with a given permission. The layout of the nearest scope applies as a whole: arrange the course page for a whole category, and teachers, who hold `customise.layout.manage` in their courses, can rearrange theirs unless you lock it. If a part of Kampus that offered a widget is removed, the widget simply stops showing; the page still opens.

## Menus

The main navigation (`customise.main`) and the links at the foot of every page (`customise.footer`) are menus you set with `customise.menu.manage`. Each item has a label, a path of the site (such as `/courses`) or a web address, and optionally the permission that shows it; items can hold items, three levels deep, up to 100 in all. People see only the items they may see, and a hidden item hides the ones under it.

## Theme

The theme sets the colours, the font, the sizes and the motion of the site with `customise.theme.manage`. A scope sets only the tokens it wants to change; the others come from above, and a locked theme keeps the scopes below from changing anything.

| Tokens | What they are |
| --- | --- |
| `primary`, `secondary`, `surface`, `background`, `danger`, each with its `on_` colour | A colour (`#rrggbb`) and the colour of text on it |
| `link` | The colour of links |
| `font_family` | The fonts, such as `Inter, sans-serif` |
| `font_size`, `spacing`, `radius` | Sizes in pixels |
| `motion` | `full`, or `reduced` for less animation |

Kampus refuses a theme whose text would be hard to read: every text colour keeps a contrast of at least 4.5 to 1 on its background, as WCAG 2.2 AA asks.

## Rules

A rule does something on its own when something happens: "when someone enrols in a course of this category, add them to the Newcomers group". With `customise.rule.manage` you write rules in a scope, and they react to what happens there and below. Each rule has:

| Part | What it is |
| --- | --- |
| Trigger | What happens, such as `enrol.enrolment_created` |
| Conditions | Optional: comparisons on what the event says (equal, not equal, one of, present), combined with all, any and not |
| Actions | What it does, in order, with their parameters, such as `courses.add_to_group` with the group |

Rules never run code of their own: only the actions the parts of Kampus offer. You can only write a rule whose actions you could do yourself, and it keeps acting as you: if you lose a permission an action needs, that action fails. Changing a rule makes you its owner.

Each time a rule reacts, Kampus records it: succeeded, failed with the reason, or skipped when its conditions did not hold. A failed action is not tried again, and the actions before it stay done. A rule cannot react to what its own actions do, and chains of rules stop after five steps. Turn a rule off to keep it without it running.

## Customisation permissions

| Permission | What it allows | Default roles |
| --- | --- | --- |
| `customise.term.manage` | Rename the words of a scope | Administrators, Manager, Teacher |
| `customise.flag.manage` | Turn features on or off | Administrators, Manager |
| `customise.field.manage` | Add and delete custom fields | Administrators, Manager |
| `customise.field.view` | See private custom fields | Administrators, Manager, Teacher, Non-editing teacher |
| `customise.field.edit` | Fill the custom fields of a course | Administrators, Manager, Teacher |
| `customise.layout.manage` | Arrange the widgets of pages | Administrators, Manager, Teacher |
| `customise.menu.manage` | Set the menus | Administrators, Manager |
| `customise.theme.manage` | Set the theme | Administrators, Manager |
| `customise.rule.manage` | Write, change and remove rules | Administrators, Manager |
