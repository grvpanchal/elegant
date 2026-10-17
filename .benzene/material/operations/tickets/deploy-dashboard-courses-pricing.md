---
title: Merge and deploy the dashboard, courses and pricing
owner: ceo
status: todo
office: coo
created: 2026-10-17
unblocks:
  - 'Dashboard'
  - 'Four free courses with 28 lessons'
  - 'Pricing page with PayPal sandbox checkout'
  - 'Public roadmap, changelog, contribution guide and issue forms'
acceptance:
  - 'The dashboard, courses and pricing changes in the working tree are committed and merged to master, together with ROADMAP.md, CHANGELOG.md, CONTRIBUTING.md and .github/ISSUE_TEMPLATE/.'
  - 'https://elegantfrontend.training/dashboard/, /courses/ and /pricing/ each answer 200. On 2026-10-17 all three answered 404.'
  - 'The labels bug, content-correction, skill-or-question-request and triage exist on github.com/grvpanchal/elegant, so the issue forms can apply them.'
  - 'The 2026-10-17 entry in CHANGELOG.md describes only what is live. Anything held back is removed from the entry, and its roadmap row is set back to in-progress, on the same day.'
---

# Merge and deploy the dashboard, courses and pricing

On 2026-10-17, several changes were in the working tree of branch `claude/frontend-ai-harness-site-mbrefi`, uncommitted:

- the dashboard (`docs/dashboard/`);
- the four free courses (`docs/courses/`, `docs/_data/courses.yml`);
- the pricing page with sandbox checkout (`docs/pricing/`, `docs/_data/pricing.yml`);
- this operations material.

On the live site, `/dashboard/`, `/courses/` and `/pricing/` answered **404**. CHANGELOG.md and ROADMAP.md already list these as shipped on 2026-10-17. They become true when this ticket is done.

## Why only a person can do this

The organisation never commits or pushes: `heartbeat.commit: false` in `.benzene/benzene-org.yaml`, and "the CEO merges and pushes". CI (`.github/workflows/ci.yml`) builds the site and deploys it to GitHub Pages on a push to `master`, so the CEO's merge is the release.

## Steps

1. Review the working tree with `git status` and `git diff`. Leave out anything you are not ready to release.
2. Build the site locally with `python3 .benzene/checks/site.py build`, and run `python3 scripts/check-courses.py`.
3. Commit, open a pull request to `master`, and merge it. Wait for the CI deploy to finish.
4. Create the four issue labels on GitHub. They are `bug`, `content-correction`, `skill-or-question-request` and `triage`. An issue form applies a label only if the label already exists.
5. Open `/dashboard/`, `/courses/` and `/pricing/` on the live site.

## Decision

- Merged on (date and pull request):
- Held back, if anything:

## After

If the deploy date is not 2026-10-17, the COO updates the changelog entry's date to the day it went live, along with the roadmap rows that link to it. The CXO's beta-test cell then walks the learner journey on the live site: dashboard, a course, marking a lesson complete, and pricing.
