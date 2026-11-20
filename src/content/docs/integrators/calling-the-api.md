---
title: Calling the API
description: The base path, authenticating with a token or a session, errors, versions with If-Match, and the routes of accounts and profiles.
sidebar:
  order: 1
---

Available since 0.1.0.

Every route is under `/api/v1/<module>` of the site's address: the name of the part of Kampus that serves it comes first, for example `https://campus.example.org/api/v1/identity/me` or `/api/v1/courses/courses/{id}`. Bodies are JSON.

## Authenticating

An integration sends an [API token](../api-tokens/) in the `Authorization` header:

```sh
curl https://campus.example.org/api/v1/identity/accounts/0191f3a2-7c1e-7b40-9d1a-3e5f0c2b8a11 \
  -H "Authorization: Bearer kmp_3f9a1c2b_..."
```

A token acts for its account, and only with the permissions it carries: anything else is refused with `403` and the code `identity.api_token_scope`, even when the account could do it. A token never manages credentials: the routes of passwords, sessions, second factors and tokens under `/me` need a person signed in.

A browser signs in with `POST /api/v1/identity/auth/sign-in` and receives the `kampus_session` cookie (HttpOnly, SameSite=Lax, and Secure over HTTPS). Every request that changes something with that cookie carries the header `X-Kampus: 1`; without it the request is refused with `identity.csrf_header_missing`, so another site cannot act for the person.

## Errors

Every error is a problem details document (`application/problem+json`) with a stable `code`, its `params`, the `fields` at fault and the `request_id`, which is also in the `X-Request-Id` header. Quote the request id when you report a problem: it finds the request in the logs.

```json
{
  "type": "https://kampus.didactika.org/problems/validation",
  "title": "validation",
  "status": 422,
  "code": "users.profile_invalid",
  "params": {},
  "fields": [{ "field": "time_zone", "rule": "iana" }],
  "request_id": "01a1f350-fc69-7598-8b75-81d1ad2515f3"
}
```

| Status | When |
| --- | --- |
| `401` | No session or token, or one that is not valid any more |
| `403` | The caller may not do it, or a cookie request without `X-Kampus` |
| `404` | The resource does not exist, or its identifier is not one |
| `412` | The resource changed since it was read, or the update did not send `If-Match` |
| `422` | The body does not parse or breaks a rule; `fields` names every field at fault |
| `429` | Too many attempts; `params.retry_after` gives the seconds to wait |

## Versions and If-Match

Accounts and profiles answer with their version in the `ETag` header. Every update sends it back in `If-Match`; when someone changed the resource in between, the update is refused with `412` instead of overwriting their change, and you read it again.

```sh
curl -i https://campus.example.org/api/v1/users/accounts/$ID/profile -H "Authorization: Bearer $TOKEN"
# ETag: "3"
curl -X PUT https://campus.example.org/api/v1/users/accounts/$ID/profile \
  -H "Authorization: Bearer $TOKEN" -H 'If-Match: "3"' \
  -H "Content-Type: application/json" \
  -d '{"given_name": "Ana", "family_name": "García", "time_zone": "Europe/Madrid"}'
```

A profile update replaces every field: send the ones you keep too.

## Routes of 0.1.0

Every route below is relative to `/api/v1`, and starts with the name of the part of Kampus that serves it.

| Route | What it does | Permission |
| --- | --- | --- |
| `GET /identity/me` | The account of the token or the session | signed in |
| `GET /identity/accounts/{id}` | An account, with its version | `identity.account.read` |
| `POST /identity/campuses/{id}/accounts` | Invite a person by email | `identity.account.invite` |
| `POST /identity/campuses/{id}/service-accounts` | Create a service account | `identity.account.invite` |
| `POST /identity/accounts/{id}/transitions` | `to`: `suspended`, `active`, `deletion_scheduled` or `deletion_cancelled`, with a `reason`; needs `If-Match` | `identity.account.suspend` or `identity.account.delete` |
| `POST /identity/accounts/{id}/tokens` | Create a token for another account | `identity.token.manage_any` |
| `DELETE /identity/tokens/{id}` | Revoke the token of any account | `identity.token.manage_any` |
| `GET`, `PUT /users/accounts/{id}/profile` | Read and replace a profile | `identity.account.read`, `users.profile.update_any` |
| `GET`, `POST /identity/campuses/{id}/identity-providers` | List and add identity providers | `identity.provider.manage` to add |
| `POST /users/scopes/{id}/system-groups` | Create a system group, by hand or with a `rule` | `users.system_group.manage` |
| `GET /users/system-groups/{id}/members` | Members, each with its origin | `users.system_group.manage` |
| `PUT`, `DELETE /users/system-groups/{id}/members/{account}` | Add or remove a member by hand | `users.system_group.manage` |
| `POST /users/system-groups/{id}/apply-rule` | Apply the rule of a group | `users.system_group.manage` |
| `GET`, `POST /courses/campuses/{id}/categories` | Categories under a parent (`?parent=`), and creating one | `courses.category.manage` to create |
| `GET`, `PUT`, `DELETE /courses/categories/{id}`; `POST /courses/categories/{id}/move` | Read, replace, delete an empty category, move it | `courses.category.manage` |
| `GET`, `POST /courses/categories/{id}/courses` | Courses of a category, and creating one | `courses.course.create` to create |
| `GET`, `PUT /courses/courses/{id}`; `POST /courses/courses/{id}/move` | A course with its owners; replacing it; moving it | `courses.course.update` |
| `PUT /courses/courses/{id}/state` | `to`: `draft`, `published`, `archived` or `deletion_scheduled`; needs `If-Match` | `courses.course.update`, `.archive` or `.delete` |
| `GET`, `POST /courses/courses/{id}/sections`; `GET`, `PUT`, `DELETE /courses/sections/{id}` | The sections of a course, depth first, and their changes | `courses.section.manage` to change |
| `POST /courses/sections/{id}/move`, `POST /courses/sections/{id}/restore` | Move a section with its subtree; restore a deleted one | `courses.section.manage` |
| `GET`, `POST /courses/courses/{id}/groups`; `GET`, `PUT`, `DELETE /courses/groups/{id}` | Groups the caller sees, and their changes | `courses.groups.manage` to change |
| `GET`, `POST /courses/groups/{id}/members`; `DELETE /courses/groups/{id}/members/{account}` | Members by origin; adding and removing by hand | `courses.groups.manage` to change |
| `GET`, `POST /courses/courses/{id}/group-sets`; `PUT`, `DELETE /courses/group-sets/{id}/groups/{group}` | Group sets and their groups | `courses.groups.manage` |

Places among siblings are `{"at": "first"}`, `{"at": "last"}`, `{"at": "after", "sibling": "<id>"}` or `{"at": "before", "sibling": "<id>"}`; a visibility is `{"mode": "shown"}`, `{"mode": "hidden"}` or `{"mode": "scheduled", "from": "...", "until": "..."}`. A hidden category, course or section answers `404` to whoever may not see it.

Enrolment:

| Route | What it does | Permission |
| --- | --- | --- |
| `GET`, `POST /enrol/courses/{id}/enrolment-instances`; `GET`, `PUT`, `DELETE /enrol/enrolment-instances/{id}` | Enrolment methods of a course: `method` `manual`, `self` (with `key`) or `system_group` (with `source`) and the `role` they give | `enrol.instance.manage`, and being able to grant the role |
| `POST /enrol/enrolment-instances/{id}/enrolments` | `accounts` to enrol, with `starts_at` and `ends_at`; a report per person | `enrol.enrolment.manage` |
| `GET /enrol/courses/{id}/participants?active=true` | The enrolments of a course | `enrol.enrolment.read` |
| `GET`, `PUT`, `DELETE /enrol/enrolments/{id}` | An enrolment: `status`, period and reason; removing it | `enrol.enrolment.manage` |
| `POST /enrol/enrolment-instances/{id}/sync` | Bring a system group method in step with its group | `enrol.instance.manage` |

## External references

Other systems name records in their own way: the number a student information system gives a person, the code of a course in an ERP, the `idnumber` of another platform. Kampus keeps those identifiers as **external references**: a system (a code you choose, such as `sis`) and the identifier it uses. Each record has at most one identifier per system, and in a campus an identifier of a system names one record of each kind. They are never the `code` people read, and deleting the record deletes them.

| Route | What it does | Permission |
| --- | --- | --- |
| `GET /courses/{kind}/{id}/references` | The identifiers systems give a category, course, section, group or group set (`{kind}`: `categories`, `courses`, `sections`, `groups`, `group-sets`) | The one that manages the record, such as `courses.course.update` |
| `PUT`, `DELETE /courses/{kind}/{id}/references/{system}` | Give the record the identifier of a system (`{"external_id": "PHY-2026"}`), replacing the one it had; remove it | The same |
| `GET /courses/campuses/{id}/{kind}/by-reference/{system}/{external_id}` | The record a system knows by that identifier: `{"kind", "id"}` | The same |
| `PUT /courses/campuses/{id}/categories/by-reference/{system}/{external_id}` | Update the category with that identifier, or create it last under `parent` with it: `201` when created, `200` when updated | `courses.category.manage` |
| `PUT /courses/categories/{id}/courses/by-reference/{system}/{external_id}` | Update the course with that identifier in the campus, or create it last in the category; a course found in another category stays there | `courses.course.create` and `courses.course.update` |
| `GET /identity/accounts/{id}/references`; `PUT`, `DELETE /identity/accounts/{id}/references/{system}` | The identifiers of an account, and setting or removing one | `identity.account.read`; `identity.account.invite` to change |
| `GET /identity/campuses/{id}/accounts/by-reference/{system}/{external_id}` | The account a system knows by that identifier | `identity.account.read` |
| `GET /users/system-groups/{id}/references`; `PUT`, `DELETE /users/system-groups/{id}/references/{system}` | The identifiers of a system group, and setting or removing one | `users.system_group.manage` |
| `GET /users/campuses/{id}/system-groups/by-reference/{system}/{external_id}` | The system group a system knows by that identifier | `users.system_group.manage` |
| `PUT /users/scopes/{id}/system-groups/by-reference/{system}/{external_id}` | The group with that identifier, created in the scope with `code` and `name` when there is none (`201`); an existing group is left as it is (`200`) | `users.system_group.manage` |
| `GET /enrol/enrolments/{id}/references`; `PUT`, `DELETE /enrol/enrolments/{id}/references/{system}` | The identifiers of an enrolment, and setting or removing one | `enrol.enrolment.read`; `enrol.enrolment.manage` to change |
| `GET /enrol/campuses/{id}/enrolments/by-reference/{system}/{external_id}` | The enrolment a system knows by that identifier | `enrol.enrolment.read` |
| `PUT /enrol/enrolment-instances/{id}/enrolments/by-reference/{system}/{external_id}` | Enrol `account` through a manual instance with that identifier, with `starts_at` and `ends_at` (`201`), or change the period of the enrolment that has it (`200`); the identifier never moves to someone else (`409`, `enrol.reference_other_account`) | `enrol.enrolment.manage` |

A system is lowercase letters, digits, `_`, `-` and `.`, starting with a letter; an identifier has at most 255 characters on one line. Giving an identifier another record of the kind already has in the campus answers `409` with `references.taken`. When you create a category or a course by its identifier, the identifier is set in the same step, so a sync that stops halfway never leaves the record without it.

## Files

Every file goes through the same three steps, whatever it is for, and then the part of Kampus that owns it attaches it:

| Route | What it does | Permission |
| --- | --- | --- |
| `POST /files/uploads` | Open an upload: `area` (such as `users.picture`), `scope`, `name`, `size` and, as a hint, `media_type`; it is valid for an hour | The upload permission of the area in that scope |
| `PUT /files/uploads/{id}` | Send the content as the raw body | Who opened it |
| `POST /files/uploads/{id}` | Complete it into a file, which only you read until it is attached | Who opened it |
| `GET /files/files/{id}` | The name, type and size of a file | Whoever may read what owns it |
| `POST /files/files/{id}/url` | A link that reads the file for 5 minutes, without signing in | Whoever may read what owns it |
| `GET /files/files/{id}/conversions/thumbnail` | A thumbnail of an image (PNG, JPEG, GIF, WebP): `202` while a job makes it the first time, then the state `done` with a 5-minute `url` to a PNG of at most 256 pixels a side, or `failed` with its `error` | Whoever may read what owns the file |
| `PUT`, `DELETE /users/me/picture`; `GET /users/accounts/{id}/picture` | Make an uploaded file of `users.picture` your profile picture, remove it, and read whose file is someone's picture | Signed in |
| `GET`, `PUT /files/scopes/{id}/quota`; `GET`, `PUT /files/people/{id}/quota` | The limit in bytes (`limit_bytes`, `null` for none) of a place or a person, and what attached files take; an upload that would not fit answers `409` with `files.quota_exceeded` | `files.quota.manage` |

Kampus reads the type from the content, not from what you say it is, and refuses what the area does not accept (`files.type_not_allowed`) or what is larger than it allows (`files.too_large`). The same content is stored once however many files use it. A file nobody attaches within a day is removed. Links serve content that could run in a browser, such as HTML or SVG, only as a download.
