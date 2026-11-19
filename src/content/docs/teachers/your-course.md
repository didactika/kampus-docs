---
title: Your course
description: Preparing a course, its sections, publishing and archiving it, and splitting people into groups.
sidebar:
  order: 1
---

Available since 0.1.0.

## Preparing it

A new course is a draft with one untitled section, and you, its creator, own it and teach it. Give it a short name, unique in the campus, a full name, and optionally a code, a summary, dates and a language. The layout (topics by default) only decides how the course is presented: changing it keeps every section.

When someone changed the course while you were editing it, Kampus asks you to reload instead of overwriting their change.

## Sections

Sections organise the course. A section can hold other sections, as deep as you like, and you place each one first, last, or right before or after another. Moving a section moves everything inside it, sections and permissions included, and changes nothing else.

Each section is shown, hidden, or shown only between two dates. Hiding a section hides what is inside it from learners; you still see it, marked as hidden. Showing it again brings back exactly what was there.

Deleting a section deletes the sections inside it too, but you can restore it, with everything deleted with it. A section whose parent is deleted comes back with its parent.

## Publishing and archiving

Publish the course when it is ready. You can take it back to draft while nobody takes part in it. When a course ends, archive it: everything stays, read-only, until you publish it again. As an owner you can also schedule its deletion, which happens after 14 days unless you cancel it; cancelling brings it back to draft.

## Groups

Groups split the people of the course. Each group has a name unique in the course, and can be limited to one section: then only people who see that section can join it. Who sees a group is up to you:

| Shown to | Who sees the group and its members |
| --- | --- |
| Everyone | Everyone in the course |
| Members | Its members; others do not see it |
| Each member only | Each member sees the group and only themselves |
| Nobody | Only those who manage groups |

A group shown to each member only, or to nobody, cannot be used to work in groups, since its members could not see each other.

You add people by hand. Parts of Kampus, such as enrolment, can also add people to a group; removing someone by hand never removes what they added, and they never remove who you added.

**Group sets** gather groups of the course, for example the lab groups; a group can be in several sets, and once in each.

## Words and custom fields

Your campus may call courses, sections or categories by other names, and you can rename them in your own course too, per language: a course can call its sections "weeks". A word your campus locks stays as it is. If groups are turned off where your course is, you cannot create groups, and the existing ones stay.

Your campus may also give courses custom fields, such as credits or a level. Fill them in for your course with `customise.field.edit`, which teachers hold; each value must fit its field (a number, a date, one of its choices…), and clearing it leaves the field empty. Private fields are shown only to people who may see them.
