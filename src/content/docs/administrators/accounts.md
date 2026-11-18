---
title: Accounts
description: Inviting people, the lifecycle of an account, deletion with a grace period, and service accounts.
sidebar:
  order: 2
---

Available since 0.1.0.

An account belongs to one campus. Its username and its email are unique in the campus, and capital letters do not count: `Ana@Example.org` and `ana@example.org` are the same account.

## Statuses

| Status | Meaning |
| --- | --- |
| Invited | A manager invited the person; the invitation link lets them choose a password |
| Pending confirmation | The person signed up; the link sent to their email confirms the account |
| Active | The person can sign in |
| Suspended | The person cannot sign in; every session and API token ended at once |
| Deleted | Personal data was erased; only a pseudonym remains, so records keep pointing to it |

Every change of status keeps who made it, when and why. You cannot change the status of your own account.

## Inviting people

With `identity.account.invite` you invite a person by email, and optionally a username (the email is used otherwise). They receive a link valid for 7 days to choose their password; the link works once. Kampus never creates, sends or shows a password.

When the campus allows self sign-up, visitors can create their own account; they confirm it from the link sent to their email, valid for 24 hours.

## Suspending and reactivating

With `identity.account.suspend` you suspend an account with a reason, and reactivate it later. While suspended, the person cannot sign in and loses every permission. When two administrators change the same account at the same time, the second change is refused instead of overwriting the first.

## Deleting

With `identity.account.delete` you schedule a deletion. The account is suspended at once and deleted when the grace period ends (14 days by default). Until then you can cancel the deletion, and reactivating the account cancels it too.

When the deletion runs, the account's personal data is erased: email, username, password, second factors, sessions, API tokens and the sign-in log. The account stays as a tombstone with a pseudonym such as `deleted-3f9a1c2b7e0d`, so grades and contributions keep a valid reference. The email can then be used for a new account.

## Service accounts

A service account is for an integration, not a person. It has no password and cannot sign in: it acts only with API tokens, and holds only the roles you give it. Create one with `identity.account.invite`; create and revoke its tokens with `identity.token.manage_any`.

## Identity providers

With `identity.provider.manage` you connect an OpenID Connect provider (your organisation's single sign-on, for example) to the campus: its issuer URL, and the client id and secret the provider gave you. The secret is stored encrypted. People then choose the provider on the sign-in page.

A person's account at the provider is linked to their Kampus account once, by the provider's own identifier for it, and from then on that link is used. How the first link is made is the **linking policy**:

| Policy | First sign-in through the provider |
| --- | --- |
| Subject only | Nothing is linked at sign-in: only links made before work |
| Verified email | Links to the active account with the same email, only when the provider says the email is verified |
| Confirm | The person confirms by signing in with their Kampus password; then the link is made |

Kampus never links to an account just because the email matches an unverified one. Signing in through a provider asks for the second factor like any other sign-in, and suspended accounts cannot sign in through a provider either.

## Identity permissions

| Permission | What it allows | Default roles |
| --- | --- | --- |
| `identity.account.invite` | Invite people and create service accounts | Administrators, Manager |
| `identity.account.suspend` | Suspend and reactivate accounts | Administrators, Manager |
| `identity.account.delete` | Schedule and cancel deletions | Administrators |
| `identity.account.read` | Read the accounts of the campus | Administrators, Manager |
| `identity.provider.manage` | Configure identity providers | Administrators |
| `identity.token.manage_own` | Create and revoke one's own API tokens | Administrators, Manager, Authenticated user |
| `identity.token.manage_any` | Create and revoke the tokens of any account | Administrators |

Every active person holds the **Authenticated user** role in their campus.

## Default policy

| Setting | Default |
| --- | --- |
| Self sign-up | Off |
| Shortest password | 12 characters, and it may not contain the username or the email |
| Confirmation link | 24 hours |
| Invitation link | 7 days |
| Session | Ends after 8 hours without use, and after 7 days at the latest |
| Sensitive operations | Need the password again when the last sign-in is older than 15 minutes |
| API tokens | 90 days by default, one year at most |
| Deletion grace period | 14 days |
| Failed sign-ins | After 3, each new try waits longer; after 10, sign-in locks for 15 minutes |
