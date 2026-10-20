---
title: Set up custom SMTP so sign-up and sign-in emails reach every learner
owner: ceo
status: todo
office: cto
created: 2026-10-17
unblocks:
  - 'Sign-up, sign-in-link and password-reset emails reach every learner, not only the project team'
acceptance:
  - 'Custom SMTP is enabled in Supabase (Authentication > Emails > SMTP Settings), with a sender address on elegantfrontend.training.'
  - 'The email provider shows the sending domain as verified (SPF and DKIM pass), and a DMARC record is published for it.'
  - 'A sign-up from an address outside the project team receives the confirmation email within a few minutes, and its link lands signed in on https://elegantfrontend.training/account/.'
  - 'Under Authentication > URL Configuration, the Site URL is https://elegantfrontend.training and the Redirect URLs include https://elegantfrontend.training/account/.'
---

# Set up custom SMTP so sign-up and sign-in emails reach every learner

Email accounts are confirmed by email: on 2026-10-17 the project's auth settings had `mailer_autoconfirm: false`. The sign-in link, password reset and sign-up confirmation are all emails too. `supabase/README.md` records the problem: the built-in mailer "only delivers to the project team's addresses and is rate-limited; configure custom SMTP before real learners sign up". Until custom SMTP is set up, a learner who signs up never receives the link, so they cannot finish signing up or sign in.

## Why only a person can do this

- Choosing an email provider is a decision about money and a contract.
- Verifying the domain means editing the DNS of `elegantfrontend.training`.
- The SMTP credentials are secrets, which only a person may paste into Supabase.

## Steps

1. Choose an email provider and add `elegantfrontend.training` as a sending domain.
2. Publish the SPF, DKIM and DMARC records it asks for. The research's sender rules (cmo.md, newsletter) cite Gmail's and Yahoo's requirements.
3. In Supabase, go to **Authentication > Emails > SMTP Settings**, enable custom SMTP, enter the provider's host, port, username and password, and set the sender address, for example `no-reply@elegantfrontend.training`.
4. In Supabase, go to **Authentication > URL Configuration**. Confirm the Site URL and the `/account/` redirect URL. Add `http://localhost:4000/account/` for local work.
5. Sign up with an address outside the project team, and confirm the email arrives and its link signs you in.

## Decision

- Email provider:
- Sender address:
- Date verified:

## After

The CTO's training-site cell runs the sign-up, sign-in-link and password-reset flows end to end against `/account/`. The COO then moves the roadmap row to `shipped`, and the changelog can announce sign-in by email link.
