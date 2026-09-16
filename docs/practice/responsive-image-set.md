---
title: Ship a responsive image the browser can choose
layout: question
slug: responsive-image-set
format: ui-coding
difficulty: medium
layer: server
topics: [images, rwd, seo]
skill: server-images
minutes: 30
frameworks: [react, vue]
summary: Build an Image component that emits srcset, sizes and an aspect-ratio box, so the browser downloads the right file and nothing shifts.
---

A product page ships one 2400px JPEG to every device. On a phone that is most
of the page weight, and the layout jumps when it loads.

Build an `Image` component that emits markup the browser can act on:

- `srcset` with the widths the CDN can produce (400, 800, 1200, 2400).
- `sizes` describing the slot the image occupies, taken as a prop.
- A reserved box from `width` and `height` so nothing shifts.
- `loading="lazy"` and `decoding="async"` unless `priority` is set, in which
  case `fetchpriority="high"` and eager loading.
- `alt` is required. A missing `alt` is a development-time error, not a warning.

Starter files are in `practice/workspace/responsive-image-set/<framework>/`.

## Solution

### Approach 1: `srcset` + `sizes` on a plain `<img>`

{% raw %}
```jsx
const WIDTHS = [400, 800, 1200, 2400];

export default function Image({ src, alt, width, height, sizes = "100vw", priority = false }) {
  if (alt === undefined) throw new Error("Image: alt is required (use alt=\"\" for decorative)");
  const srcSet = WIDTHS.map((w) => `${src}?w=${w} ${w}w`).join(", ");
  return (
    <img
      src={`${src}?w=${WIDTHS[1]}`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      style={{ aspectRatio: `${width} / ${height}`, width: "100%", height: "auto" }}
      loading={priority ? "eager" : "lazy"}
      fetchpriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
```
{% endraw %}

`width` and `height` are the layout contract. With them plus
`aspect-ratio`, the browser reserves the box before a byte arrives, which is
what removes the shift.

### Approach 2: `<picture>` with format negotiation

```jsx
<picture>
  <source type="image/avif" srcSet={set(src, "avif")} sizes={sizes} />
  <source type="image/webp" srcSet={set(src, "webp")} sizes={sizes} />
  <img src={`${src}?w=800`} alt={alt} width={width} height={height} sizes={sizes} />
</picture>
```

`<picture>` is for choosing a *different resource*: a modern format, or a
different crop at a different breakpoint. `srcset` alone is for choosing a
*different size of the same resource*. Reach for `<picture>` when you have art
direction or format fallbacks, and not before — it is three times the markup
for no benefit otherwise.

## Trade-offs

`sizes` is the part that is easy to get wrong and expensive when you do. It is a
promise about layout that the browser trusts before CSS has been applied, so a
stale `sizes="100vw"` on an image that actually renders at 300px makes the
browser download the 2400px file — the exact bug the component was built to
prevent. That is the argument for passing `sizes` explicitly from the call site
rather than defaulting it: a wrong default is silent.

`loading="lazy"` on an above-the-fold image delays the largest paint on the
page, which is why `priority` exists and why it should be used on exactly one
image per screen.

Requiring `alt` by throwing is deliberate. A warning is filtered out of a noisy
console; a thrown error is fixed before the commit. `alt=""` stays available for
genuinely decorative images, which makes the intent explicit in the diff.

## Related

- Reading: [Images](../server/images.html) · [RWD](../ui/rwd.html) · [SEO](../server/seo.html)
- Agent Skill: `server-images`
