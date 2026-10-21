---
title: Elegant, the brand introduction video
why: 'The CEO, 2026-10-20: "Youtube videos are terrible remove both of them. Use a service that does the introduction video for you brand".'
service: HeyGen Video Agent, POST https://api.heygen.com/v3/video-agents (developers.heygen.com/docs/video-agent)
made_by: python3 .benzene/scripts/heygen_video.py .benzene/material/marketing/briefs/brand-intro-video.md --orientation landscape
orientations:
  landscape: the YouTube channel trailer and the launch video
  portrait: a Short, an Instagram Reel and a LinkedIn video, made from the same brief
duration_s: 60
files:
  - .benzene/material/marketing/media/avatar.png
  - docs/assets/img/ui-server-state.png
  - .benzene/material/marketing/briefs/brand-intro/site-question.jpg
  - .benzene/material/marketing/briefs/brand-intro/site-practice.jpg
  - docs/assets/img/ai-sdlc-flow.png
  - .benzene/material/marketing/briefs/brand-intro/site-home.jpg
out: .benzene/material/marketing/media/brand-intro-{orientation}.mp4
source: "odra.dev/slopfix, fetched 2026-10-19 (three senior engineers, one week, $10,000; the guardrails it hands back: a CLAUDE.md, lint rules, CI checks); skills/ (45 Agent Skills, each with path globs); docs/_data/questions.yml (practice questions with tests); the live site, screenshots taken 2026-10-20"
---
Make a 60-second brand introduction video for Elegant, a free training site at elegantfrontend.training.

WHO IT IS FOR
Frontend developers who have lost work to AI coding agents, and the tech leads who now review what those agents write. They are skeptical of hype and of AI marketing. Speak to them as one developer to another: calm, direct, specific.

WHAT IT MUST SAY
AI-written code that passes review and every test can still be slop. Teams now pay to have it cleaned up. The guardrails a cleanup hands back are a harness, and Elegant teaches you to build that harness, and the architecture behind it, before the first prompt. That is the job left for a developer when an agent writes the code.

NARRATION (use these words; about 140 words; a calm, warm, confident voice; no music swells over the voice)
Scene 1: "AI writes the code now. A lot of it is slop: it passes review, it passes every test, and it still makes the codebase worse."
Scene 2: "There's now a service that charges ten thousand dollars for one week of cleaning it up. What it hands back is guardrails: rules, lint, checks. That's a harness, and you can build it before the first prompt."
Scene 3: "Elegant teaches the architecture that prevents AI slop. Three layers: UI, Server and State. Forty-five open-source Agent Skills that load with the files they cover, so your agent follows the rules without being reminded. And practice questions with real tests that run in your browser."
Scene 4: "The agent writes the code. You decide where the boundaries go, write the check, and say when it's done. That's the job that's left."
Scene 5: "Learn it free, with no sign-up, at elegant frontend dot training."

SCENES (visuals; keep each scene's narration whole)
1. 0 to 10 s. A code editor where code appears fast, as if an agent typed it, and a column of green test ticks beside it. On-screen text: "Passes every test. Still slop."
2. 10 to 24 s. On-screen text: "$10,000 for one week of cleanup". Then three labels appear one by one, "Rules", "Lint", "Checks", and gather under one word: "Harness".
3. 24 to 44 s. The second attached image (UI, Server, State), then this command on screen in a monospace font: npx skills add grvpanchal/elegant --skill ui-atom, then the third and fourth attached images (a practice question page and the practice bank) as screens, slowly panned.
4. 44 to 54 s. The fifth attached image (an agent workflow: requirements and data contracts at the top, an orchestrator agent and its subagents writing the code, continuous evaluation at the bottom), slowly zooming from the requirements box to the evaluation box. On-screen text: "You set the boundary. You write the check."
5. 54 to 60 s. The first attached image (the Elegant logo) centred on the brand background, with "elegantfrontend.training" large under it and "Free. No sign-up." under that. Hold for at least 3 seconds.
The sixth attached image is the site's home page: use it as a screen in scene 3 or 5 if it helps.

PRESENTER
No on-screen avatar or presenter: voice-over with the visuals above. This brand's whole message is that output should be checked, so the video must not look machine-made: no synthetic faces, no lip-synced spokesperson.

LOOK
Background #fff7f2 (warm off-white), text #202028, accent #fe854c (orange), second accent #155799 (blue). Font: Open Sans, or a clean sans-serif close to it. Code in a monospace font on a dark panel. Calm cuts and slow pans; burned-in captions that match the narration word for word.

DO NOT
- Do not invent numbers, quotes, customers, testimonials, prices or features. Mention nothing that is not in the narration (no courses, certificates, dashboards, pricing, job guarantees).
- Do not name any company, competitor or cleanup service, and show no other brand's logo.
- No stock footage of offices, handshakes, robots, glowing brains or holograms, and no made-up user interfaces: the product's screens are the attached images only.
- Spell "Elegant" and "elegantfrontend.training" exactly, and keep the command exactly as written.
- Read "npx" as "N P X" and "elegantfrontend.training" as "elegant frontend dot training".
