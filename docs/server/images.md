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

<details>
<summary><strong>Question 1:</strong> What's the difference between `srcset` and `sizes` attributes?</summary>

**Answer:** **`srcset` lists available image sizes, `sizes` tells browser how wide the image will be displayed. Browser combines both to pick optimal image.**

```html
<!-- ===== HOW IT WORKS ===== -->
<img
  src="/photo-800.jpg"
  srcset="
    /photo-400.jpg 400w,
    /photo-800.jpg 800w,
    /photo-1200.jpg 1200w,
    /photo-1600.jpg 1600w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    800px
  "
  alt="Photo"
/>

<!-- srcset: Lists what images are available
- photo-400.jpg is 400 pixels wide
- photo-800.jpg is 800 pixels wide
- photo-1200.jpg is 1200 pixels wide
- photo-1600.jpg is 1600 pixels wide

sizes: Tells browser how big image will be:
- On mobile (<640px): image fills viewport (100vw = 100% viewport width)
- On tablet (<1024px): image is half viewport (50vw)
- On desktop: image is fixed 800px

Browser calculation:
1. Evaluate sizes based on current viewport
2. Calculate required image width
3. Account for device pixel ratio (DPR)
4. Choose smallest image from srcset that meets requirement

Example on iPhone 13:
- Viewport: 390px
- sizes matches: (max-width: 640px) 100vw
- Image width needed: 390px × 100vw = 390px
- Device pixel ratio: 3x
- Actual pixels needed: 390 × 3 = 1170px
- Browser picks: photo-1200.jpg (smallest >= 1170px)

Example on desktop (1920px):
- sizes matches: 800px (default)
- Image width needed: 800px
- Device pixel ratio: 1x (standard monitor)
- Actual pixels needed: 800px
- Browser picks: photo-800.jpg
-->


<!-- ===== WITHOUT sizes ===== -->
<img
  srcset="
    /photo-400.jpg 400w,
    /photo-800.jpg 800w,
    /photo-1200.jpg 1200w
  "
  alt="Photo"
/>

<!-- Browser assumes: sizes="100vw" (image fills viewport)
- Mobile 375px × 3 DPR = 1125px → picks 1200w
- Desktop 1920px × 1 DPR = 1920px → picks 1200w (largest available)
- Problem: Desktop downloads same size as mobile!
-->


<!-- ===== PIXEL DENSITY DESCRIPTORS ===== -->
<!-- Different syntax for fixed-size images -->

<img
  src="/logo.png"
  srcset="
    /logo-1x.png 1x,
    /logo-2x.png 2x,
    /logo-3x.png 3x
  "
  alt="Logo"
  width="200"
  height="50"
/>

<!-- No sizes needed - image is always 200×50 CSS pixels
- 1x descriptor: for standard displays
- 2x descriptor: for Retina displays (iPhone, MacBook)
- 3x descriptor: for iPhone Pro
- Browser picks based on DPR only, not viewport size
-->


<!-- ===== COMMON sizes VALUES ===== -->

<!-- Full width on all devices -->
sizes="100vw"

<!-- Half width on all devices -->
sizes="50vw"

<!-- Responsive -->
sizes="(max-width: 768px) 100vw, 50vw"

<!-- Multiple breakpoints -->
sizes="
  (max-width: 640px) 100vw,
  (max-width: 1024px) 80vw,
  (max-width: 1280px) 1000px,
  1200px
"

<!-- Complex layout -->
sizes="
  (max-width: 768px) calc(100vw - 32px),
  (max-width: 1024px) calc(50vw - 16px),
  600px
"
```

**Why it matters:** Correct `sizes` ensures browser picks optimal image size, saving bandwidth and improving performance.
</details>

<details>
<summary><strong>Question 2:</strong> How do you implement progressive image loading with a blur placeholder?</summary>

**Answer:** **Load tiny blurred version first (base64 or small JPEG), then swap to full-resolution image when loaded. Creates smooth UX instead of blank → image pop-in.**

{% raw %}
```javascript
// ===== METHOD 1: INLINE BASE64 BLUR =====
// Tiny 20×20px image embedded in HTML

function BlurImage({ src, blurDataURL, alt, width, height }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div style={{ position: 'relative', width, height }}>
      {/* Blur placeholder - instant display */}
      <img
        src={blurDataURL}  // data:image/jpeg;base64,/9j/4AAQ...
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',  // Hide blur edges
          transition: 'opacity 0.3s',
          opacity: isLoaded ? 0 : 1
        }}
      />
      
      {/* Full image - loads in background */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.3s',
          opacity: isLoaded ? 1 : 0
        }}
      />
    </div>
  );
}

// Generate blur placeholder (Node.js)
const sharp = require('sharp');

async function createBlurPlaceholder(imagePath) {
  const buffer = await sharp(imagePath)
    .resize(20, 20, { fit: 'inside' })
    .blur(5)
    .jpeg({ quality: 30 })
    .toBuffer();
  
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

// Usage
const blurDataURL = await createBlurPlaceholder('/hero.jpg');

<BlurImage
  src="/hero-large.jpg"
  blurDataURL={blurDataURL}
  alt="Hero"
  width={1200}
  height={600}
/>


// ===== METHOD 2: SEPARATE TINY IMAGE =====
// Load 20KB tiny JPEG, then swap to full image

function ProgressiveImage({ src, placeholderSrc, alt }) {
  const [imgSrc, setImgSrc] = useState(placeholderSrc);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };
  }, [src]);
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={isLoading ? 'loading' : 'loaded'}
      style={{
        filter: isLoading ? 'blur(20px)' : 'none',
        transform: isLoading ? 'scale(1.1)' : 'scale(1)',
        transition: 'filter 0.5s, transform 0.5s'
      }}
    />
  );
}

// Usage
<ProgressiveImage
  src="/photo-large.jpg"  // 500 KB
  placeholderSrc="/photo-tiny.jpg"  // 20 KB
  alt="Photo"
/>


// ===== METHOD 3: NEXT.JS AUTOMATIC =====
// Next.js generates blur placeholder automatically

import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur"  // Automatic blur generation
  blurDataURL="data:image/jpeg;base64,..."  // Optional custom
/>

// Next.js at build time:
// 1. Generates tiny 8×8px version
// 2. Converts to base64
// 3. Inlines in HTML
// 4. Shows blurred version instantly
// 5. Swaps to full image when loaded


// ===== METHOD 4: CSS BACKGROUND TRICK =====
// Use background-image for placeholder

<div
  style={{
    backgroundImage: `url(${tinyBlurDataURL})`,
    backgroundSize: 'cover',
    position: 'relative'
  }}>
  <img
    src="/photo-large.jpg"
    alt="Photo"
    onLoad={(e) => e.target.style.opacity = 1}
    style={{
      opacity: 0,
      transition: 'opacity 0.3s',
      width: '100%',
      height: 'auto'
    }}
  />
</div>


// ===== COMPARISON ===== 

// No placeholder (jarring):
// [ blank space ] → [ image pops in ]

// With color placeholder (boring):
// [ gray background ] → [ image fades in ]

// With blur placeholder (smooth):
// [ blurry image ] → [ sharp image fades in ]
// Feels faster because something is visible immediately
```
{% endraw %}

**Why it matters:** Perceived performance >>> actual performance. Users feel site is faster when they see content immediately, even if blurred.
</details>

<details>
<summary><strong>Question 3:</strong> When should you use `<picture>` vs `<img srcset>`?</summary>

**Answer:** **Use `<img srcset>` for responsive sizing (same image, different sizes). Use `<picture>` for format fallbacks (WebP→JPEG) or art direction (different crops).**

```html
<!-- ===== USE <img srcset> FOR: RESPONSIVE SIZING ===== -->
<!-- Same image, different sizes for different screens -->

<img
  src="/photo-800.jpg"
  srcset="
    /photo-400.jpg 400w,
    /photo-800.jpg 800w,
    /photo-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Product photo"
/>

<!-- Use cases:
- Same content, just scaled
- Simple responsive images
- Hero images, product photos, blog images
-->


<!-- ===== USE <picture> FOR: FORMAT FALLBACKS ===== -->
<!-- Serve WebP to modern browsers, JPEG to old browsers -->

<picture>
  <source type="image/webp" srcset="/photo.webp" />
  <source type="image/jpeg" srcset="/photo.jpg" />
  <img src="/photo.jpg" alt="Photo" />
</picture>

<!-- Browser logic:
1. Can it display image/webp? Yes → use photo.webp (25% smaller)
2. Can it display image/jpeg? Yes → use photo.jpg (fallback)
3. Nothing supported? Use <img> src
-->

<!-- Multiple formats + sizes combined -->
<picture>
  <source
    type="image/avif"
    srcset="
      /photo-400.avif 400w,
      /photo-800.avif 800w,
      /photo-1200.avif 1200w
    "
    sizes="100vw"
  />
  <source
    type="image/webp"
    srcset="
      /photo-400.webp 400w,
      /photo-800.webp 800w,
      /photo-1200.webp 1200w
    "
    sizes="100vw"
  />
  <img
    src="/photo-800.jpg"
    srcset="
      /photo-400.jpg 400w,
      /photo-800.jpg 800w,
      /photo-1200.jpg 1200w
    "
    sizes="100vw"
    alt="Photo"
  />
</picture>

<!-- Use cases:
- Want modern formats (WebP, AVIF) with fallback
- Maximum file size reduction
- Production sites optimizing bandwidth
-->


<!-- ===== USE <picture> FOR: ART DIRECTION ===== -->
<!-- Different crops for mobile vs desktop -->

<picture>
  <!-- Desktop: wide landscape (16:9) -->
  <source
    media="(min-width: 768px)"
    srcset="/banner-desktop.jpg"
  />
  
  <!-- Mobile: square crop (1:1) focusing on subject -->
  <source
    media="(max-width: 767px)"
    srcset="/banner-mobile.jpg"
  />
  
  <img src="/banner-mobile.jpg" alt="Banner" />
</picture>

<!-- Use cases:
- Portrait photo: landscape on desktop, zoomed portrait on mobile
- Text in image: readable on desktop, too small on mobile → different crop
- Banner: wide on desktop, square on mobile
-->

<!-- Real example: Team photo -->
<picture>
  <!-- Desktop: show all 5 people -->
  <source
    media="(min-width: 1024px)"
    srcset="/team-full.jpg"
  />
  
  <!-- Tablet: show 3 people -->
  <source
    media="(min-width: 768px)"
    srcset="/team-medium.jpg"
  />
  
  <!-- Mobile: show 1 person closeup -->
  <img src="/team-closeup.jpg" alt="Team" />
</picture>


<!-- ===== DECISION FLOWCHART ===== -->

// Is it the same image content, just different sizes?
//   Yes → Use <img srcset>
//   No  → Continue

// Do you need format fallbacks (WebP/AVIF)?
//   Yes → Use <picture> with type sources
//   No  → Continue

// Do you need different crops for different screens?
//   Yes → Use <picture> with media queries
//   No  → Use <img srcset>


<!-- ===== COMBINING BOTH ===== -->
<!-- Responsive sizes + format fallbacks + art direction -->

<picture>
  <!-- Desktop WebP -->
  <source
    media="(min-width: 768px)"
    type="image/webp"
    srcset="
      /banner-desktop-800.webp 800w,
      /banner-desktop-1600.webp 1600w
    "
    sizes="100vw"
  />
  
  <!-- Desktop JPEG fallback -->
  <source
    media="(min-width: 768px)"
    srcset="
      /banner-desktop-800.jpg 800w,
      /banner-desktop-1600.jpg 1600w
    "
    sizes="100vw"
  />
  
  <!-- Mobile WebP -->
  <source
    type="image/webp"
    srcset="
      /banner-mobile-400.webp 400w,
      /banner-mobile-800.webp 800w
    "
    sizes="100vw"
  />
  
  <!-- Mobile JPEG fallback -->
  <img
    src="/banner-mobile-400.jpg"
    srcset="
      /banner-mobile-400.jpg 400w,
      /banner-mobile-800.jpg 800w
    "
    sizes="100vw"
    alt="Banner"
  />
</picture>
```

**Why it matters:** Using the right element ensures optimal images are served with minimal code complexity.
</details>

<details>
<summary><strong>Question 4:</strong> How do you optimize images for Core Web Vitals?</summary>

**Answer:** **Optimize LCP with eager loading + preload + proper sizing. Prevent CLS with width/height. Reduce FID with lazy loading below-the-fold.**

```html
<!-- ===== LCP OPTIMIZATION (Largest Contentful Paint) ===== -->
<!-- Target: <2.5 seconds -->

<!-- ❌ BAD: Lazy loading LCP image -->
<img
  src="/hero.jpg"
  alt="Hero"
  loading="lazy"
/>
<!-- LCP: 3.5s (too slow) -->


<!-- ✅ GOOD: Eager load + high priority -->
<head>
  <link rel="preload" as="image" href="/hero.jpg" />
</head>

<img
  src="/hero.jpg"
  alt="Hero"
  width="1200"
  height="600"
  loading="eager"
  fetchpriority="high"
/>
<!-- LCP: 1.8s ✅ -->


<!-- Next.js approach -->
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // Disables lazy loading, adds preload
/>


<!-- ===== CLS OPTIMIZATION (Cumulative Layout Shift) ===== -->
<!-- Target: <0.1 -->

<!-- ❌ BAD: No dimensions = layout shift -->
<img src="/photo.jpg" alt="Photo" />
<!-- CLS: 0.25 (bad) -->


<!-- ✅ GOOD: Explicit dimensions -->
<img
  src="/photo.jpg"
  alt="Photo"
  width="800"
  height="600"
/>
<!-- CLS: 0 ✅ -->


{% raw %}
<!-- ✅ ALTERNATIVE: Aspect ratio -->
<img
  src="/photo.jpg"
  alt="Photo"
  style={{ aspectRatio: '4/3', width: '100%' }}
/>


<!-- Responsive aspect ratio box -->
<div style={{ aspectRatio: '16/9', width: '100%' }}>
  <img
    src="/video-thumbnail.jpg"
    alt="Thumbnail"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
{% endraw %}
  />
</div>


<!-- ===== FID OPTIMIZATION (First Input Delay) ===== -->
<!-- Target: <100ms -->

<!-- Problem: Loading all images blocks main thread -->

<!-- ✅ SOLUTION: Lazy load below-the-fold -->
<img
  src="/hero.jpg"
  alt="Hero"
  width="1200"
  height="600"
  loading="eager"  <!-- Above fold -->
/>

<img
  src="/content-1.jpg"
  alt="Content"
  width="800"
  height="600"
  loading="lazy"  <!-- Below fold -->
/>

<img
  src="/content-2.jpg"
  alt="Content"
  width="800"
  height="600"
  loading="lazy"
/>


<!-- ===== FULL OPTIMIZATION EXAMPLE ===== -->

<!DOCTYPE html>
<html>
<head>
  <!-- Preload LCP image -->
  <link
    rel="preload"
    as="image"
    href="/hero-800.webp"
    imagesrcset="
      /hero-400.webp 400w,
      /hero-800.webp 800w,
      /hero-1200.webp 1200w
    "
    imagesizes="100vw"
  />
  
  <!-- Preconnect to image CDN -->
  <link rel="preconnect" href="https://images.cdn.com" />
</head>
<body>
  <!-- LCP image: Eager, high priority, dimensions -->
  <picture>
    <source
      type="image/webp"
      srcset="
        /hero-400.webp 400w,
        /hero-800.webp 800w,
        /hero-1200.webp 1200w
      "
      sizes="100vw"
    />
    <img
      src="/hero-800.jpg"
      srcset="
        /hero-400.jpg 400w,
        /hero-800.jpg 800w,
        /hero-1200.jpg 1200w
      "
      sizes="100vw"
      alt="Hero"
      width="1200"
      height="600"
      loading="eager"
      fetchpriority="high"
    />
  </picture>
  
  <!-- Below-the-fold: Lazy load, dimensions -->
  <img
    src="/content.jpg"
    alt="Content"
    width="800"
    height="600"
    loading="lazy"
  />
</body>
</html>


<!-- ===== MONITORING CORE WEB VITALS ===== -->

// Client-side measurement
import {getCLS, getFID, getLCP} from 'web-vitals';

getCLS(console.log);  // Cumulative Layout Shift
getFID(console.log);  // First Input Delay
getLCP(console.log);  // Largest Contentful Paint

// Example output:
// { name: 'LCP', value: 1800, rating: 'good' }
// { name: 'FID', value: 50, rating: 'good' }
// { name: 'CLS', value: 0.05, rating: 'good' }


// Send to analytics
function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  fetch('/analytics', { method: 'POST', body, keepalive: true });
}

getLCP(sendToAnalytics);
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
```

**Core Web Vitals targets:**

| Metric | Good | Needs Improvement | Poor | Optimization |
|--------|------|------------------|------|--------------|
| **LCP** | <2.5s | 2.5-4s | >4s | Preload, eager load, optimize size |
| **FID** | <100ms | 100-300ms | >300ms | Lazy load, reduce JS |
| **CLS** | <0.1 | 0.1-0.25 | >0.25 | Set dimensions, aspect ratio |

**Why it matters:** Core Web Vitals are Google ranking factors. Poor scores = lower search rankings = less traffic.
</details>

<details>
<summary><strong>Question 5:</strong> How do CDNs optimize images automatically?</summary>

**Answer:** **Image CDNs (Cloudinary, Imgix, Cloudflare) detect browser capabilities, device pixel ratio, and viewport size, then automatically resize, compress, and convert images to optimal format via URL parameters.**

```html
<!-- ===== CLOUDINARY EXAMPLE ===== -->

<!-- Original image URL -->
https://res.cloudinary.com/demo/image/upload/sample.jpg

<!-- Transform via URL parameters -->

<!-- Resize to 800px wide -->
https://res.cloudinary.com/demo/image/upload/w_800/sample.jpg

<!-- Convert to WebP -->
https://res.cloudinary.com/demo/image/upload/f_webp/sample.jpg

<!-- Auto quality -->
https://res.cloudinary.com/demo/image/upload/q_auto/sample.jpg

<!-- Combine all -->
https://res.cloudinary.com/demo/image/upload/w_800,f_webp,q_auto/sample.jpg

<!-- Auto format (detects browser support) -->
https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/sample.jpg
<!-- Chrome gets WebP, Safari gets JPEG, Firefox gets WebP -->


<!-- ===== REACT COMPONENT ===== -->

function CloudinaryImage({ publicId, width, alt }) {
  const baseUrl = 'https://res.cloudinary.com/demo/image/upload';
  
  const getUrl = (transformations) => {
    return `${baseUrl}/${transformations}/${publicId}`;
  };
  
  return (
    <picture>
      <source
        type="image/webp"
        srcset={`
          ${getUrl('w_400,f_webp,q_auto')} 400w,
          ${getUrl('w_800,f_webp,q_auto')} 800w,
          ${getUrl('w_1200,f_webp,q_auto')} 1200w
        `}
        sizes="100vw"
      />
      <img
        src={getUrl('w_800,f_auto,q_auto')}
        srcset={`
          ${getUrl('w_400,f_auto,q_auto')} 400w,
          ${getUrl('w_800,f_auto,q_auto')} 800w,
          ${getUrl('w_1200,f_auto,q_auto')} 1200w
        `}
        sizes="100vw"
        alt={alt}
        width={width}
        height="auto"
      />
    </picture>
  );
}

// Usage
<CloudinaryImage
  publicId="samples/landscapes/nature"
  width={800}
  alt="Nature"
/>


<!-- ===== IMGIX EXAMPLE ===== -->

<!-- Automatic format -->
https://assets.imgix.net/photo.jpg?auto=format

<!-- Automatic compression -->
https://assets.imgix.net/photo.jpg?auto=compress

<!-- Resize + format + compress -->
https://assets.imgix.net/photo.jpg?w=800&auto=format,compress

<!-- Focal point crop (face detection) -->
https://assets.imgix.net/photo.jpg?w=400&h=400&fit=crop&crop=faces

<!-- Blur placeholder -->
https://assets.imgix.net/photo.jpg?w=20&blur=200&auto=format


<!-- ===== CLOUDFLARE IMAGES ===== -->

<!-- Automatic responsive images -->
https://imagedelivery.net/account-hash/image-id/public

<!-- Variants (predefined sizes) -->
https://imagedelivery.net/account-hash/image-id/width=800
https://imagedelivery.net/account-hash/image-id/width=400

// Define variants in Cloudflare dashboard:
// - thumbnail: 200px
// - small: 400px
// - medium: 800px
// - large: 1200px


<!-- ===== CLIENT HINTS ===== -->
<!-- Browser sends hints, CDN responds with optimal image -->

<!-- Server sends Accept-CH header -->
Accept-CH: DPR, Width, Viewport-Width

<!-- Browser sends hints with request -->
DPR: 2
Width: 800
Viewport-Width: 1920

<!-- CDN uses hints to serve optimal image automatically -->


<!-- ===== BENEFITS OF CDN TRANSFORMATION ===== -->

// 1. No need to pre-generate images
//    - Upload one high-res original
//    - CDN generates all sizes on first request
//    - Caches generated versions globally

// 2. Automatic format detection
//    - Serves WebP to Chrome
//    - Serves JPEG to IE11
//    - Serves AVIF to new browsers

// 3. Automatic quality optimization
//    - Analyzes image content
//    - Reduces quality where imperceptible
//    - Saves 20-40% file size

// 4. Global edge caching
//    - First request: Generate + cache
//    - Subsequent requests: Serve from edge
//    - Sub-100ms latency worldwide

// 5. Advanced features
//    - Face detection cropping
//    - Background removal
//    - Watermarking
//    - Color adjustments
//    - Smart cropping


<!-- ===== NEXT.JS IMAGE OPTIMIZATION ===== -->
<!-- Built-in image optimization via /_next/image -->

import Image from 'next/image';

<Image
  src="/photo.jpg"
  width={800}
  height={600}
  alt="Photo"
  quality={85}
/>

// Next.js automatically:
// - Serves WebP/AVIF if supported
// - Generates responsive sizes
// - Lazy loads by default
// - Serves from /_next/image?url=/photo.jpg&w=800&q=85

// Works with CDNs via loader:
<Image
  src="/photo.jpg"
  width={800}
  height={600}
  loader={({ src, width, quality }) => {
    return `https://cdn.com/${src}?w=${width}&q=${quality || 75}`;
  }}
/>


<!-- ===== COST COMPARISON ===== -->

// Self-hosted with manual sizes:
// - Generate 5 sizes × 3 formats = 15 files per image
// - 100 images = 1,500 files to manage
// - Storage cost + bandwidth cost
// - No global CDN

// Image CDN:
// - Upload 1 original per image
// - 100 images = 100 files
// - CDN generates on-demand
// - Global edge caching included
// - ~$0.01 per 1,000 transformations
```

**Popular image CDNs:**

| CDN | Auto Format | Auto Resize | Price | Best For |
|-----|------------|-------------|-------|----------|
| **Cloudinary** | ✅ | ✅ | Free: 25GB/mo | Full-featured |
| **Imgix** | ✅ | ✅ | $99/mo | High-traffic sites |
| **Cloudflare Images** | ✅ | ✅ | $5/100k images | Cost-effective |
| **Next.js built-in** | ✅ | ✅ | Free (self-hosted) | Next.js apps |
| **Vercel** | ✅ | ✅ | Free: 1k images/mo | Vercel deployments |

**Why it matters:** Image CDNs reduce development time, improve performance, and handle scaling automatically. ROI is massive for image-heavy sites.
</details>

## References

- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [web.dev: Optimize Images](https://web.dev/fast/#optimize-your-images)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Cloudinary Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Core Web Vitals](https://web.dev/vitals/)

The picture element includes multiple <source> elements with different srcset attributes for different viewport sizes.
The <img> element is the fallback for browsers that do not support the <picture> element.


## Best Practices for Responsive Images:
1. Use the srcset Attribute: Provide multiple resolutions of the same image, allowing the browser to pick the most appropriate based on the device's resolution.

```jsx
<img 
  srcset="/images/sample-small.jpg 480w, 
          /images/sample-medium.jpg 768w, 
          /images/sample-large.jpg 1200w" 
  sizes="(max-width: 768px) 100vw, 50vw" 
  src="/images/sample-small.jpg" 
  alt="Sample Image">
```
In this case, the browser will choose the appropriate image size based on the viewport width.

2. WebP Format: If supported by the browser, use WebP images, which offer superior compression and quality compared to traditional image formats like JPEG and PNG.

```jsx
<picture>
  <source srcset="/images/sample.webp" type="image/webp">
  <img src="/images/sample.jpg" alt="Sample Image">
</picture>
```

3. Set the sizes Attribute: The sizes attribute is used to specify how large the image should be displayed in different contexts. This helps the browser choose the most appropriate image size for the display.

```jsx
<img 
  srcset="/images/sample-small.jpg 480w, 
          /images/sample-medium.jpg 768w, 
          /images/sample-large.jpg 1200w" 
  sizes="(max-width: 768px) 100vw, 50vw" 
  src="/images/sample-small.jpg" 
  alt="Sample Image">
```