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

| Route | What it does | Permission |
| --- | --- | --- |
| `GET /me` | The account of the token or the session | signed in |
| `GET /accounts/{id}` | An account, with its version | `identity.account.read` |
| `POST /campuses/{id}/accounts` | Invite a person by email | `identity.account.invite` |
| `POST /campuses/{id}/service-accounts` | Create a service account | `identity.account.invite` |
| `POST /accounts/{id}/transitions` | `to`: `suspended`, `active`, `deletion_scheduled` or `deletion_cancelled`, with a `reason`; needs `If-Match` | `identity.account.suspend` or `identity.account.delete` |
| `POST /accounts/{id}/tokens` | Create a token for another account | `identity.token.manage_any` |
| `DELETE /tokens/{id}` | Revoke the token of any account | `identity.token.manage_any` |
| `GET`, `PUT /accounts/{id}/profile` | Read and replace a profile | `identity.account.read`, `users.profile.update_any` |
| `GET`, `POST /campuses/{id}/identity-providers` | List and add identity providers | `identity.provider.manage` to add |
| `POST /scopes/{id}/system-groups` | Create a system group, by hand or with a `rule` | `users.system_group.manage` |
| `GET /system-groups/{id}/members` | Members, each with its origin | `users.system_group.manage` |
| `PUT`, `DELETE /system-groups/{id}/members/{account}` | Add or remove a member by hand | `users.system_group.manage` |
| `POST /system-groups/{id}/apply-rule` | Apply the rule of a group | `users.system_group.manage` |
| `GET`, `POST /campuses/{id}/categories` | Categories under a parent (`?parent=`), and creating one | `courses.category.manage` to create |
| `GET`, `PUT`, `DELETE /categories/{id}`; `POST /categories/{id}/move` | Read, replace, delete an empty category, move it | `courses.category.manage` |
| `GET`, `POST /categories/{id}/courses` | Courses of a category, and creating one | `courses.course.create` to create |
| `GET`, `PUT /courses/{id}`; `POST /courses/{id}/move` | A course with its owners; replacing it; moving it | `courses.course.update` |
| `PUT /courses/{id}/state` | `to`: `draft`, `published`, `archived` or `deletion_scheduled`; needs `If-Match` | `courses.course.update`, `.archive` or `.delete` |
| `GET`, `POST /courses/{id}/sections`; `GET`, `PUT`, `DELETE /sections/{id}` | The sections of a course, depth first, and their changes | `courses.section.manage` to change |
| `POST /sections/{id}/move`, `POST /sections/{id}/restore` | Move a section with its subtree; restore a deleted one | `courses.section.manage` |
| `GET`, `POST /courses/{id}/groups`; `GET`, `PUT`, `DELETE /groups/{id}` | Groups the caller sees, and their changes | `courses.groups.manage` to change |
| `GET`, `POST /groups/{id}/members`; `DELETE /groups/{id}/members/{account}` | Members by origin; adding and removing by hand | `courses.groups.manage` to change |
| `GET`, `POST /courses/{id}/group-sets`; `PUT`, `DELETE /group-sets/{id}/groups/{group}` | Group sets and their groups | `courses.groups.manage` |

Places among siblings are `{"at": "first"}`, `{"at": "last"}`, `{"at": "after", "sibling": "<id>"}` or `{"at": "before", "sibling": "<id>"}`; a visibility is `{"mode": "shown"}`, `{"mode": "hidden"}` or `{"mode": "scheduled", "from": "...", "until": "..."}`. A hidden category, course or section answers `404` to whoever may not see it.

Enrolment:

| Route | What it does | Permission |
| --- | --- | --- |
| `GET`, `POST /courses/{id}/enrolment-instances`; `GET`, `PUT`, `DELETE /enrolment-instances/{id}` | Enrolment methods of a course: `method` `manual`, `self` (with `key`) or `system_group` (with `source`) and the `role` they give | `enrol.instance.manage`, and being able to grant the role |
| `POST /enrolment-instances/{id}/enrolments` | `accounts` to enrol, with `starts_at` and `ends_at`; a report per person | `enrol.enrolment.manage` |
| `GET /courses/{id}/participants?active=true` | The enrolments of a course | `enrol.enrolment.read` |
| `GET`, `PUT`, `DELETE /enrolments/{id}` | An enrolment: `status`, period and reason; removing it | `enrol.enrolment.manage` |
| `POST /enrolment-instances/{id}/sync` | Bring a system group method in step with its group | `enrol.instance.manage` |
