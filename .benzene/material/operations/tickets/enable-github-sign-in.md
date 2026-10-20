---
title: Enable GitHub sign-in in Supabase auth
owner: ceo
status: todo
office: cto
created: 2026-10-17
unblocks:
  - 'Sign in with GitHub on the account page'
acceptance:
  - 'GET <supabase.url>/auth/v1/settings, sent with the publishable key as apikey, shows "github": true under "external". On 2026-10-17, only "email" was true.'
  - 'The GitHub OAuth app''s authorization callback URL is <supabase.url>/auth/v1/callback, and its client secret is stored only in Supabase: not in this repository, not in a ticket.'
  - 'Under Authentication > URL Configuration, the Redirect URLs still include https://elegantfrontend.training/account/.'
  - 'Under ## Decision, the CEO records whether Google sign-in should be enabled the same way.'
---

# Enable GitHub sign-in in Supabase auth

The account page offers email sign-in only. On 2026-10-17, the project's public auth settings listed `email` as the only enabled provider. The research found that all 8 competitors with sign-in offer GitHub (`.benzene/standards/cto.md`, bar 6). GitHub is also the account a frontend developer already has.

## Why only a person can do this

- The OAuth app has to be registered under the CEO's GitHub account (or the organisation's GitHub account).
- It creates a client secret, which only a person may handle.
- The secret is pasted into the Supabase dashboard, which needs the project owner's login.

## Steps

1. In GitHub, go to **Settings > Developer settings > OAuth Apps > New OAuth App** and fill in:
   - Application name: the brand name.
   - Homepage URL: `https://elegantfrontend.training`.
   - Authorization callback URL: `<supabase.url>/auth/v1/callback`, where `supabase.url` is the value in `docs/_config.yml`.
2. Generate a client secret. Copy it straight into the next step, and nowhere else.
3. In Supabase, go to **Authentication > Sign In / Providers > GitHub**, enable it, paste the Client ID and Client Secret, and save.
4. In Supabase, go to **Authentication > URL Configuration** and confirm the Redirect URLs include `https://elegantfrontend.training/account/`. Add `http://localhost:4000/account/` as well, for local work.
5. Optional: enable Google the same way, with an OAuth client from Google Cloud. The CTO's bar 6 asks for GitHub, Google and the email magic link.

## Decision

- GitHub enabled on:
- Google enabled as well (yes or no):

## After

The CTO's training-site cell adds a "Sign in with GitHub" button to `/account/`, using `provider=github` in `docs/assets/js/account-supabase.js`. The session it returns is verified against the project's JWKS, like any other session, before it means anything. Signup stays optional for learning.
