---
title: Customisation
description: The words your campus uses, features you turn off, custom fields on courses, page layouts, menus, the theme and rules, set per scope and copied with packages.
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

The theme sets the look of the site, with `customise.theme.manage`. It covers the colours, the fonts, the size of text, the corners, the density, the motion and whether the site is light or dark. It follows Material Design, and its defaults are Didactika's colours. A scope sets only the tokens it wants to change; the others come from above. A locked theme keeps the scopes below from changing anything.

| Tokens | What they are |
| --- | --- |
| `brand` | The colour of your logo, used in the header and the gradient of the brand |
| `primary`, `secondary`, `accent` | The colour of what is chosen, active or the main action; a quieter colour; a colour to highlight |
| `neutral` | The colour the backgrounds, surfaces and text are made from |
| `danger`, `success`, `warning`, `info` | What removes or fails, what is done, what needs attention, what informs |
| `font_family`, `font_family_brand` | The fonts of the text and of the headings, such as `"IBM Plex Sans", sans-serif` |
| `font_size` | The size of normal text, in pixels (12 to 24); every other size follows it |
| `radius` | How round the corners are, in pixels (0 to 28); 0 makes every shape square |
| `density` | `comfortable`, or `compact` for smaller controls that fit more on a screen |
| `motion` | `full`, or `reduced` for no animation |
| `scheme` | `system` to follow each device, or `light` or `dark` |

Colours are written as `#rrggbb`. From each one Kampus makes a whole range of tones and picks, for the light and the dark scheme, the tone of each use: buttons, the text on them, softer backgrounds, borders and surfaces. If the colour you give is too light or too dark to read, Kampus uses the nearest tone of the same colour that is readable. So every text keeps a contrast of at least 4.5 to 1 on its background, as WCAG 2.2 AA asks, whatever colours you choose.

## Rules

A rule does something on its own when something happens: "when someone enrols in a course of this category, add them to the Newcomers group". With `customise.rule.manage` you write rules in a scope, and they react to what happens there and below. Each rule has:

| Part | What it is |
| --- | --- |
| Trigger | What happens, such as `enrol.enrolment_created` |
| Conditions | Optional: comparisons on what the event says (equal, not equal, one of, present), combined with all, any and not |
| Actions | What it does, in order, with their parameters, such as `courses.add_to_group` with the group |

Rules never run code of their own: only the actions the parts of Kampus offer. You can only write a rule whose actions you could do yourself, and it keeps acting as you: if you lose a permission an action needs, that action fails. Changing a rule makes you its owner.

Each time a rule reacts, Kampus records it: succeeded, failed with the reason, or skipped when its conditions did not hold. A failed action is not tried again, and the actions before it stay done. A rule cannot react to what its own actions do, and chains of rules stop after five steps. Turn a rule off to keep it without it running.

## Packages

A package copies customisation from one scope to another, or to another campus. With `customise.package.manage` you export what a scope sets itself, of the kinds you choose: terms, flags, fields (without their values), layouts, menus, the theme and rules. What the scope takes from above is not exported.

Importing goes in two steps. First Kampus reads the package and checks every item against the scope it goes into: that the parts of Kampus there declare it, that nothing above locks it, and that you hold the permission of each kind. It shows the differences, what it adds and what it changes, with the value before. Nothing changes until you apply it; then everything is written at once, or nothing is, and the history shows it as one change. A package is applied once.

An import adds and changes, it never removes. A field keeps its type: a field of the same code with another type is refused. Rules are matched by name, and you become their owner. A rule parameter that names a record, such as a group, keeps naming that record: check rules after importing them into another course.

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
| `customise.package.manage` | Export the customisation of a scope and import packages | Administrators, Manager |
