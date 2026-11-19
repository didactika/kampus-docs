---
title: Roles and permissions
description: The default roles of a campus, what each may do, and how overrides, freezing and "view as" work.
sidebar:
  order: 1
---

Available since 0.1.0.

Everything a person may do in Kampus is decided by the roles they hold and where they hold them. A role is held in a **scope**: the platform, a campus, a category, a course, a section or an activity. A role held in a scope applies there and in everything below it.

## Default roles

Every new campus gets these roles, each made from a template of the same name. You can change any of them, and bring it back to its template at any time; Kampus shows what differs from the template before you reset it.

| Role | Access permissions by default |
| --- | --- |
| Platform administrator | All |
| Campus administrator | All |
| Manager | Grant and remove roles, change overrides (not risky ones), view as, review |
| Course creator | None of the access permissions |
| Teacher | Grant roles, view as, review |
| Non-editing teacher | Review |
| Section leader | Grant roles, review |
| Learner, Mentor, Authenticated user | None of the access permissions |
| Guest | None, and never a write or a risky permission |

Visitors who are not signed in read with the **Guest** role of the campus.

When a new part of Kampus is installed on a running site, the roles that already exist get its permissions with the values their template gives them; the values you changed stay as they are.

## The access permissions

| Permission | What it allows | Lowest scope |
| --- | --- | --- |
| `access.grant.create` | Give a role to a person | Section |
| `access.grant.delete` | Remove a role from a person | Section |
| `access.override.update` | Change a role's value in a scope | Activity |
| `access.override.risky` | Change a risky permission in a scope | Activity |
| `access.role.manage` | Create, change and reset roles | Campus |
| `access.scope.freeze` | Freeze and unfreeze a scope | Activity |
| `access.view_as` | See a scope as another role | Activity |
| `access.review` | Read who holds which roles and why a check is decided | Activity |

Other parts of Kampus declare their own permissions; they appear here as they become available.

## How a check is decided

1. The roles the person holds in the scope and its ancestors count, as long as the grant is active.
2. For each role, the value is the nearest **override** from the scope up to the campus; without one, the role's own value applies.
3. Any **forbid** refuses. Otherwise, one **allow** is enough.

Every decision can be explained: Kampus lists the roles considered, the value of each and the scope it came from.

## Allowances

A role may only give, override or view as the roles it is **allowed** to. For example, a teacher may give the learner role but not the manager role. Allowances are set per role.

## Safety rules

- A campus always keeps at least one person who can manage it: Kampus refuses a change that would leave it without one.
- In a **frozen** scope nothing can be changed, only read.
- Suspended accounts lose every permission until they are restored.
- Every change to a role, grant or override is recorded with who made it and when.

## Requiring a second factor

With `access.role.manage` you can make a role require a second factor. Everyone who holds that role must then give one at every sign-in, and people without a factor set up an authenticator app at their next sign-in. They cannot remove their last factor while they hold the role. The campus can also require a second factor from everyone.

## View as

With `access.view_as` you can see a course, section or activity exactly as another role sees it, for example as a learner. While viewing as a role you can only read, and only inside that scope. Starting and ending a "view as" session is recorded.
