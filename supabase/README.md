# Supabase

The site's accounts use the Supabase project in `docs/_config.yml`
(`supabase.url`, `supabase.anon_key` — a publishable key, safe in client code
only because row-level security is on). Only the **email** auth provider is
enabled.

## Migrations — run them in the Supabase SQL editor

There is no CI step that applies these. Open the project's dashboard →
**SQL Editor** → **New query**, paste the file, and run it (or `supabase db push`
from a linked checkout). Each file is safe to re-run.

| File | What it creates |
| --- | --- |
| `migrations/0001_progress.sql` | `public.progress (user_id, slug, done, updated_at)`, primary key `(user_id, slug)`, row-level security enabled, and select/insert/update/delete policies that each restrict a row to its owner (`auth.uid() = user_id`). `anon` has no access. |

Until `0001_progress.sql` is run, the REST API answers `404 PGRST205` for
`/rest/v1/progress`. `progress-sync.js` treats that as "unavailable": progress
stays in the browser, the dashboard and account page say **device-only**, and
nothing breaks. After it is run, sign in and the dashboard says **Synced**.

To check RLS after running it: with only the publishable key (no sign-in),
`GET /rest/v1/progress` must return `[]` or 401 — never someone's rows.

## Auth settings the site expects

- **Authentication → Providers → Email**: enabled, "Confirm email" on (the
  sign-up form says a confirmation email is coming).
- **Authentication → URL Configuration**: Site URL
  `https://elegantfrontend.training`, and add
  `https://elegantfrontend.training/account/` to **Redirect URLs**. Sign-up
  confirmation, magic-link and password-reset emails send people back to
  `/account/` (`redirect_to`); a URL not on the list falls back to the Site URL,
  where the session is still picked up, but the account page is where the
  password-reset form lives. Add `http://localhost:4000/account/` for local work.
- **Emails**: the built-in mailer only delivers to the project team's
  addresses and is rate-limited; configure custom SMTP before real learners
  sign up.

Never put the service-role key (or any secret) anywhere under `docs/`.
