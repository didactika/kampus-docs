---
title: People, settings and rules of your course
description: Giving roles in your course, changing what a role may do there, seeing the course as a learner, its settings, its rules and its history.
sidebar:
  order: 6
---

<!-- covers: grantRole, overridePermission, viewAsRole, changeSetting, createRule, reviewAuditLog -->

Available since 0.1.0.

## Giving roles

Besides enrolling people, you can give a role to someone in your course, in one of its sections or in one activity, for a period or without end: for example, make a colleague a non-editing teacher of one section. You can only give the roles your own role is allowed to give; a teacher can give the learner role but not the manager role. A role ends on its date or when you remove it, and every change is recorded.

## Changing what a role may do

An **override** changes one permission of one role in your course, a section or an activity, without touching the role elsewhere: for example, let learners see the participants of one section only. You can allow, deny or forbid; a forbid cannot be undone by anything below. Kampus can explain any decision: which roles counted, the value of each and the place it came from. Overrides follow the same allowances as giving roles (see [roles and permissions](/administrators/roles-and-permissions/)).

## Viewing as a learner

**View as** shows your course, a section or an activity exactly as another role sees it, such as a learner. While you view as a role you can only read, inside that place. Starting and ending it are recorded.

## Settings

Some settings can be changed for your course or one of its sections, when your role may: they apply there and below, unless the campus locked them. Each one shows where its value comes from, and every change is recorded with the value before and after. The [settings reference](/reference/settings/) lists them all.

## Rules

A rule does something on its own when something happens in your course: "when someone enrols, add them to the Newcomers group". It has a trigger, optional conditions and actions, and it acts as you, so it can only do what you could do yourself. Each time it reacts, Kampus records whether it succeeded, failed or was skipped. How rules work is explained in [customisation](/administrators/customisation/#rules).

## History

Significant changes to your course, such as removing an enrolment, overriding a grade or archiving the course, are written in the **audit log** with who made them and when. Nobody can change an entry. You can read the entries of your course when your role may.
