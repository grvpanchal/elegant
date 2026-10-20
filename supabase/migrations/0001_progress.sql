-- 0001_progress.sql — the one table docs/assets/js/progress-sync.js reads and writes.
--
-- Run once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query),
-- or with `supabase db push` if the project is linked. Safe to re-run.
--
-- What the client does with it (account-supabase.js):
--   GET  /rest/v1/progress?select=slug,done,updated_at
--   POST /rest/v1/progress?on_conflict=user_id,slug
--        Prefer: resolution=merge-duplicates   (an upsert: INSERT ... ON CONFLICT DO UPDATE)
--        body: [{ user_id, slug, done, updated_at }]
-- always with the publishable key as `apikey` and the signed-in user's access
-- token as the bearer. The publishable key is public, so row-level security is
-- the ONLY thing between one learner's rows and everyone else: every policy
-- below pins a row to auth.uid().

create table if not exists public.progress (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  slug       text        not null check (char_length(slug) between 1 and 200),
  done       boolean     not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, slug)
);

comment on table public.progress is
  'Per-learner completion of questions, plan readings and course lessons, mirrored from the site''s localStorage by progress-sync.js. One row per (user, key).';
comment on column public.progress.slug is
  'A progress key: a question slug (action-creators), a concept-doc ref (ui/atom) or a lesson (lesson:<course>/<slug>).';
comment on column public.progress.updated_at is
  'When the learner marked it done on the device that recorded it (client-supplied).';

-- With RLS on and no policy, nobody can read or write a row; the policies
-- below then open exactly one learner's own rows to that learner. (The
-- service_role key bypasses RLS by design — which is why it must never appear
-- anywhere under docs/.)
alter table public.progress enable row level security;

drop policy if exists "progress: owner can read"   on public.progress;
drop policy if exists "progress: owner can insert" on public.progress;
drop policy if exists "progress: owner can update" on public.progress;
drop policy if exists "progress: owner can delete" on public.progress;

create policy "progress: owner can read" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "progress: owner can insert" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "progress: owner can update" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "progress: owner can delete" on public.progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Signed-out visitors (the anon role, i.e. the publishable key alone) get
-- nothing at all; signed-in learners get exactly what the policies allow.
revoke all on table public.progress from anon;
revoke all on table public.progress from public;
grant select, insert, update, delete on table public.progress to authenticated;
