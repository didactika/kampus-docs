---
title: Deletion requests and legal holds
description: Approving or rejecting the deletion of a person's data, and keeping it waiting while the campus must keep it.
sidebar:
  order: 7
---

<!-- covers: processDeletionRequest -->

Available since 0.1.0.

## Who decides

A person asks for the deletion of their data and gives a reason. Whoever holds `privacy.request.approve` in the campus approves or rejects it; administrators of a campus and of the platform have it from the start. The requests waiting for a decision are listed oldest first. Someone who asks for a deletion and may approve it is not made to wait.

You can ask for the deletion of another person's data with `privacy.request.manage`, for example when they asked you in writing; say so in the reason, because it stays on record together with who approved it.

## What happens when you approve

Each part of Kampus erases what only concerns the person. Notifications and personal calendar entries are deleted. Grades, progress and the proof of which policies they accepted are kept, because they belong to the academic record; they point to the account, which stays as a tombstone: no username, email or password, and a made-up name. The person cannot sign in again. Everything is audited: the request, who approved it and the erasure.

Rejecting a request changes nothing, and the person may ask again.

## Legal holds

With `privacy.hold.manage` you place a hold on one person, or on the whole campus, with the reason and, if you want, a date when it ends by itself. While a hold is active, a deletion that was approved waits and shows as held; it goes on by itself when you release the hold or its date passes. Holds do not stop people from asking, nor you from approving: they only stop the erasure.

## How long kept data stays

Grades, progress and the proof of acceptance are kept after an account is deleted. With `privacy.retention.manage` you decide for how many days, for each kind of data the modules declare; without a number the data is kept for ever. When the days after the deletion have passed, a daily job purges that data for good, unless a legal hold covers the account, in which case it waits for the hold to end. Each purge is audited and never repeats.
