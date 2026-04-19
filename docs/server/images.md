---
title: Images
layout: doc
slug: images
---

# Images

## Key Insight

**Modern image optimization combines responsive images (`<picture>` + `srcset`), lazy loading (`loading="lazy"`), next-gen formats (WebP/AVIF with JPEG fallback), and CDN transformation** to reduce bandwidth by 50-80%. The critical pattern is serving **different image sizes** for different viewports (400px mobile, 800px tablet, 1200px desktop) and **different formats** based on browser support, while deferring off-screen images with lazy loading to prioritize above-the-fold content. **Performance impact**: Optimized images reduce Largest Contentful Paint (LCP) from 4s to <2.5s, improving Core Web Vitals and SEO rankings.

## Detailed Description

Images are the #1 cause of slow page loads, accounting for **50-70% of total page weight**. Optimizing images is critical for performance, user experience, and SEO.

**The Image Optimization Problem:**
- Desktop users download massive 2400px images on 1920px screens → waste bandwidth
- Mobile users download desktop images on 375px screens → 10x more data than needed
- Old browsers get modern WebP they can't decode → broken images
- All images load immediately → block rendering, slow LCP, poor user experience
- Images lack dimensions → layout shift (CLS), jumpy scrolling

**Modern Image Optimization Stack:**

1. **Responsive Images**: Serve different sizes for different viewports
   - Use `srcset` attribute with pixel density descriptors (`1x`, `2x`) or width descriptors (`400w`, `800w`)
   - Use `<picture>` element for art direction (crop differently on mobile vs desktop)
   - Browser automatically selects best image based on viewport size and device pixel ratio

2. **Next-Gen Formats**: Reduce file size by 25-50% with modern compression
   - **WebP**: 25-35% smaller than JPEG, supported in 95% of browsers
   - **AVIF**: 50% smaller than JPEG, excellent quality, but only 70% browser support
   - **Fallback chain**: AVIF → WebP → JPEG for maximum compatibility

3. **Lazy Loading**: Defer off-screen images to prioritize critical content
   - Native `loading="lazy"` attribute (90% browser support)
   - Intersection Observer API for custom lazy loading with placeholders
   - Eager load above-the-fold hero images, lazy load everything else

4. **CDN Transformation**: Generate sizes and formats on-the-fly
   - Cloudinary, Imgix, Cloudflare Images transform URLs: `/image.jpg?w=800&f=webp`
   - Automatic format detection and optimization
   - Global edge caching for fast delivery worldwide

5. **Caching Strategy**: Reduce repeat downloads
   - Set `Cache-Control: max-age=31536000, immutable` for fingerprinted URLs
   - Use content hashing in filenames: `hero.abc123.jpg` enables permanent caching
   - Preload critical images: `<link rel="preload" as="image" href="/hero.jpg">`

6. **Dimensions & Aspect Ratio**: Prevent layout shift
   - Always set `width` and `height` attributes (or `aspect-ratio` CSS)
   - Browser reserves space before image loads → no CLS (Cumulative Layout Shift)
   - Use `object-fit: cover` for responsive containers

**Performance Metrics Impact:**

| Metric | Before Optimization | After Optimization | Target |
|--------|-------------------|-------------------|---------|
| **LCP** (Largest Contentful Paint) | 4.2s | 1.8s | <2.5s ✅ |
| **CLS** (Cumulative Layout Shift) | 0.15 | 0.02 | <0.1 ✅ |
| **Total Page Weight** | 3.2 MB | 800 KB | <1 MB ✅ |
| **Image Requests** | 45 | 12 (lazy loaded) | Minimize |

**Why Image Optimization Matters:**
- **Performance**: 53% of mobile users abandon sites that take >3s to load
- **SEO**: Core Web Vitals (LCP, CLS) are Google ranking factors
- **Bandwidth**: Mobile users on limited data plans benefit from smaller images
- **Sustainability**: Smaller images = less energy consumption, lower carbon footprint
- **Accessibility**: Faster loads benefit users with slow connections or older devices

- **Sustainability**: Smaller images = less energy consumption, lower carbon footprint
- **Accessibility**: Faster loads benefit users with slow connections or older devices

## Code Examples

### Basic Example: Responsive Images with srcset

```html
<!-- ===== RESPONSIVE IMAGE WITH SRCSET ===== -->
<!-- Browser chooses best size based on viewport width and DPR -->

<img
  src="/images/hero-800.jpg"
  srcset="
    /images/hero-400.jpg 400w,
    /images/hero-800.jpg 800w,
    /images/hero-1200.jpg 1200w,
    /images/hero-1600.jpg 1600w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 80vw,
    1200px
  "
  alt="Hero image showing mountain landscape"
  width="1200"
  height="600"
  loading="lazy"
/>

<!-- How it works:
1. srcset lists available image widths (400w = 400px wide)
2. sizes tells browser how wide image will be displayed:
   - On mobile (<640px): image fills viewport (100vw)
   - On tablet (<1024px): image is 80% of viewport (80vw)
   - On desktop: image is fixed 1200px
3. Browser calculates: (viewport width × size) / device pixel ratio
   - iPhone 13 (390px × 3 DPR): needs ~1200px image → chooses 1200w
   - iPad (768px × 2 DPR × 80%): needs ~1200px image → chooses 1200w
   - Desktop (1920px): needs 1200px → chooses 1200w
4. Browser picks smallest image that meets requirement
-->


<!-- ===== PIXEL DENSITY DESCRIPTORS ===== -->
<!-- For fixed-size images (logos, icons) -->

<img
  src="/logo-1x.png"
  srcset="
    /logo-1x.png 1x,
    /logo-2x.png 2x,
    /logo-3x.png 3x
  "
  alt="Company logo"
  width="200"
  height="50"
/>

<!-- Standard screens: get 1x (200×50px)
     Retina (2x DPR): get 2x (400×100px)
     iPhone Pro (3x DPR): get 3x (600×150px)
-->


<!-- ===== LAZY LOADING ===== -->
<!-- Defer off-screen images -->

<!-- Eager load (above-the-fold hero image) -->
<img
  src="/hero.jpg"
  alt="Hero"
  width="1200"
  height="600"
  loading="eager"
  fetchpriority="high"
/>

<!-- Lazy load (below-the-fold content) -->
<img
  src="/content-1.jpg"
  alt="Content image"
  width="800"
  height="600"
  loading="lazy"
/>

<!-- Native lazy loading:
- loading="lazy": Browser loads when image is near viewport
- loading="eager": Load immediately (default)
- fetchpriority="high": Prioritize this image (for LCP)
-->


<!-- ===== REACT COMPONENT ===== -->
<!-- Reusable image component -->

import React from 'react';

function ResponsiveImage({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  loading = 'lazy',
  className = ''
}) {
  // Generate srcset from base filename
  const generateSrcSet = (baseSrc) => {
    const ext = baseSrc.substring(baseSrc.lastIndexOf('.'));
    const base = baseSrc.substring(0, baseSrc.lastIndexOf('.'));
    
    return [
      `${base}-400${ext} 400w`,
      `${base}-800${ext} 800w`,
      `${base}-1200${ext} 1200w`,
      `${base}-1600${ext} 1600w`
    ].join(', ');
  };
  
  return (
    <img
      src={src}
      srcSet={generateSrcSet(src)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
    />
  );
}

export default ResponsiveImage;

// Usage
<ResponsiveImage
  src="/images/hero-800.jpg"
  alt="Mountain landscape"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, 80vw"
  loading="eager"
/>
```

### Practical Example: Next-Gen Formats with Picture Element

```html
<!-- ===== MODERN FORMAT SUPPORT ===== -->
<!-- AVIF → WebP → JPEG fallback chain -->

<picture>
  <!-- AVIF: 50% smaller, best quality, 70% browser support -->
  <source
    type="image/avif"
    srcset="
      /images/hero-400.avif 400w,
      /images/hero-800.avif 800w,
      /images/hero-1200.avif 1200w
    "
    sizes="(max-width: 768px) 100vw, 80vw"
  />
  
  <!-- WebP: 25-35% smaller, 95% browser support -->
  <source
    type="image/webp"
    srcset="
      /images/hero-400.webp 400w,
      /images/hero-800.webp 800w,
      /images/hero-1200.webp 1200w
    "
    sizes="(max-width: 768px) 100vw, 80vw"
  />
  
  <!-- JPEG: Universal fallback, 100% support -->
  <img
    src="/images/hero-800.jpg"
    srcset="
      /images/hero-400.jpg 400w,
      /images/hero-800.jpg 800w,
      /images/hero-1200.jpg 1200w
    "
    sizes="(max-width: 768px) 100vw, 80vw"
    alt="Hero image"
    width="1200"
    height="600"
    loading="lazy"
  />
</picture>

<!-- Browser selects first supported format:
- Chrome 90+: Gets AVIF (smallest)
- Chrome 23+: Gets WebP (medium)
- IE11: Gets JPEG (largest but works)
-->


<!-- ===== ART DIRECTION ===== -->
<!-- Different crops for mobile vs desktop -->

<picture>
  <!-- Desktop: wide landscape crop -->
  <source
    media="(min-width: 768px)"
    srcset="
      /images/banner-desktop-800.webp 800w,
      /images/banner-desktop-1600.webp 1600w
    "
    type="image/webp"
  />
  
  <!-- Mobile: square crop focusing on subject -->
  <source
    media="(max-width: 767px)"
    srcset="
      /images/banner-mobile-400.webp 400w,
      /images/banner-mobile-800.webp 800w
    "
    type="image/webp"
  />
  
  <!-- Fallback -->
  <img
    src="/images/banner-mobile-400.jpg"
    alt="Product banner"
    width="800"
    height="600"
  />
</picture>

<!-- Use case: Portrait photo on mobile (1:1), landscape on desktop (16:9) -->


<!-- ===== CDN TRANSFORMATION ===== -->
<!-- Cloudinary example - generate sizes on-the-fly -->

<picture>
  <source
    type="image/webp"
    srcset="
      https://res.cloudinary.com/demo/image/upload/w_400,f_webp,q_auto/sample.jpg 400w,
      https://res.cloudinary.com/demo/image/upload/w_800,f_webp,q_auto/sample.jpg 800w,
      https://res.cloudinary.com/demo/image/upload/w_1200,f_webp,q_auto/sample.jpg 1200w
    "
    sizes="100vw"
  />
  <img
    src="https://res.cloudinary.com/demo/image/upload/w_800,q_auto/sample.jpg"
    srcset="
      https://res.cloudinary.com/demo/image/upload/w_400,q_auto/sample.jpg 400w,
      https://res.cloudinary.com/demo/image/upload/w_800,q_auto/sample.jpg 800w,
      https://res.cloudinary.com/demo/image/upload/w_1200,q_auto/sample.jpg 1200w
    "
    sizes="100vw"
    alt="Sample"
    width="800"
    height="600"
  />
</picture>

<!-- URL parameters:
w_400 = resize to 400px width
f_webp = convert to WebP format
q_auto = automatic quality optimization
No need to pre-generate images, CDN does it on first request
-->


<!-- ===== REACT COMPONENT WITH FORMATS ===== -->

function OptimizedImage({ src, alt, width, height, sizes = '100vw' }) {
  const getCloudinaryUrl = (width, format) => {
    return `https://res.cloudinary.com/demo/image/upload/w_${width},f_${format},q_auto${src}`;
  };
  
  const widths = [400, 800, 1200, 1600];
  
  const generateSrcSet = (format) => {
    return widths
      .map(w => `${getCloudinaryUrl(w, format)} ${w}w`)
      .join(', ');
  };
  
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={generateSrcSet('avif')}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={generateSrcSet('webp')}
        sizes={sizes}
      />
      <img
        src={getCloudinaryUrl(800, 'auto')}
        srcSet={generateSrcSet('auto')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
      />
    </picture>
  );
}
```

### Advanced Example: Progressive Image Loading with Blur Placeholder

{% raw %}
```javascript
// ===== NEXT.JS IMAGE COMPONENT ===== 
// Automatic optimization, lazy loading, blur placeholder

import Image from 'next/image';

function HeroSection() {
  return (
    <div className="hero">
      <Image
        src="/images/hero.jpg"
        alt="Mountain landscape"
        width={1200}
        height={600}
        priority  // Eager load (disable lazy loading for LCP image)
        placeholder="blur"  // Show blur while loading
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."  // Tiny base64
        quality={85}  // Compression quality (default 75)
        sizes="100vw"
      />
    </div>
  );
}

// Next.js automatically:
// 1. Generates multiple sizes (640, 750, 828, 1080, 1200, 1920, 2048, 3840)
// 2. Converts to WebP/AVIF if browser supports
// 3. Lazy loads by default (unless priority=true)
// 4. Sets width/height to prevent CLS
// 5. Serves from /_next/image?url=...&w=800&q=75


// ===== CUSTOM LAZY LOADING WITH INTERSECTION OBSERVER =====
// For frameworks without built-in image optimization

import React, { useEffect, useRef, useState } from 'react';

function LazyImage({ src, alt, width, height, placeholder }) {
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px'  // Start loading 50px before entering viewport
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div
      ref={imgRef}
      className="lazy-image-wrapper"
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden'
      }}>
      
      {/* Blur placeholder - always visible */}
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(10px)',
          transform: 'scale(1.1)',  // Hide blur edges
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.3s'
        }}
      />
      
      {/* Actual image - loads when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />
      )}
    </div>
  );
}

// Usage
<LazyImage
  src="/images/photo-large.jpg"
  placeholder="/images/photo-tiny.jpg"  // 20px × 20px
  alt="Photo"
  width={800}
  height={600}
/>


// ===== GENERATING BLUR PLACEHOLDER =====
// Create tiny base64 image for instant display

// Using sharp (Node.js)
const sharp = require('sharp');
const fs = require('fs');

async function generateBlurPlaceholder(imagePath) {
  const buffer = await sharp(imagePath)
    .resize(20, 20, { fit: 'inside' })  // Tiny 20px version
    .blur(5)
    .jpeg({ quality: 50 })
    .toBuffer();
  
  const base64 = buffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

// Usage
const blurDataURL = await generateBlurPlaceholder('/images/hero.jpg');
console.log(blurDataURL);
// "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."

{% raw %}
// Include in img tag
<img
  src="/images/hero.jpg"
  alt="Hero"
  style={{ backgroundImage: `url(${blurDataURL})` }}
/>
{% endraw %}


{% raw %}
// ===== LQIP (Low Quality Image Placeholder) =====
// Progressive JPEG approach

function ProgressiveImage({ src, lqip, alt }) {
  const [currentSrc, setCurrentSrc] = useState(lqip);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setCurrentSrc(src);
  }, [src]);
  
  return (
    <img
      src={currentSrc}
      alt={alt}
      className={currentSrc === src ? 'loaded' : 'loading'}
      style={{
        filter: currentSrc === lqip ? 'blur(20px)' : 'none',
        transition: 'filter 0.3s'
      }}
    />
  );
}


// ===== ASPECT RATIO BOX =====
// Prevent layout shift without width/height

function AspectRatioImage({ src, alt, aspectRatio = '16/9' }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio  // Modern CSS
      }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}

// Usage
<AspectRatioImage
  src="/photo.jpg"
  alt="Photo"
  aspectRatio="4/3"
/>

// Old browser fallback using padding-bottom trick
<div
  style={{
    position: 'relative',
    paddingBottom: '75%'  // 4:3 aspect ratio (3/4 = 0.75)
  }}>
  <img
    src="/photo.jpg"
    alt="Photo"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  />
</div>
```
{% endraw %}

## Common Mistakes

### 1. Not Providing Image Dimensions
**Mistake:** Omitting width/height causes layout shift (CLS) as image loads.

{% raw %}
```html
<!-- ❌ BAD: No dimensions, causes layout shift -->
<img src="/photo.jpg" alt="Photo" />

<!-- What happens:
1. Browser renders page without knowing image size
2. Text and elements flow normally
3. Image downloads (1-2 seconds)
4. Image appears, pushes content down
5. User clicks button, button moves → missed click!
6. CLS (Cumulative Layout Shift) penalty, bad UX
-->


<!-- ✅ GOOD: Dimensions reserve space -->
<img
  src="/photo.jpg"
  alt="Photo"
  width="800"
  height="600"
/>

<!-- What happens:
1. Browser reserves 800×600px space immediately
2. Content flows around reserved space
3. Image downloads
4. Image fills reserved space, no shift
5. CLS = 0, good UX
-->


<!-- ✅ ALTERNATIVE: CSS aspect-ratio -->
<img
  src="/photo.jpg"
  alt="Photo"
  style={{ aspectRatio: '4/3', width: '100%' }}
/>

<!-- Browser calculates height based on width and aspect ratio -->
```
{% endraw %}

**Why it matters:** Layout shift (CLS) frustrates users and hurts SEO. 25% of page abandonment due to poor CLS.

### 2. Lazy Loading Above-the-Fold Images
**Mistake:** Lazy loading hero images delays LCP (Largest Contentful Paint).

```html
<!-- ❌ BAD: Lazy loading hero image -->
<img
  src="/hero.jpg"
  alt="Hero"
  width="1200"
  height="600"
  loading="lazy"
/>

<!-- What happens:
1. Page loads
2. Browser sees loading="lazy"
3. Waits until image enters viewport
4. Starts downloading (2-3 seconds after page load!)
5. LCP = 3-4 seconds (very slow)
6. Google penalizes in search rankings
-->


<!-- ✅ GOOD: Eager load + high priority for LCP image -->
<img
  src="/hero.jpg"
  alt="Hero"
  width="1200"
  height="600"
  loading="eager"
  fetchpriority="high"
/>

<!-- What happens:
1. Page loads
2. Browser immediately prioritizes hero image
3. Downloads in parallel with CSS/JS
4. LCP = 1-2 seconds (fast)
5. Good Core Web Vitals score
-->

<!-- ✅ ALTERNATIVE: Preload -->
<head>
  <link rel="preload" as="image" href="/hero.jpg" />
</head>

<img src="/hero.jpg" alt="Hero" width="1200" height="600" />
```

**Why it matters:** LCP is a Core Web Vitals metric. Slow LCP = lower Google rankings + higher bounce rate.

### 3. Serving Oversized Images
**Mistake:** Serving 3000px images to 375px mobile screens wastes 90% of data.

```html
<!-- ❌ BAD: Fixed high-res image for all devices -->
<img src="/photo-3000px.jpg" alt="Photo" />

<!-- Mobile user downloads:
- Image size: 3000 × 2000px
- File size: 2.5 MB
- Screen size: 375px wide
- Wasted: 2.3 MB (92% of download)
- Load time: 8 seconds on 3G
- Result: User bounces
-->


<!-- ✅ GOOD: Responsive srcset for different sizes -->
<img
  src="/photo-800.jpg"
  srcset="
    /photo-400.jpg 400w,
    /photo-800.jpg 800w,
    /photo-1200.jpg 1200w,
    /photo-1600.jpg 1600w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Photo"
  width="800"
  height="600"
/>

<!-- Mobile user downloads:
- Browser selects: photo-400.jpg
- Image size: 400 × 267px
- File size: 80 KB
- Screen size: 375px wide
- Perfect fit, no waste
- Load time: <1 second
- Result: Happy user
-->


<!-- ✅ ALTERNATIVE: CDN auto-sizing -->
<img
  src="https://cdn.com/photo.jpg?w=auto&dpr=auto"
  alt="Photo"
  width="800"
  height="600"
/>

<!-- CDN detects:
- Client hints from browser (viewport width, DPR)
- Automatically serves optimal size
- No manual srcset needed
-->
```

**Why it matters:** 53% of mobile users abandon sites >3s load time. Oversized images are the #1 cause of slow mobile.

## Quick Quiz

{% include quiz.html id="images-1"
   question="What's the difference between srcset and sizes on an <img>?"
   options="A|CDNs only cache JPEGs — other formats bypass the cache and are served directly from origin, which is why Cloudinary dropped WebP support in 2023;;B|They transform images on demand: resizing via URL params, reformatting to WebP / AVIF based on the Accept header, compressing per DPR via client hints, and serving everything from edge caches. You ship one source asset and the CDN delivers the right size / format / quality per request. Cloudinary, Imgix, imagekit and the CDN arms of Cloudflare / Vercel / Netlify all do this, so you don't hand-generate 12 variants per image;;C|They regenerate every image on every request, so nothing is cached — this is how CDNs guarantee freshness;;D|They are a marketing term for a fancy HTTP cache — no actual transformation happens"
   correct="B"
   explanation="Without sizes, the browser assumes 100vw and picks a larger image than needed. Give it both (srcset=&quot;a.jpg 480w, b.jpg 1200w&quot; + sizes=&quot;(max-width: 768px) 100vw, 50vw&quot;) for optimal downloads." %}

{% include quiz.html id="images-2"
   question="How do you implement progressive image loading with a blur placeholder?"
   options="A|Use only a loading spinner;;B|Preload the full-resolution image;;C|Lazy-loading alone;;D|Inline a tiny base64 blurred thumbnail (LQIP) as src or background, then swap to the full image once loaded and fade/unblur via CSS — or use the native blur-up technique frameworks like Next/Image / Gatsby-image provide out of the box"
   correct="D"
   explanation="LQIP + blur fade gives an instant visual placeholder that smoothly resolves into the full image once it arrives, improving perceived performance and LCP stability." %}

{% include quiz.html id="images-3"
   question="When should you use <picture> vs <img srcset>?"
   options="A|Use srcset+sizes for resolution switching (same image, different sizes). Use <picture> with <source> for art direction or format fallbacks — different crops per breakpoint, or WebP/AVIF with a JPEG fallback;;B|<picture> only works in Safari;;C|<picture> is deprecated;;D|They are interchangeable"
   correct="A"
   explanation="srcset = size switching. <picture> = change image, crop, or format. You often combine them: <picture> with WebP/AVIF sources + a <img srcset> fallback." %}

{% include quiz.html id="images-4"
   question="How should you optimise images for Core Web Vitals (especially LCP and CLS)?"
   options="A|Add more animations;;B|Set explicit width/height (or CSS aspect-ratio) to prevent CLS; mark the LCP hero image with fetchpriority=&quot;high&quot; and preload it; lazy-load below-the-fold images (loading=&quot;lazy&quot;); serve AVIF/WebP via <picture>; use srcset+sizes for correct downloads;;C|Always lazy-load the hero image;;D|Inline every image as base64"
   correct="B"
   explanation="Explicit dimensions prevent layout shift, priority hints accelerate the LCP image, lazy-loading saves bandwidth below the fold, and modern formats cut bytes dramatically." %}

{% include quiz.html id="images-5"
   question="How do image CDNs help automate optimisation?"
   options="A|They transform images on demand — resizing, reformatting to WebP/AVIF via Accept headers, compressing, and serving from edge caches — so you ship one source asset and the CDN delivers the right size/format per request. Many also add DPR-aware URLs and client-hint integration;;B|They only work in enterprise;;C|They only cache JPEGs;;D|They disable caching"
   correct="A"
   explanation="Cloudinary, Imgix, imagekit, and the CDN arms of Cloudflare/Vercel/Netlify all do content-aware transformation at the edge so you don't hand-generate 12 size variants per image." %}

## References

- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [web.dev: Optimize Images](https://web.dev/fast/#optimize-your-images)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Cloudinary Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Core Web Vitals](https://web.dev/vitals/)

The picture element includes multiple <source> elements with different srcset attributes for different viewport sizes.
The <img> element is the fallback for browsers that do not support the <picture> element.
