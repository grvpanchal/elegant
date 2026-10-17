---
title: Run the progress migration in the Supabase SQL editor
owner: ceo
status: todo
office: cto
created: 2026-10-17
unblocks:
  - 'Progress synced to your account across browsers'
acceptance:
  - 'supabase/migrations/0001_progress.sql has been run once in the project''s SQL editor (Dashboard > SQL Editor > New query > paste > Run).'
  - 'GET <supabase.url>/rest/v1/progress?select=slug&limit=1, sent with only the publishable key as apikey, no longer answers 404 (PGRST205). It answers [] or 401, and never returns another learner''s rows.'
  - 'Signed in at https://elegantfrontend.training/account/ in a new tab, after you mark one lesson complete, the dashboard says "Synced", not "Device only".'
  - 'The same lesson shows as done in a second browser that is signed in to the same account.'
---

# Run the progress migration in the Supabase SQL editor

The code that syncs progress to an account is already on the site: `docs/assets/js/progress-sync.js` mirrors it to `public.progress`. That table does not exist yet. On 2026-10-17, `GET <supabase.url>/rest/v1/progress` answered **404**. Until the table exists:

- sync reports `unavailable`;
- every learner's progress stays in one browser;
- the dashboard and the account page say **Device only**.

## Why only a person can do this

- No CI step applies migrations (`supabase/README.md`).
- The SQL editor needs the project owner's Supabase login.
- By rule, the organisation holds no service-role key, so it cannot create tables itself.

## Steps

1. Open the Supabase project named by `supabase.url` in `docs/_config.yml`.
2. Go to **SQL Editor > New query**, paste the whole of `supabase/migrations/0001_progress.sql`, and click **Run**. The file is safe to re-run. It creates:
   - `public.progress (user_id, slug, done, updated_at)`, with primary key `(user_id, slug)`;
   - row-level security, with one owner-only policy for each of select, insert, update and delete;
   - no access for `anon`.
3. Check row-level security using only the publishable key: `GET /rest/v1/progress` must return `[]` or 401, and never anyone's rows.
4. Open a **new** tab, sign in at `/account/`, and mark one lesson complete. Use a new tab because sync remembers "unavailable" in a tab for 10 minutes. The dashboard should then say **Synced**.

## Decision

- Date run:
- Result of the row-level security check in step 3:

## After

The CTO's training-site cell confirms that the dashboard and the account page show "Synced" for a signed-in learner. The COO then moves the roadmap row to `shipped` and adds the change to CHANGELOG.md.
