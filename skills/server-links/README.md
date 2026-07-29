# Server Links

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-links)

> `server-links` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Links and navigation — `<a href>` vs `<button>` semantics, client-side router links vs full page reloads, `rel="noopener noreferrer"` on `target="_blank"`, `javascript:` href sanitisation, URL/search-param state, prefetch strategies (hover / viewport / idle) and resource hints, `aria-current` and skip links, canonical URLs and crawlability. Use when adding navigation, building a Link component, or reviewing an anchor that isn't really navigating.

## When to use

Adding or reviewing navigation markup and Link components; deciding between an anchor and a button; wiring client-side router links while keeping a real `href` for no-JS and crawlers; securing external links and user-supplied hrefs; storing filter/search/pagination state in the URL; choosing a prefetch strategy or resource hint; fixing `href="#"` anchors used as action controls.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-links
```

Or copy the [`server-links/`](.) folder into your agent's skills directory.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/atoms/Link/**/*`
- `**/*Link*.{jsx,tsx,vue,js,ts}`
- `**/{routes,router,navigation}/**/*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
