---
title: Progress
description: What each activity asks of learners, how Kampus tracks it, and how to decide a state yourself.
sidebar:
  order: 5
---

Available since 0.1.0. Course completion and prerequisites arrive in a later release.

## What an activity asks

For each course module you choose what a learner must do for it to count as done, in any combination:

| Rule | The learner is done when… |
| --- | --- |
| View | they open it |
| Submit | they submit something to it |
| Grade | they receive a grade |
| Pass | they reach the passing grade of its grade record |
| Mark | they mark it done themselves |

A learner is **not started** until they do something, **in progress** while some of what is asked is missing, and **done** when every rule is met. With a pass rule it ends **passed** or **failed** by the grade: a failing grade ends it even if other rules are still pending.

Kampus follows each person as they view, submit, mark and receive grades, and the state updates by itself. When you change the rules of a course module, Kampus re-evaluates everyone who had already done something, a few moments later.

## Deciding a state yourself

If the rules do not capture what happened (a paper submission, a retake), set a person's state on a course module and say why. Your decision wins over the rules, with your reason and the date kept, until you remove it; then the state the rules give counts again. Changing the rules never overwrites your decisions.

## What learners see

A learner sees their own states. While the grade a pass rule depends on is hidden, they see that the activity is done, but not whether they passed. You see the outcome.

## Completing the course

You decide what completing the course means with **criteria**, and whether a person needs all of them or any one:

| Criterion | It is met when |
| --- | --- |
| Activity | A course module of the course is done, or passed |
| Grade | A grade of the course reaches a percentage of its range |
| Date | A moment has arrived |
| Duration | The person has taken part in the course for some days without a break |
| Approval | Someone who holds a role in the course, such as a teacher, approves the person |
| Other course | The person completed another course |

Kampus follows the active participants who hold `progress.tracked`, which learners have. Each time something a criterion depends on changes, it checks them again within a few minutes, and it looks at dates and durations once a day. When a person meets the criteria the course is completed for them, with the date, and they are told. If a criterion stops being met, a grade lowered for instance, the completion is revoked and recorded, unless you say a completion is final.

To approve someone, you must hold the role the criterion names in the course. A course cannot require itself, not even through other courses. Changing the criteria keeps the approvals of the criteria that stay the same, and everyone is checked again. You see everyone's progress in the course, each criterion with whether it is met; each learner sees their own.

| Permission | What it allows | Default roles |
| --- | --- | --- |
| `progress.view_own` | See the own progress | Everyone in the course |
| `progress.view_all` | See the progress of everyone | Teachers, non-editing teachers, managers, administrators |
| `progress.mark_own` | Mark an activity done | Learners |
| `progress.exception` | Decide a state with a reason | Teachers, managers, administrators |
| `progress.manage` | Choose what each activity and the course ask | Teachers, managers, administrators |
| `progress.tracked` | Be followed by the progress of the course | Learners |
