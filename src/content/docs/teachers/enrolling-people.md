---
title: Enrolling people
description: Enrolment methods of a course, enrolling people by hand, keys and approvals, system groups, and suspending or removing enrolments.
sidebar:
  order: 2
---

<!-- covers: enrolPeople, manageEnrolment -->

Available since 0.1.0.

## Enrolment methods

People take part in your course through the **enrolment methods** you add to it. Each one gives a role (learner, for example), and can have:

| Setting | What it does |
| --- | --- |
| Opening period | People can join only between these dates |
| Default duration | Enrolments end this many days after they start, unless you give an end |
| Capacity | No more people than this, even when many join at once |
| Approval | People ask to join and you decide |
| Expiry rule | When an enrolment ends: suspend it, remove it, or keep the person without the role |

You can only add a method that gives a role you are allowed to give: a teacher can enrol learners, but not managers. Disabling a method stops the participation it gives without deleting anything; deleting it removes its enrolments, and the roles and groups they brought.

## The methods

- **Manual**: you enrol people yourself, one or many at once; Kampus says what happened to each one.
- **Self**: people enrol themselves. Give it a key to share with your learners, and keys for groups: who gives a group's key joins that group. With approval, people send you a request and you approve or reject it.
- **System group**: the members of a group of your campus, such as a cohort. Kampus enrols those who join the group and removes those who leave it; you do not enrol or remove them by hand.

## Managing enrolments

You can suspend an enrolment and reactivate it later: while it is suspended the person does not take part and loses the role, and nothing is deleted. You can change its start and end, and remove it. Removing an enrolment never deletes the person's grades or progress, and only takes away what that enrolment gave: a role given by hand, or by another enrolment, stays.

Only people who take part in the course can be put in its groups, and while people take part in a published course it cannot go back to draft.
