# Server Localization

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-localization)

> `server-localization` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Localization and internationalization — key-based translation catalogues with a fallback chain, CLDR plural rules via `Intl.PluralRules`/ICU messages, `Intl.DateTimeFormat`/`NumberFormat` for regional formatting, RTL layouts with CSS logical properties, per-locale bundle splitting, and locale detection plus `hreflang` URLs for SEO. Use when extracting hardcoded strings, adding a second locale, fixing broken plurals or date formats, or wiring a language switcher.

## When to use

Extracting hardcoded UI strings into a translation catalogue; adding a new locale or a language switcher; fixing pluralisation that only works in English; formatting dates, numbers, or currency per region; adding RTL (Arabic/Hebrew) support; splitting locale bundles so one locale doesn't ship all of them; choosing a localised URL strategy with hreflang.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-localization
```

Or copy the [`server-localization/`](.) folder into your agent's skills directory.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/translations/**/*.{js,ts,json}`
- `**/locales/**/*.{js,ts,json}`
- `**/*i18n*.{js,ts,jsx,tsx}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
