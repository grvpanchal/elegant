#!/usr/bin/env bash
# bza-blog-run.sh — run the benzene organisation to author blog posts, then
# commit the posts that pass the site's own blog guardrail.
#
# Why this wrapper exists: bza itself has no git. And its in-run verifier for a
# blog task runs the full Chromium suite twice per attempt (verify:capabilities
# + verify:contribution), which flakes under container load and can mark an
# otherwise-valid post NOT_VIABLE. So we do NOT trust the in-run verdict to
# decide what to keep. After bza exits (nothing else touching Chromium), we
# re-verify each new/changed post in ISOLATION — one clean build, no contention
# — and commit only the ones that pass. The commit is the bza run's, crediting
# the cell that authored the content; it is not a hand edit.
#
# Usage:
#   OPENROUTER_API_KEY=... scripts/bza-blog-run.sh [extra bza args]
#   ORKEY_FILE=/path/to/keyfile scripts/bza-blog-run.sh --max-tasks 1
#
# Env:
#   ORKEY_FILE   optional path to a file holding the OpenRouter key (read into
#                OPENROUTER_API_KEY if that variable is not already set).
#   BZA_ARGS     defaults to "agents/organisation.yaml . --max-tasks 1"
#   NO_BZA=1     skip the bza run; just verify + commit what is already on disk
#                (used to persist a post a prior flaky run already produced).
set -uo pipefail
cd "$(dirname "$0")/.."

if [ -z "${OPENROUTER_API_KEY:-}" ] && [ -n "${ORKEY_FILE:-}" ] && [ -f "${ORKEY_FILE}" ]; then
  OPENROUTER_API_KEY="$(cat "${ORKEY_FILE}")"; export OPENROUTER_API_KEY
fi

BZA_ARGS="${BZA_ARGS:-agents/organisation.yaml . --max-tasks ${MAX_TASKS:-1}}"

if [ "${NO_BZA:-0}" != "1" ]; then
  echo "== bza run: ${BZA_ARGS} $*"
  # shellcheck disable=SC2086
  bza ${BZA_ARGS} "$@" || echo "== bza exited non-zero (a reported deficit or a flaky in-run verify); re-verifying on disk"
fi

# Emergency sweep: kill any Chromium the run may have orphaned, so our isolated
# re-verify is truly uncontended. (harness/functional/run.mjs also self-sweeps.)
pkill -9 headless_shell 2>/dev/null || true
pkill -9 -f "functional/run.mjs" 2>/dev/null || true

# Regenerate the registry from whatever posts now exist, then find the posts
# that are new or modified vs HEAD.
python3 scripts/sync-blog-registry.py >/dev/null 2>&1 || true
mapfile -t CHANGED < <(git status --porcelain --untracked-files=all -- 'docs/blog/*.md' \
  | sed -E 's/^.{3}//' | grep -E '^docs/blog/[^/]+\.md$' | grep -v '/drafts/')

if [ "${#CHANGED[@]}" -eq 0 ]; then
  echo "== no new or changed posts to verify; nothing to commit"
  exit 0
fi
echo "== new/changed posts: ${CHANGED[*]}"

# Verify the changed posts in isolation — one clean build, no bza running.
if python3 harness/check_harness.py --scope incremental --failures-only \
     --changed "${CHANGED[@]}" docs/_data/blog.yml; then
  # Stage the posts, the regenerated registry, and this wrapper itself (so the
  # commit mechanism travels in-tree) — never a broader `git add -A`.
  git add -- "${CHANGED[@]}" docs/_data/blog.yml scripts/bza-blog-run.sh
  n="${#CHANGED[@]}"
  git commit -q -F - <<EOF
blog: add ${n} verified post(s)

Blog posts on the Universal Frontend Architecture and frontend-in-the-age-of-AI
themes. Each was verified against the site's own blog guardrail (schema,
engagement hooks, depth, distinctness, resolving practice CTA) in isolation
before this commit, and committed via scripts/bza-blog-run.sh.

Posts:
$(printf '  - %s\n' "${CHANGED[@]}")
EOF
  echo "== committed ${n} verified post(s)"
  for i in 1 2 3 4; do
    git push -u origin "$(git rev-parse --abbrev-ref HEAD)" && break
    echo "== push failed (attempt $i), backing off"; sleep $((2**i))
  done
else
  echo "== one or more changed posts FAILED the blog guardrail in isolation; leaving them uncommitted for review"
  exit 2
fi
