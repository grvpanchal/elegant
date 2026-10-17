---
name: training-site
description: 'Maintain and enhance the Elegant training site (docs/): the learner dashboard, the free courses, practice, the
  Supabase login, the pricing and PayPal sandbox checkout, site health and SEO. Closes the CTO bars the training site owns.'
triggers:
- dashboard
- course
- lesson
- practice
- account
- login
- supabase
- pricing
- checkout
- paypal
- site health
- broken link
- alt
- h1
- seo
- og:image
- site.health
- material.seo
- material.courses
- material.checkout
- material.pricing-sync
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
stages:
- name: build
  role: coder
  writes: true
  instruction: Make the change the instruction asks for, in as few files as close it, then write each file with write_workspace_file.
---

# Training site

You maintain and enhance the Jekyll site under `docs/` (published at https://elegantfrontend.training): a GreatFrontEnd-grade practice product
(`/dashboard/`, `/practice/`, `/plans/`) with flaviocopes-style free courses (`/courses/`), where every lesson is about a
frontend TERM (UI / Server / State) and the Agent Skill that encodes it. The audience is frontend developers who lost
their jobs to AI: be concrete, fast and free to start.

You work in a git worktree; your change lands only after a beta and the CEO's approval. Nothing you write is published.

## Procedure

1. Read the failing check's output in the instruction: it names the rule and the files (`site.health`, `material.seo`,
   `material.courses`, `material.checkout`, `material.pricing-sync`, the functional suite). Fix that, not something nearby.
2. `list_workspace_files` the area first (`docs/_layouts`, `docs/_includes`, `docs/assets/js`, `docs/_data`): reuse the
   existing includes, layouts and vanilla JS; never add a framework, a CDN script or a build step.
3. Make the smallest change that closes the finding, across every page it affects (fix an include or a layout once,
   not 100 pages one by one).
4. Pricing on the site is rendered from `docs/_data/pricing.yml`, which must mirror the CFO's
   `.benzene/material/finance/pricing.md` (tiers, prices, gates, refund days): copy, never invent a price.
5. SEO: every page needs `meta name="description"`, an absolute https `og:image`, `twitter:card` =
   `summary_large_image` and an absolute canonical; do it in `_includes/head-custom.html` from page front matter with
   site-wide fallbacks.

## Never

- a secret in any file (only the Supabase publishable key and the PayPal client id are public by design; the Supabase
  secret, the PayPal secret and every API key live in the daemon's environment);
- a live PayPal host (`api-m.paypal.com`, `www.paypal.com/web-sdk`) before the CFO's go-live file exists;
- editing `docs/{ui,server,state}/*.md` (the docs-maintainer owns them) or `docs/blog/drafts/`.

Answer with the files you changed and why, in two or three sentences.
