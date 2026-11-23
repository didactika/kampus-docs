---
title: Your account
description: Signing up, choosing a password, signing in, second factors, sessions, recovering access and changing your password.
sidebar:
  order: 1
---

<!-- covers: signUp, signIn, setUpSecondFactor, editProfile, chooseLanguage, openHelp -->

Available since 0.1.0.

## Getting an account

Your campus either invites you, or lets you sign up with your email. Either way you receive a link by email: open it and choose your password. An invitation link lasts 7 days and a sign-up link 24 hours; each works once. If a link expired, ask for a new one.

If you sign up with an email that already has an account, you receive a message saying so instead of a new link.

## Your password

Your campus sets the rules; by default a password has at least 12 characters and may not contain your username or your email. A password never contains spaces. Several words you remember, joined by hyphens or other signs, make a good password. The form tells you as you type when the password has a space or the two copies differ. Nobody at your campus can see it, and Kampus never sends it to you.

## Signing in

Sign in with your username or your email and your password. When the answer is "sign-in failed", Kampus does not say whether the account exists or the password was wrong, on purpose. After a few failed tries you have to wait a little before trying again, and after many failed tries sign-in locks for a while.

## Signing in with your organisation

When your campus connects a provider, such as your organisation's single sign-on, you can choose it on the sign-in page. The first time, your campus may ask you to confirm by signing in with your Kampus password; you then receive an email saying the provider was linked. Your second factor is still asked.

## Your profile

Your profile holds your given and family names, how you are shown, your language and your time zone. You change it yourself; administrators of your campus can change it too. If someone changed it while you were editing, Kampus asks you to reload instead of overwriting their change.

Your preferences, such as how often you receive summaries, belong to the parts of Kampus that offer them; each one has a default until you choose.

## Language and help

Kampus speaks the language of your profile; until you choose one, it uses the language of your browser when the campus offers it. Dates and numbers follow your language and your time zone. On every screen, the help icon of the bar opens the guide that explains it, when your campus links its handbook.

## Changing your email

Changing your email needs your password again when you signed in more than 15 minutes ago. Kampus sends a link to the new address and tells the current one; the new address is used only once you open the link. If you sign in with your email, you sign in with the new one from then on.

## Sessions

Each browser or app you sign in with has its own session. A session ends after 8 hours without use, after 7 days at the latest, or when you sign out. You can see your open sessions and end the ones you do not recognise.

## Changing your password

Changing your password needs your current one, and, when you signed in more than 15 minutes ago, confirming your password first. Changing it ends every session and API token you had, on every device, and you receive an email about it.

## Second factors

A second factor protects your account even if someone learns your password. You can add:

- an **authenticator app**: scan the QR code with the app and type the six-digit code it shows;
- **codes by email**: at sign-in, Kampus sends an eight-digit code to your email, valid for 10 minutes.

When you add your first factor you receive ten **recovery codes**. They are shown only once: keep them somewhere safe. Each one works once, in place of your second factor, for example if you lose your phone. You can create a new set at any time, which replaces the old one.

Once you have a second factor, every sign-in asks for it. If your campus or one of your roles requires a second factor and you have none yet, the sign-in asks you to set up an authenticator app first. Adding or removing a factor needs your password again when you signed in more than 15 minutes ago, and you receive an email each time.

## Recovering access

If you forget your password, ask for a recovery link with your email; it lasts 30 minutes. When your account has a second factor, you must give a code from your app or a recovery code before choosing a new password; a code by email does not count, since the link already came by email. Recovering access ends every session and API token you had, and you sign in again with the new password. You can ask for three links an hour at most.
