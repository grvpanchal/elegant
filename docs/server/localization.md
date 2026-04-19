---
title: Localization
layout: doc
slug: localization
---

# Localization

## Key Insight

Localization (i18n/L10n) in frontend applications extends beyond translating strings—it requires internationalization architecture supporting dynamic language switching, RTL layouts, pluralization rules varying by language (English 2 forms vs Arabic 6 vs Japanese 1), date/number/currency formatting respecting regional conventions (12/31/2025 vs 31.12.2025 vs 2025-12-31, $1,000.00 vs 1.000,00€), lazy-loading translation bundles minimizing initial payload, and server-side locale detection ensuring crawlers and users receive content in correct language without client-side flicker—transforming monolingual apps into globally accessible experiences serving billions of users in 100+ languages while maintaining single codebase.

## Detailed Description

Localization addresses the challenge of serving global audiences while respecting regional linguistic, cultural, and formatting conventions: users expect applications in their native language (Spanish in Mexico, Portuguese in Brazil), culturally appropriate content (imagery, colors, idioms avoiding offensive symbols), and familiar formats (dates DD/MM/YYYY vs MM/DD/YYYY, currencies $1,234.56 vs 1.234,56€ vs ¥1,235, measurement units miles vs kilometers). Traditional approaches hardcode English strings making internationalization expensive refactoring exercise, but modern i18n architecture builds language flexibility from day one using translation keys, parameter interpolation, and format helpers enabling painless expansion from 1 language to 100+ languages sharing single codebase.

The two-phase internationalization process separates infrastructure from content: (1) **Internationalization (i18n)** prepares application architecture supporting multiple locales (extract hardcoded strings to translation files, implement language switcher, add locale-aware formatting for dates/numbers/currencies, design RTL-compatible layouts using logical CSS properties `margin-inline-start` instead of `margin-left`, support dynamic content loading), (2) **Localization (L10n)** adapts content for specific markets (professional human translation of strings ensuring cultural appropriateness, regional formatting configurations, locale-specific assets like localized images with region-appropriate models/landmarks, legal compliance with local regulations like GDPR cookie consent copy). I18n happens once enabling L10n for unlimited locales.

Translation management separates code from content using key-based lookup: **Translation Keys** (`user.welcome` instead of "Welcome" hardcoded), **Translation Files** (JSON/YAML per language `en.json`, `es.json`, `ja.json` storing key-value mappings), **Fallback Chain** (user locale es-MX → es → en avoiding missing translations), **Namespace Organization** (`common.button.save`, `dashboard.metrics.title` preventing conflicts). Developers reference keys `t('user.welcome', { name })` with interpolation parameters, runtime resolves to translated string "Welcome, John" (en) or "Bienvenido, John" (es) or "ようこそ、John" (ja), missing keys fall back to default language preventing blank UI, warnings in development highlight missing translations.

Pluralization complexity varies dramatically by language: English has 2 forms (1 item vs 2+ items), Russian has 3 forms (1, 2-4, 5+), Arabic has 6 forms (zero, one, two, few, many, other), Japanese has 1 form (no distinction). i18n libraries implement CLDR plural rules automatically: `t('items_count', { count: 0 })` resolves to "0 items" (English), "0 elementos" (Spanish zero form), "0個のアイテム" (Japanese no plural), `t('items_count', { count: 1 })` → "1 item", "1 elemento", "1個のアイテム", `t('items_count', { count: 5 })` → "5 items", "5 elementos", "5個のアイテム". Translation files define all forms: `{ "items_count_zero": "no items", "items_count_one": "{{count}} item", "items_count_other": "{{count}} items" }`, library selects correct form based on locale's plural rules.

Date and number formatting follows regional conventions using Intl API: **Dates** (`new Intl.DateTimeFormat('en-US').format(date)` → "12/31/2025", `'en-GB'` → "31/12/2025", `'ja-JP'` → "2025/12/31", `'ar-SA'` → "١٤٤٧/٦/٣٠" Arabic numerals with Hijri calendar option), **Numbers** (`new Intl.NumberFormat('en-US').format(1234.56)` → "1,234.56", `'de-DE'` → "1.234,56" reversed separators, `'hi-IN'` → "1,234.56" Indian lakhs system "1,00,000"), **Currency** (`new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234.56)` → "$1,234.56", `'de-DE'` + EUR → "1.234,56 €", `'ja-JP'` + JPY → "¥1,235" no decimals for yen), **Relative Time** (`new Intl.RelativeTimeFormat('en').format(-1, 'day')` → "1 day ago", `'es'` → "hace 1 día", `'ja'` → "1 日前"). Intl API handles all complexity internally respecting locale conventions.

RTL (right-to-left) support for Arabic, Hebrew requires layout mirroring: **Logical Properties** (`margin-inline-start` instead of `margin-left` flips automatically in RTL, `padding-inline-end` instead of `padding-right`, `inset-inline-start` instead of `left`), **Direction Attribute** (`<html dir="rtl">` triggers browser RTL mode, `dir="auto"` auto-detects based on content), **Icon Flipping** (arrows, chevrons mirror horizontally, but checkmarks, crosses don't flip), **Text Alignment** (`text-align: start` instead of `left` respects direction). CSS frameworks handle RTL automatically when using logical properties, older codebases require separate RTL stylesheets or PostCSS plugins generating mirrored versions.

Dynamic language switching enables user preference: **Language Selector** (dropdown in header allowing instant locale change), **Persistence** (save preference to localStorage/cookie surviving sessions), **URL Strategy** (subdomain `es.example.com`, subdirectory `/es/about`, query parameter `?lang=es`, each affecting SEO differently), **Server Detection** (Accept-Language header indicating browser preferences, IP geolocation suggesting country-specific locale, user account settings overriding auto-detection). Server-side rendering requires locale detection before rendering preventing English flash then Spanish replacing content, client-side apps can show language selector during load allowing user choice before hydration.

Bundle optimization prevents loading all languages upfront: **Code Splitting** (separate chunk per locale `en-<hash>.js`, `es-<hash>.js`, `ja-<hash>.js`), **Lazy Loading** (fetch translation bundle on demand when user switches language or browser navigates to localized route), **Tree Shaking** (remove unused translation keys reducing bundle size), **Compression** (gzip/brotli compress repetitive JSON translation files efficiently). Initial load includes only active locale (en bundle 50KB) avoiding 100-language bundle (5MB), language switcher triggers dynamic import fetching Spanish bundle (55KB) then hot-swaps translations without page reload.

SEO considerations for multilingual sites: **Separate URLs** per language (Google requires distinct URLs not JavaScript switching single URL), **hreflang Tags** (`<link rel="alternate" hreflang="es" href="https://example.com/es/about">` indicating Spanish version, `hreflang="en"` English, `hreflang="x-default"` fallback for unmatched locales), **Content Translation** (full page content not just UI strings, translated meta tags title/description, localized structured data), **Sitemap Internationalization** (XML sitemap listing all language variants with hreflang annotations). Search engines index each language separately ranking Spanish site for Spanish queries, English site for English queries, hreflang prevents duplicate content penalties.

## Code Examples

### Basic Example: React i18next Setup

Simple internationalization with react-i18next:

```javascript
// ===== i18n.js - Configuration =====
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome, {{name}}!",
      items_count_zero: "No items",
      items_count_one: "{{count}} item",
      items_count_other: "{{count}} items",
      button: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete"
      }
    }
  },
  es: {
    translation: {
      welcome: "¡Bienvenido, {{name}}!",
      items_count_zero: "Sin elementos",
      items_count_one: "{{count}} elemento",
      items_count_other: "{{count}} elementos",
      button: {
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar"
      }
    }
  },
  ja: {
    translation: {
      welcome: "ようこそ、{{name}}！",
      items_count: "{{count}}個のアイテム",
      button: {
        save: "保存",
        cancel: "キャンセル",
        delete: "削除"
      }
    }
  }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // React integration
  .init({
    resources,
    fallbackLng: 'en', // Default language
    interpolation: {
      escapeValue: false // React already escapes
    },
    detection: {
      // Detection order
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie']
    }
  });

export default i18n;


// ===== App.js - Using translations =====
import { useTranslation } from 'react-i18next';
import './i18n';

function App() {
  const { t, i18n } = useTranslation();
  
  const userName = "John";
  const itemCount = 5;
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div>
      <nav>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('es')}>Español</button>
        <button onClick={() => changeLanguage('ja')}>日本語</button>
      </nav>
      
      <h1>{t('welcome', { name: userName })}</h1>
      {/* en: "Welcome, John!" | es: "¡Bienvenido, John!" | ja: "ようこそ、John！" */}
      
      <p>{t('items_count', { count: itemCount })}</p>
      {/* en: "5 items" | es: "5 elementos" | ja: "5個のアイテム" */}
      
      <button>{t('button.save')}</button>
      {/* en: "Save" | es: "Guardar" | ja: "保存" */}
    </div>
  );
}

export default App;


// ===== Formatting dates and numbers =====
import { useTranslation } from 'react-i18next';

function ProductCard({ price, releaseDate }) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  
  // Format currency
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'ja' ? 'JPY' : locale === 'es' ? 'EUR' : 'USD'
  }).format(price);
  // en-US: "$1,234.56" | es: "1.234,56 €" | ja: "¥1,235"
  
  // Format date
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(releaseDate);
  // en: "December 31, 2025" | es: "31 de diciembre de 2025" | ja: "2025年12月31日"
  
  return (
    <div>
      <p>Price: {formattedPrice}</p>
      <p>Release: {formattedDate}</p>
    </div>
  );
}
```

### Practical Example: Next.js with Dynamic Locale Routes

Internationalized routing with SSR:

```javascript
// ===== next.config.js =====
module.exports = {
  i18n: {
    locales: ['en', 'es', 'ja', 'ar'],
    defaultLocale: 'en',
    localeDetection: true, // Auto-detect from Accept-Language header
  },
};


// ===== public/locales/en/common.json =====
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "about": "About"
  },
  "products": {
    "title": "Our Products",
    "description": "Browse our selection of {{count}} products",
    "filter": {
      "category": "Category",
      "price": "Price Range"
    }
  }
}


// ===== public/locales/es/common.json =====
{
  "nav": {
    "home": "Inicio",
    "products": "Productos",
    "about": "Acerca de"
  },
  "products": {
    "title": "Nuestros Productos",
    "description": "Explora nuestra selección de {{count}} productos",
    "filter": {
      "category": "Categoría",
      "price": "Rango de Precio"
    }
  }
}


// ===== lib/i18n.js - Server-side configuration =====
import NextI18Next from 'next-i18next';
import path from 'path';

export const nextI18Next = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['es', 'ja', 'ar'],
  localeSubpaths: {
    en: 'en',
    es: 'es',
    ja: 'ja',
    ar: 'ar'
  },
  localePath: path.resolve('./public/locales')
});

export const { appWithTranslation, useTranslation } = nextI18Next;


// ===== pages/_app.js =====
import { appWithTranslation } from '../lib/i18n';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);


// ===== pages/products.js - SSR with translations =====
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Products({ products }) {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('products.title')}</h1>
      <p>{t('products.description', { count: products.length })}</p>
      
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Server-side: load translations before rendering
export async function getStaticProps({ locale }) {
  const products = await fetchProducts();
  
  return {
    props: {
      products,
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}


// ===== components/LanguageSwitcher.js =====
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locales, locale: activeLocale } = router;
  
  const languages = {
    en: 'English',
    es: 'Español',
    ja: '日本語',
    ar: 'العربية'
  };
  
  return (
    <select
      value={activeLocale}
      onChange={(e) => {
        const newLocale = e.target.value;
        router.push(router.pathname, router.asPath, { locale: newLocale });
      }}
    >
      {locales.map(locale => (
        <option key={locale} value={locale}>
          {languages[locale]}
        </option>
      ))}
    </select>
  );
}


// ===== pages/_document.js - SEO hreflang tags =====
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const { locale, locales } = this.props.__NEXT_DATA__;
    const currentPath = this.props.__NEXT_DATA__.page;
    
    return (
      <Html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <Head>
          {/* hreflang tags for SEO */}
          {locales.map(loc => (
            <link
              key={loc}
              rel="alternate"
              hrefLang={loc}
              href={`https://example.com/${loc}${currentPath}`}
            />
          ))}
          <link
            rel="alternate"
            hrefLang="x-default"
            href={`https://example.com/en${currentPath}`}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

### Advanced Example: RTL Support and Lazy Loading

Dynamic bundle loading with RTL layout:

```javascript
// ===== i18n.js - Lazy loading configuration =====
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Lazy load translations
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'products', 'dashboard'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: true // Use Suspense for loading states
    }
  });

export default i18n;


// ===== App.js - Suspense boundary for loading =====
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppContent />
    </Suspense>
  );
}

function AppContent() {
  const { t, i18n } = useTranslation();
  const isRTL = ['ar', 'he', 'fa'].includes(i18n.language);
  
  // Apply RTL when needed
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language, isRTL]);
  
  return <div>{t('welcome')}</div>;
}


// ===== styles/globals.css - RTL-compatible styles =====
```

```css
/* Use logical properties for automatic RTL support */

.container {
  /* ❌ Avoid: margin-left, margin-right */
  /* ✅ Good: logical properties */
  margin-inline-start: 20px;  /* Left in LTR, Right in RTL */
  margin-inline-end: 20px;    /* Right in LTR, Left in RTL */
  padding-inline: 16px;       /* Horizontal padding */
  padding-block: 12px;        /* Vertical padding */
}

.card {
  border-inline-start: 2px solid blue;  /* Left border in LTR, right in RTL */
  text-align: start;  /* Left in LTR, right in RTL */
}

/* Icons that need flipping in RTL */
.icon-arrow {
  transform: scaleX(1);
}

[dir="rtl"] .icon-arrow {
  transform: scaleX(-1);  /* Mirror horizontally */
}

/* Icons that DON'T flip */
.icon-check,
.icon-close {
  /* Same in both directions */
}

/* Flexbox automatically mirrors in RTL */
.nav {
  display: flex;
  gap: 1rem;
}
/* In RTL, items automatically reverse order */
```

```javascript
// ===== Dynamic import for large translation bundles =====
async function loadLocale(locale) {
  // Lazy load translation bundle
  const translations = await import(`../locales/${locale}/translations.json`);
  
  i18n.addResourceBundle(locale, 'translation', translations.default, true, true);
  await i18n.changeLanguage(locale);
}

// Language switcher with lazy loading
function LanguageSwitcher() {
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  
  const handleLanguageChange = async (newLang) => {
    setLoading(true);
    
    try {
      // Check if already loaded
      if (!i18n.hasResourceBundle(newLang, 'translation')) {
        await loadLocale(newLang);
      } else {
        await i18n.changeLanguage(newLang);
      }
      
      // Save preference
      localStorage.setItem('preferredLanguage', newLang);
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <select
      disabled={loading}
      value={i18n.language}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="ar">العربية</option>
      <option value="ja">日本語</option>
    </select>
  );
}


// ===== Locale detection with fallback chain =====
function detectLocale() {
  // 1. URL parameter (?lang=es)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && supportedLocales.includes(urlLang)) {
    return urlLang;
  }
  
  // 2. Saved preference
  const saved = localStorage.getItem('preferredLanguage');
  if (saved && supportedLocales.includes(saved)) {
    return saved;
  }
  
  // 3. Browser language
  const browserLang = navigator.language || navigator.userLanguage;
  const primaryLang = browserLang.split('-')[0]; // 'en-US' -> 'en'
  
  // Try exact match (en-US)
  if (supportedLocales.includes(browserLang)) {
    return browserLang;
  }
  
  // Try primary language (en)
  if (supportedLocales.includes(primaryLang)) {
    return primaryLang;
  }
  
  // 4. Default fallback
  return 'en';
}

const supportedLocales = ['en', 'es', 'ja', 'ar'];
const userLocale = detectLocale();
i18n.changeLanguage(userLocale);
```

## Common Mistakes

### 1. Hardcoding Strings Instead of Using Translation Keys
**Mistake:** Embedding translatable text directly in code.

```jsx
// ❌ BAD: Hardcoded English strings
function Welcome({ userName }) {
  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      <p>You have 5 new messages</p>
      <button>View Profile</button>
    </div>
  );
}
// Impossible to translate without modifying code
```

```jsx
// ✅ GOOD: Translation keys
function Welcome({ userName, messageCount }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome', { name: userName })}</h1>
      <p>{t('messages_new', { count: messageCount })}</p>
      <button>{t('button.view_profile')}</button>
    </div>
  );
}
// Easy to add new languages by adding translation files
```

**Why it matters:** Separating content from code enables translation without touching source code, supports multiple languages with single codebase.

### 2. Not Handling Pluralization Correctly
**Mistake:** Manual plural logic doesn't work across languages.

```javascript
// ❌ BAD: English-only pluralization
function ItemCount({ count }) {
  return (
    <p>
      {count} {count === 1 ? 'item' : 'items'}
    </p>
  );
}
// Breaks in Russian (1, 2-4, 5+ forms), Arabic (6 forms), Japanese (no plurals)
```

```javascript
// ✅ GOOD: i18n library handles plural rules
// en.json
{
  "items_count_zero": "no items",
  "items_count_one": "{{count}} item",
  "items_count_other": "{{count}} items"
}

// ru.json (Russian has 3 forms)
{
  "items_count_one": "{{count}} товар",     // 1, 21, 31...
  "items_count_few": "{{count}} товара",    // 2-4, 22-24...
  "items_count_many": "{{count}} товаров"   // 5-20, 25-30...
}

function ItemCount({ count }) {
  const { t } = useTranslation();
  return <p>{t('items_count', { count })}</p>;
}
// Library automatically selects correct plural form per language
```

**Why it matters:** Each language has different pluralization rules—i18n libraries handle complexity automatically using CLDR data.

### 3. Using LTR-Only CSS Properties
**Mistake:** Hard-coded directional properties break RTL layouts.

```css
/* ❌ BAD: Fixed directions */
.sidebar {
  float: left;        /* Always left, even in RTL */
  margin-left: 20px;
  text-align: left;
}

.icon-arrow {
  /* Doesn't flip in RTL */
}
```

```css
/* ✅ GOOD: Logical properties */
.sidebar {
  float: inline-start;        /* Left in LTR, right in RTL */
  margin-inline-start: 20px;  /* Adapts to direction */
  text-align: start;          /* Respects text direction */
}

/* Flip icons in RTL */
.icon-arrow {
  transform: scaleX(1);
}

[dir="rtl"] .icon-arrow {
  transform: scaleX(-1);
}
```

**Why it matters:** Arabic and Hebrew require RTL (right-to-left) layouts—logical CSS properties automatically mirror without duplicate stylesheets.

## Quick Quiz

{% include quiz.html id="localization-1"
   question="What is the difference between i18n (internationalization) and L10n (localization)?"
   options="A|They are the same term;;B|L10n comes first;;C|i18n is the one-time engineering work of making a product capable of being localised (extracting strings, locale-aware formatting, RTL support, bidi-safe layouts). L10n is the per-locale work of actually translating content and adapting it culturally. i18n is the platform, L10n is the payload;;D|Only i18n applies to React apps"
   correct="C"
   explanation="Get i18n right once and adding a new locale (L10n) is mostly translation + QA. Skip i18n and every locale requires new engineering." %}

{% include quiz.html id="localization-2"
   question="Why can't you just use &quot;{n} items&quot; for pluralisation?"
   options="A|Pluralisation is deprecated;;B|Languages have different plural categories (English: one/other; Russian: one/few/many/other; Arabic: zero/one/two/few/many/other). Use a CLDR-driven API like Intl.PluralRules or an i18n library's plural syntax — hand-rolling breaks most non-English locales;;C|You can — English and French work the same way;;D|JavaScript can't count"
   correct="B"
   explanation="Intl.PluralRules (or ICU MessageFormat via i18next/FormatJS) knows each language's categories. &quot;1 item / 2 items&quot; is an English assumption most of the world doesn't share." %}

{% include quiz.html id="localization-3"
   question="Which URL strategy is best for SEO of localised content?"
   options="A|Subdirectory (/fr/...) or subdomain (fr.example.com) with hreflang link tags telling search engines which locale each page is for — give each localised page a stable, crawlable URL;;B|Cookie-only, so all locales share one URL;;C|Query string (?lang=fr) — Google treats these as the same URL;;D|JavaScript redirects"
   correct="A"
   explanation="Cookie/query-based switches give search engines nothing to index per locale. Stable URL + hreflang is the standard recommendation from Google's i18n docs." %}

{% include quiz.html id="localization-4"
   question="What does RTL (right-to-left) language support require beyond translation?"
   options="A|Using a bigger font;;B|Setting dir=&quot;rtl&quot; on the root, using logical CSS properties (margin-inline-start, padding-inline-end, text-align: start) so layout mirrors correctly, auditing icons/arrows for directionality, and handling mixed-direction text with bidi controls where needed;;C|Reversing the JavaScript array;;D|Only translating strings"
   correct="B"
   explanation="CSS logical properties flip automatically with dir=&quot;rtl&quot;. Physical properties (left/right, margin-left) don't — they're the source of most RTL bugs." %}

{% include quiz.html id="localization-5"
   question="How do you keep i18n from bloating the bundle?"
   options="A|Inline all translations as strings;;B|Load only the active locale's messages (dynamic import by locale code), lazy-load additional locales on language switch, split messages per route where possible, and consider server-side locale negotiation so you never ship other-locale text to the client at all;;C|Ship every locale's JSON in the main bundle;;D|Use one giant JSON for every language"
   correct="B"
   explanation="Locale-split bundles scale linearly per-locale instead of adding every locale's cost to every visitor. CDN-served localised JSON loaded on demand is the standard pattern." %}

## References

- [i18next Documentation](https://www.i18next.com/)
- [React i18next](https://react.i18next.com/)
- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)
- [Unicode CLDR](https://cldr.unicode.org/) - Plural rules and locale data
- [MDN Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
