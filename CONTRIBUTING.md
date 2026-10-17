# Contributing to Elegant

Thank you for helping. This repository holds four things:

- the `elegant` CLI (`index.js`), which copies a template into a new project;
- seven templates under `templates/`: interchangeable React, Vue, Angular and Web Components shells over one UI / Server / State architecture;
- 45 Agent Skills under `skills/`, one for each term;
- the training site [elegantfrontend.training](https://elegantfrontend.training), a Jekyll site under `docs/`.

It is used by frontend developers who lost their jobs to AI. So be exact: a wrong lesson costs them more than a missing one.

## Check with the owner before large work

**For anything larger than a small fix, open an issue first, and wait for a reply before you start.** Large work includes a new question, lesson, skill, template or page, a rewrite, a new dependency, or a change that touches more than one area. A reply tells you whether the work fits the [roadmap](ROADMAP.md) and whether someone is already doing it. It also tells you which office will review it.

| Area | Owning office |
|---|---|
| Practice bank, courses, dashboard, account, templates, Agent Skills, terminology docs | CTO |
| Roadmap, changelog, triage of issues and pull requests | COO |
| Blog, newsletter, social posts | CMO |
| Feedback, analytics, beta tests of changes | CXO |
| Pricing, checkout, payments | CFO |
| Sponsors, pitch, traction | CIO |

Small fixes do not need an issue first. Examples: a typo, a broken link, a wrong version number, a failing test you can fix.

## Content changes

Most content is a Markdown file, and you can edit it in your browser on GitHub. You do not need to clone anything.

1. Find the file behind the page:

   | Page on the site | File in this repo |
   |---|---|
   | `/ui/atom.html`, `/server/router.html`, `/state/store.html` | `docs/ui/atom.md`, `docs/server/router.md`, `docs/state/store.md` |
   | `/practice/<slug>.html` | `docs/practice/<slug>.md` (code: `docs/practice/workspace/<slug>/`) |
   | `/courses/<course>/<lesson>.html` | `docs/courses/<course>/<lesson>.md` |
   | `/guides/<slug>.html`, `/playbooks/<slug>.html`, `/plans/<slug>.html` | `docs/guides/<slug>.md`, `docs/playbooks/<slug>.md`, `docs/plans/<slug>.md` |
   | `/blog/<slug>.html` | `docs/blog/<slug>.md` |
   | an Agent Skill | `skills/<name>/SKILL.md` |

2. Open the file on GitHub and click the pencil icon (**Edit this file**). GitHub forks the repository for you.
3. Make one change. In the commit message, say what was wrong and how you know. Then click **Propose changes** and open the pull request.

Content rules:

- **One change per pull request.** A pull request that fixes a lesson, renames headings and reflows paragraphs all at once cannot be reviewed.
- **Cite a source for every factual change.** Use a spec, MDN, or the framework's own docs or changelog, and put the link in the pull request.
- **Keep the shape of a terminology doc.** A doc under `docs/{ui,server,state}/` keeps its sections: Key Insight, Detailed Description, Code Examples, Common Mistakes, Quick Quiz and References. A term and its Agent Skill must agree. If you change one, check the other. The maintainers run the doc reviewer on every terminology doc a pull request touches.
- **Keep the front matter.** It is a contract. Questions need `format`, `difficulty`, `layer`, `topics`, `skill` and `minutes`. Lessons need `term`, `skill`, `practice`, `description` and `insight`, and their body is 300–600 words.
- **Company interview guides keep their provenance note.** The note says the process is commonly reported, not sourced from the company, and subject to change. Soften a claim rather than delete the note.
- **Do not edit generated files.** These are `docs/_data/questions.yml`, `docs/_data/book.yml` and the PDF under `docs/assets/book/`. A maintainer regenerates them.

To report a mistake without fixing it yourself, use the [content correction form](https://github.com/grvpanchal/elegant/issues/new?template=content-correction.yml).

## Code changes

Clone the repository, make a branch, and run the checks for the part you changed.

- **A template** (`templates/<name>/`). Each template is a standalone project with its own `package.json`. Work inside it with `npm install`, `npm test`, `npm run build` and `npm run storybook`.
  - Keep the shared atomic layout: `src/ui/{atoms,molecules,organisms,templates,skeletons}`, `src/containers`, `src/state`.
  - Keep the file suffixes: `.component.*`, `.style.*`, `.stories.*` and `.type.*`.
  - The seven templates are meant to be interchangeable, so a structural change in one usually belongs in all of them.
  - A new template needs a folder, an entry in `demos.sh` and an entry in `.github/workflows/ci.yml`.
- **The CLI** (`index.js`). It stays a thin CLI with three runtime dependencies. Do not add a bundler, TypeScript or a lint config at the repository root.
- **The site** (`docs/`). It uses plain Jekyll and vanilla JavaScript: no framework, no CDN script, no build step.
  - After you change a question, run `python3 scripts/sync-questions-registry.py`.
  - After you change a course, run `python3 scripts/check-courses.py`.
  - Coding questions need `starter.js`, `solution.js` and a dependency-free `tests.js` under `docs/practice/workspace/<slug>/`.
  - Build the site with `python3 .benzene/checks/site.py build` before you open the pull request.
- **Secrets.** Only the Supabase publishable key and the PayPal sandbox client id belong in `docs/_config.yml`, because both are public by design. Never commit a service-role key, a PayPal secret or any other credential.

Write a pull request description with three parts:

- **Summary:** what changed and why.
- **Test plan:** the commands you ran and what they printed.
- **Screenshots:** include them for any visible change.

Tick "Tests updated" and "Docs updated" when they apply.

## What is not accepted

- **Self-promotion.** This means links to your own course, blog, newsletter, product, affiliate program or social account, unless the page you link is the primary source for the fact. If it is, say so in the pull request.
- **AI-generated filler.** This means generic prose, padded explanations, hedging that commits to nothing, and invented references, versions, numbers or quotes. You may use AI tools if you have read, run and can explain every line you submit. Say in the pull request that you used them.
- **Unverified code.** Every example must run, and every test must pass.
- **Taking anything away from the free tier.** Every course, question, plan and Agent Skill stays free and needs no signup. A pull request that locks content behind payment or an account will be closed.
- **Price changes.** Prices are the CFO office's proposal and the CEO's decision. To discuss a price, open an issue.
- **Edits to `.benzene/`.** That folder is the organisation's own record: its standards, checks and plans. To suggest a change to it, open an issue.
- **Drive-by churn.** This means mass reformatting, renaming, dependency bumps or a lint config that nobody asked for.
- **Edits to generated files** (listed under [Content changes](#content-changes)).

## Reporting problems

Blank issues are switched off. Choose a form at [New issue](https://github.com/grvpanchal/elegant/issues/new/choose):

- **Bug:** something on the site, in a template or in the CLI is broken.
- **Content correction:** a lesson, doc, question or skill is wrong or out of date.
- **Skill or question request:** a term, skill, question or lesson you want added.

Never paste a password, a token, an email address or a payment detail into an issue.

## Licence

By contributing, you agree that your contribution is released under the repository's licence (ISC, see `package.json`).
