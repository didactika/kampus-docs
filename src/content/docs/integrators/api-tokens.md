---
title: API tokens
description: Scoped, expiring tokens for integrations, and service accounts.
sidebar:
  order: 1
---

Available since 0.1.0.

An API token lets an integration act for an account. It looks like `kmp_<prefix>_<secret>`: the prefix names the token in lists and logs, and the whole token is shown once, when it is created. Kampus keeps only a hash of it, so a lost token cannot be shown again; create a new one and revoke the old.

## Scopes

A token carries a list of permissions, each in a scope (a campus, a category, a course…). It reaches a permission in a scope and everything below it, and only when the account also holds that permission there. A token can only carry permissions its account holds when the token is created.

## Lifetime

Every token expires: after 90 days by default, and after one year at most. Revoked and expired tokens stop working at once, and so do all the tokens of an account that is suspended, deleted, or whose password changes.

## Service accounts

For an integration that is not a person, ask an administrator for a **service account**. It has no password and cannot sign in; it acts only with tokens, and holds only the roles given to it, so the integration can do exactly what it needs and nothing more. Its tokens are created and revoked by administrators with `identity.token.manage_any`.

## Your own tokens

People create and revoke their own tokens with `identity.token.manage_own`. Creating a token is a sensitive operation: when the last sign-in is older than 15 minutes, the password is asked again first.
