---
title: Policies
description: Publishing the terms and notices of your campus in versions, and seeing who has to accept the new one.
sidebar:
  order: 6
---

Available since 0.1.0.

## What a policy is

A policy is a text your campus asks people to accept: the terms of use, the privacy notice. Each one has a code, such as `terms`, a title and a body. The code is unique in the campus, whatever its capital letters.

## Publishing a version

Whoever holds `privacy.policy.manage` in the campus publishes policies. Administrators of a campus and of the platform have it from the start. The first time you use a code you create the policy; every time after that you publish a new version of it, numbered 1, 2, 3 and so on. Nothing is edited in place: an old version stays as it was, so you can always show what a person accepted.

You cannot publish a policy without a code, a title and a text.

## What people see

Everyone in the campus sees the latest version of each policy, and which ones they have not accepted yet. When you publish a new version, everyone has to accept it again, even if they accepted the one before. Someone who tries to accept an old version is told it is no longer the latest.

Kampus keeps, for every person, which version they accepted and when. It is part of the data they can ask to export, and it is recorded in the audit log together with each new version you publish.
