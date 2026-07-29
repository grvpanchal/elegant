# Server SEO

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-seo)

> `server-seo` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Technical SEO for frontend apps — crawlable HTML on the first response, per-route `<title>`/description, Open Graph and Twitter Card previews, JSON-LD structured data (Product, Article, BreadcrumbList, FAQPage), canonical URLs and hreflang clusters, XML sitemaps and `robots.txt`, semantic headings and alt text, and Core Web Vitals (LCP/INP/CLS). Use when a route needs metadata, share previews render blank, rich results are missing, or crawlers only see an empty `#root`.

## When to use

Adding or auditing per-route title/description/canonical metadata; fixing blank Open Graph or Twitter share previews; adding JSON-LD for rich results; generating a sitemap or editing `robots.txt`; setting up hreflang for localised routes; diagnosing why a client-rendered SPA route is not indexed; chasing LCP/INP/CLS regressions that affect Page Experience.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-seo
```

Or copy the [`server-seo/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/robots.txt`
- `**/sitemap*.{xml,js,ts}`
- `**/*{Seo,SEO,Meta,Head,StructuredData}*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
