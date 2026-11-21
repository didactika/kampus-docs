---
title: Notifications
description: What the people of your campus receive by email and push, the texts they read, and what they may change.
sidebar:
  order: 8
---

Available since 0.1.0.

## Channels

Every kind of notification can reach people in their inbox, by email and as a push notification on the browsers and phones they allow. Each kind comes with the channels its module chose, and people change them channel by channel. Required kinds always reach the inbox.

## Defaults of the campus

With `notify.defaults.manage` you set what the campus gives for a kind on a channel, for instance grades by email. People who did not choose otherwise get your default. When you **lock** a default, it applies to everyone and nobody can change it, which is how you make a channel compulsory or forbid one.

## Texts

With `notify.template.manage` you write the subject and the text of email and push for each kind and language. Write `{{summary}}` for the description of the kind and the name of a field of the notification, such as `{{course}}`, for its value. A person receives the text in their language, or in English when there is none in theirs, and the description of the kind when there is no text at all.

## Delivery

Email and push go out a few moments after what caused them, never while the person who caused it waits. If sending fails, Kampus tries again later, waiting longer each time, and gives up after five attempts. Someone without an email address, or without a browser or phone allowed, is skipped on that channel. Until the operator configures how mail and push are sent, the server writes them to its log instead.
