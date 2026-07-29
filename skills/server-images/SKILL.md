---
name: server-images
description: Image delivery and optimisation — responsive `srcset`/`sizes`, `<picture>` for art direction and AVIF/WebP fallbacks, native lazy loading, explicit dimensions to prevent CLS, `fetchpriority`/preload for the LCP image, and CDN URL transformation. Use when adding images to a page, fixing slow LCP or layout shift, or reviewing an image component's API.
when_to_use: Adding or reviewing image markup and image components; picking `srcset` vs `<picture>`; choosing AVIF/WebP with a JPEG fallback; deciding which images lazy-load vs eager-load; fixing Cumulative Layout Shift from missing dimensions or slow Largest Contentful Paint.
paths:
  - "**/ui/atoms/Image/**/*"
  - "**/*Image*.{jsx,tsx,vue,js,ts}"
  - "**/images/**/*.{jsx,tsx,vue,js,ts}"
---

# Images

## What are Optimised Images?

Images are typically 50–70% of total page weight and the most common cause of slow loads. An optimised image serves the *right size* for the viewport (`srcset`/`sizes`), the *right format* for the browser (AVIF → WebP → JPEG), defers off-screen work (`loading="lazy"`), and reserves its space up front so the layout never jumps.

## Key Principles

1. **Right Size per Viewport**: `srcset` + `sizes` let the browser pick the smallest file that still looks sharp for its width and device pixel ratio. A 375px phone should never download a 2400px hero.

2. **Reserve Space Always**: Set `width` and `height` (or CSS `aspect-ratio`) on every image. The browser then reserves the box before the bytes arrive, so content never shifts (CLS).

3. **Prioritise the Fold, Defer the Rest**: The above-the-fold hero is usually the LCP element — eager-load it with `fetchpriority="high"` (or preload it). Everything below the fold gets `loading="lazy"`.

## Best Practices

✅ **DO**:
- Provide `width`/`height` or `aspect-ratio` on every image
- Use `srcset` + `sizes` for resolution switching
- Use `<picture>` for art direction or format fallbacks
- Serve AVIF/WebP with a JPEG fallback
- Eager-load + `fetchpriority="high"` the LCP image
- Write meaningful `alt` text (empty `alt=""` for decorative images)

❌ **DON'T**:
- Lazy-load the hero image (it delays LCP)
- Ship one oversized image to every device
- Omit dimensions (causes layout shift)
- Hand-generate a dozen variants when a CDN can transform on demand
- Forget a fallback format for older browsers
- Use `<img>` for decoration that belongs in CSS

## Code Patterns

### Responsive Sizes (`srcset` + `sizes`)

```html
<img
  src="/images/hero-800.jpg"
  srcset="/images/hero-400.jpg 400w,
          /images/hero-800.jpg 800w,
          /images/hero-1200.jpg 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
  alt="Mountain landscape at sunrise"
  width="1200"
  height="600"
  loading="lazy"
/>
```

`srcset` declares what widths exist; `sizes` tells the browser how wide the image will *render*, so it can choose before layout. Use `1x/2x/3x` descriptors instead for fixed-size art like logos.

### Formats and Art Direction (`<picture>`)

```html
<picture>
  <!-- Smallest first: the browser takes the first type it supports -->
  <source type="image/avif" srcset="/hero-800.avif 800w, /hero-1200.avif 1200w" sizes="80vw" />
  <source type="image/webp" srcset="/hero-800.webp 800w, /hero-1200.webp 1200w" sizes="80vw" />
  <img src="/hero-800.jpg" alt="Hero" width="1200" height="600" loading="lazy" />
</picture>
```

Add `media` to a `<source>` when the *crop* should change per breakpoint (square on mobile, wide on desktop) — that's art direction, which `srcset` alone cannot express.

### Prioritising the LCP Image

```html
<!-- Above the fold: load immediately, hint high priority -->
<img src="/hero.jpg" alt="Hero" width="1200" height="600"
     loading="eager" fetchpriority="high" />

<!-- Or preload it from <head> -->
<link rel="preload" as="image" href="/hero.jpg" />

<!-- Below the fold: defer -->
<img src="/card.jpg" alt="Card" width="800" height="600" loading="lazy" />
```

### CDN Transformation

```html
<!-- One source asset; the CDN resizes/reformats per request and caches at the edge -->
<img
  src="https://res.cloudinary.com/demo/image/upload/w_800,q_auto/sample.jpg"
  srcset="https://res.cloudinary.com/demo/image/upload/w_400,f_auto,q_auto/sample.jpg 400w,
          https://res.cloudinary.com/demo/image/upload/w_800,f_auto,q_auto/sample.jpg 800w"
  sizes="100vw"
  alt="Sample" width="800" height="600" loading="lazy"
/>
```

`f_auto` negotiates the format from the `Accept` header and `q_auto` picks quality — so you don't pre-build variants. Fingerprint URLs and cache them hard (`Cache-Control: max-age=31536000, immutable`).

### In the elegant templates

The templates keep a thin `Image` atom (`ui/atoms/Image/Image.component.jsx`) that spreads props onto a real `<img>`:

```jsx
export default function Image(props) {
  return <img alt={props.alt} {...props} />;
}
```

Because it passes everything through, the optimisation lives at the call site — pass `srcSet`, `sizes`, `width`, `height`, and `loading` as props. Keep the atom presentational (see the Atom skill); if you add generated `srcSet` logic, keep it a pure helper rather than fetching or reading state.

### Progressive Loading (blur-up / LQIP)

```jsx
// Show a tiny blurred placeholder, swap to the real image on load
function ProgressiveImage({ src, lqip, alt, width, height }) {
  const [current, setCurrent] = useState(lqip);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setCurrent(src);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      width={width}
      height={height}
      style={{ filter: current === lqip ? 'blur(20px)' : 'none', transition: 'filter .3s' }}
    />
  );
}
```

Frameworks with built-in image pipelines (e.g. `next/image` with `placeholder="blur"`) give you this, plus variant generation and format negotiation, for free.

## Related Terminologies

- **Atom** (UI) - The `Image` atom wraps `<img>`
- **Skeleton** (UI) - Placeholder shown while media loads
- **App Shell** (Server) - Prioritises above-the-fold assets
- **SEO** (Server) - LCP/CLS are Core Web Vitals ranking factors
- **Proxy** (Server) - CDNs transform and cache image responses

## Quality Gates

- [ ] Every image has `width`/`height` or `aspect-ratio`
- [ ] `srcset`/`sizes` provided for content images
- [ ] Modern format (AVIF/WebP) with a fallback
- [ ] Below-the-fold images use `loading="lazy"`
- [ ] LCP image is eager with `fetchpriority="high"` or preloaded
- [ ] Meaningful `alt` text (or `alt=""` when decorative)

**Source**: `/docs/server/images.md`
