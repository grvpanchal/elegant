# workflow/

Weekly AI video + newsletter production pipeline for **elegantfrontend.training**.

Each weekly run lives in `workflow/YYYY-MM-DD/` (dated on the publish day, ISO-8601). The pipeline runs in six phases — Phase 1 must be approved before Phase 2 begins, and the script must be approved before avatar generation in Phase 3.

## Per-week directory layout

```
workflow/YYYY-MM-DD/
├── curated_updates.json        Phase 1 — research output, 10–15 items
├── script_vYYYYMMDD.md         Phase 2 — final video script
├── avatar_video.mp4            Phase 3 — HeyGen render
├── visuals/                    Phase 4 — section cards + B-roll
├── final_render.mp4            Phase 5 — Premiere export
├── blog_post.md                Phase 6 — long-form article
├── newsletter_draft.html       Phase 6 — Mailchimp-ready email
└── shorts_clips/               Phase 6 — Opus Clip exports
```

## Phase gates

| Phase | Owner               | Output                  | Approval needed before next phase                |
|-------|---------------------|-------------------------|--------------------------------------------------|
| 1     | Research agent      | `curated_updates.json`  | Yes — Gaurav signs off on item list              |
| 2     | Claude writer       | `script_vYYYYMMDD.md`   | Yes — Gaurav signs off on script before render   |
| 3     | ElevenLabs + HeyGen | `avatar_video.mp4`      | No (auto-poll until render completes)            |
| 4     | Design agent        | `visuals/`              | No                                               |
| 5     | Premiere + n8n      | `final_render.mp4`      | Yes — manual edit-review pass                    |
| 6     | Distribution agent  | All channel outputs     | Yes — Google Form / Slack "Approve for publish"  |

## Source list (Phase 1)

Locked sources the research agent scans every week:

- GitHub Trending (JavaScript + TypeScript, weekly window)
- Hacker News (Algolia API, `created_at > now-7d`)
- Dev.to top-of-week (`frontend`, `architecture`, `ai`)
- Curated X/Twitter lists (Theo, Kent C. Dodds, Addy Osmani)
- Official changelogs — React, Next.js, Vite, Turborepo
- AI frontier — v0, Cursor, Bolt, Vercel AI SDK

## Quality gates

- Every item must have a verified, dated source URL
- Items must fall inside the 7-day window (`week_of` ± 7 days)
- Each item must pass the "so what?" test for an engineering-lead audience
- Total video runtime: 8–14 minutes, max 60s per segment

## Not in scope of this folder

- The `skills/` folder publishes Agent Skills to skills.sh — those are separate artefacts.
- The `templates/` folder is the CLI's payload — untouched by this pipeline.
