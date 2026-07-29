# Server Images

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-images)

> `server-images` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Image delivery and optimisation — responsive `srcset`/`sizes`, `<picture>` for art direction and AVIF/WebP fallbacks, native lazy loading, explicit dimensions to prevent CLS, `fetchpriority`/preload for the LCP image, and CDN URL transformation. Use when adding images to a page, fixing slow LCP or layout shift, or reviewing an image component's API.

## When to use

Adding or reviewing image markup and image components; picking `srcset` vs `<picture>`; choosing AVIF/WebP with a JPEG fallback; deciding which images lazy-load vs eager-load; fixing Cumulative Layout Shift from missing dimensions or slow Largest Contentful Paint.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-images
```

Or copy the [`server-images/`](.) folder into your agent's skills directory.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/atoms/Image/**/*`
- `**/*Image*.{jsx,tsx,vue,js,ts}`
- `**/images/**/*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
