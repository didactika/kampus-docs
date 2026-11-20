---
title: Files and quotas
description: How files are kept, who reads them, and limiting how much space a campus, a course or a person may use.
sidebar:
  order: 5
---

Available since 0.1.0.

## How files are kept

Every file belongs to something: a profile picture to a person, and later the material of an activity or a submission to theirs. Whoever may see that something may read its file, and nobody else; a file nobody attached to anything within a day is removed. The same content is stored once, however many files use it, and content no file uses any more is deleted after seven days.

When the operator configures a malware scanner, every upload is scanned before it is kept, and infected content is refused with `files.infected`; it is never stored. Links to files last five minutes. Content that could run in a browser, such as HTML or SVG, is only ever downloaded, never opened inside Kampus.

## Quotas

With `files.quota.manage` you limit how much space files may take:

| Quota | Counts |
| --- | --- |
| Of a campus, a category, a course or a section | The files of that place and of every place inside it: a limit on a category covers all its courses |
| Of a person | The files that person uploaded, wherever they are |

A file counts from the moment it is attached to what owns it until it is removed. When an upload would go over a limit, Kampus refuses it before it starts, with `files.quota_exceeded`; if two uploads race for the last space, only the one that fits is kept. Without a limit, nothing is refused.

| Permission | What it allows | Default roles |
| --- | --- | --- |
| `files.quota.manage` | Set the quotas of places and people | Administrators, Manager |
