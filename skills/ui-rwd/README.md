# UI RWD

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-rwd)

> `ui-rwd` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Responsive Web Design — mobile-first `min-width` media queries, fluid grids and `max-width` containers, flexible images, the viewport meta tag, content-driven breakpoints, relative units and `clamp()` fluid typography, flexbox vs grid vs container queries, and keeping breakpoint decisions at the organism layer. Use when writing component CSS, adding breakpoints, fixing horizontal scroll on small screens, or making a component adapt to its container.

## When to use

Writing or reviewing component stylesheets and layout CSS; converting desktop-first `max-width` queries to mobile-first; choosing where to put a breakpoint; replacing fixed pixel widths that cause horizontal scrolling; adding fluid typography with `clamp()`; deciding between media queries and container queries for a reusable component; verifying the viewport meta tag and image flexibility.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill ui-rwd
```

Or copy the [`ui-rwd/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/**/*.style.{css,scss}`
- `**/ui/theme.css`
- `**/{index,App}.{css,html}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
