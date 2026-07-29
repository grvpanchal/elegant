---
name: server-localization
description: Localization and internationalization — key-based translation catalogues with a fallback chain, CLDR plural rules via `Intl.PluralRules`/ICU messages, `Intl.DateTimeFormat`/`NumberFormat` for regional formatting, RTL layouts with CSS logical properties, per-locale bundle splitting, and locale detection plus `hreflang` URLs for SEO. Use when extracting hardcoded strings, adding a second locale, fixing broken plurals or date formats, or wiring a language switcher.
when_to_use: Extracting hardcoded UI strings into a translation catalogue; adding a new locale or a language switcher; fixing pluralisation that only works in English; formatting dates, numbers, or currency per region; adding RTL (Arabic/Hebrew) support; splitting locale bundles so one locale doesn't ship all of them; choosing a localised URL strategy with hreflang.
paths:
  - "**/translations/**/*.{js,ts,json}"
  - "**/locales/**/*.{js,ts,json}"
  - "**/*i18n*.{js,ts,jsx,tsx}"
---

# Localization

## What is Localization?

Internationalization (i18n) is the one-time engineering work that makes an app *capable* of speaking other languages: strings live in catalogues behind keys, formatting goes through locale-aware APIs, and layout survives being mirrored. Localization (L10n) is the per-locale payload — translated copy, regional formats, culturally appropriate assets. Get i18n right once and each new locale is translation plus QA; skip it and every locale is a refactor.

## Key Principles

1. **Keys, Not Strings**: Components reference `t('buttonSave')`, never the literal `"Save"`. The catalogue is data; the code is locale-agnostic. A fallback chain (`es-MX → es → en`) keeps a missing key from blanking the UI.

2. **Delegate Formatting to `Intl`**: Plural categories, date order, decimal separators, and currency placement differ per locale and are already encoded in CLDR. `Intl.PluralRules`, `DateTimeFormat`, `NumberFormat`, and `RelativeTimeFormat` know them — hand-rolled logic encodes English assumptions.

3. **Direction Is Layout, Not Text**: RTL means the whole box model mirrors. Use logical properties (`margin-inline-start`, `text-align: start`) and set `dir` on `<html>` so one stylesheet serves both directions.

4. **Ship One Locale's Bytes**: Load only the active locale, dynamically import others on switch. A 100-locale bundle in the critical path is a self-inflicted performance bug.

## Best Practices

✅ **DO**:
- Keep every user-visible string in a catalogue keyed by a stable identifier
- Declare a `fallbackLng` and warn loudly on missing keys in development
- Use CLDR plural categories (`zero`/`one`/`two`/`few`/`many`/`other`), not `count === 1`
- Format dates, numbers, and currency through `Intl` with the active locale
- Set `<html lang>` and `<html dir>` from the selected locale
- Give each locale a crawlable URL (`/es/about`) with `hreflang` alternates

❌ **DON'T**:
- Concatenate sentence fragments — word order differs per language
- Interpolate by string-splicing translations (use named parameters)
- Use `margin-left`/`text-align: left`/`float: left` in localisable layouts
- Bundle every locale's catalogue into the initial chunk
- Assume a locale's currency from its language (`en` is not always USD)
- Switch locale with only a query param or cookie and expect SEO to work

## Code Patterns

### Catalogue with Interpolation and Plurals

```javascript
// locales/en.json — flat or namespaced keys; keep the shape identical per locale
{
  "buttonSave": "Save",
  "welcome": "Welcome, {name}!",
  "itemsCount_one": "{count} item",
  "itemsCount_other": "{count} items"
}
```

```javascript
// ru.json needs three forms; ja.json needs one. Same key, different categories.
{ "itemsCount_one": "{count} товар", "itemsCount_few": "{count} товара", "itemsCount_many": "{count} товаров" }
```

Never branch on `count` in the component — let the library (i18next, FormatJS) or `Intl.PluralRules` pick the category.

### Locale-Aware Formatting

```javascript
export const formatMoney = (locale, currency, amount) =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);

export const formatDate = (locale, date) =>
  new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);

export const pluralKey = (locale, count) =>
  new Intl.PluralRules(locale).select(count); // "one" | "few" | "many" | "other"

// en-US → "$1,234.56" | de-DE + EUR → "1.234,56 €" | ja-JP + JPY → "￥1,235"
```

Pass `currency` explicitly as data — it is a property of the price, not of the user's language.

### RTL-Safe CSS

```css
.card {
  margin-inline-start: 1rem;   /* left in LTR, right in RTL */
  padding-inline: 1rem;
  border-inline-start: 2px solid var(--accent);
  text-align: start;
}

[dir="rtl"] .icon-arrow { transform: scaleX(-1); } /* arrows mirror; checkmarks don't */
```

### Detection and Lazy Locale Bundles

```javascript
const SUPPORTED = ["en", "es", "ja", "ar"];

export function detectLocale() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  const saved = localStorage.getItem("lang");
  const nav = (navigator.language || "en").split("-")[0];
  return [fromUrl, saved, navigator.language, nav].find((l) => SUPPORTED.includes(l)) ?? "en";
}

export async function loadCatalogue(locale) {
  const mod = await import(`../constants/translations/${locale.toUpperCase()}.js`);
  return mod.default; // one network chunk per locale, cached by the CDN
}
```

### In the elegant templates

`chota-react-saga` (and its `chota-react-zustand` mirror) ships the minimum viable seam: a flat catalogue with a default export, plus a locale field in config state.

```javascript
// src/constants/translations/EN.js
const EN = { buttonAdd: "Add", buttonSave: "Save" };
export default EN;

// src/state/config/config.initial.js
const intialConfigState = { name: "Todo App", lang: "en", themeMode: "light", theme: "light" };
```

Language selection therefore lives in state — a container dispatches `updateConfig({ lang: "es" })` and reads `state.config.lang`, exactly like the theme toggle in `SiteHeaderContainer.jsx`. Be honest about the ceiling: **the templates ship only `EN.js`, with no i18n library, no plural rules, no `Intl` formatting, and no RTL wiring** (`EN.test.js` just asserts two keys). Everything above — ICU plurals, `Intl` formatters, `dir="rtl"`, lazy locale chunks, `hreflang` — is guidance for growing past that starting point.

When you do grow it: resolve strings in the **container**, pass finished text down as `data`, and keep `src/ui/**` purely presentational. Components should receive `saveLabel`, not call a `t()` that reaches into a store.

## Related Terminologies

- **State** (State) - `config.lang` holds the active locale
- **Container** (Server) - Resolves translations and passes text down as props
- **Theme** (UI) - Same config slice, same switcher pattern
- **SSR** (Server) - Detect locale before render to avoid a wrong-language flash
- **SEO** (Server) - `hreflang` + per-locale URLs prevent duplicate-content dilution
- **Accessibility** (UI) - `lang`/`dir` attributes drive screen-reader pronunciation

## Quality Gates

- [ ] No user-visible string literals left in components
- [ ] Catalogues share an identical key shape; a fallback locale is configured
- [ ] Counts render via CLDR plural categories, not `count === 1`
- [ ] Dates/numbers/currency go through `Intl` with the active locale
- [ ] `<html lang>`/`<html dir>` track the selected locale; layout uses logical properties
- [ ] Only the active locale is in the initial bundle; others load on demand

**Source**: `/docs/server/localization.md`
