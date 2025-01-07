---
title: Images
layout: default
---

# Universal Image Component Documentation

## Overview

This document describes the universal Image Component that provides various optimizations for SSR (Server-Side Rendering), lazy loading, caching policy, and responsiveness. The goal is to deliver images in an efficient, SEO-friendly, and performance-optimized manner across different devices.

## Features

- **SSR Optimization**: Ensures images are rendered correctly on the server and do not block the page’s initial rendering.
- **Lazy Loading**: Delays the loading of off-screen images to improve page load times and user experience.
- **Caching Policy**: Utilizes caching strategies to improve image loading time across sessions.
- **Responsive Images with `picture`**: Provides a responsive image solution using the `<picture>` element, delivering different image sources based on screen size or device type.

---

## 1. SSR Optimization

To optimize images for Server-Side Rendering (SSR), ensure the images are included in the HTML response and are not dependent on JavaScript execution. This can be achieved by rendering image sources dynamically on the server side.

```jsx
// Example with Next.js (SSR Framework)
import Image from 'next/image';

const SSRImage = () => (
  <Image 
    src="/images/sample.jpg"
    alt="Sample Image"
    width={1200}
    height={800}
  />
);
```
How it works: The next/image component handles SSR out of the box by ensuring that the image source is loaded with the initial HTML markup, without the need for JavaScript to execute for fetching the image.

## 2. Lazy Loading

Lazy loading helps by deferring the loading of offscreen images. It improves initial page load time and overall user experience. This is especially helpful for pages with many images.

Native Lazy Loading: Modern browsers support lazy loading via the loading="lazy" attribute. For maximum compatibility, this can be combined with a JavaScript-based solution for browsers that don't support it.

```jsx
<img src="/images/sample.jpg" alt="Sample Image" loading="lazy">
```
Using with React or Frameworks
For frameworks like React or Next.js, lazy loading can be managed using a wrapper component:

```jsx
import React from 'react';

const LazyImage = ({ src, alt, width, height }) => (
  <img 
    src={src} 
    alt={alt} 
    width={width} 
    height={height} 
    loading="lazy" 
  />
);
```

## 3. Caching Policy

Images should be cached efficiently for better performance. This can be achieved using various caching strategies, including setting proper cache headers for images. Google recommends using the preload directive for important images.

Preload Example:

```jsx
<link rel="preload" href="/images/sample.jpg" as="image">
```
This ensures that the image is preloaded early, improving its load time.

Cache Headers (HTTP Example)
For long-term caching, set cache headers on your server like:

```jsx
Cache-Control: public, max-age=31536000, immutable
```

This allows the browser to cache the image for one year, with immutable meaning the image will not be re-fetched unless the URL changes.

For responsive images, make sure to leverage different image sizes and set cache policies for each size. Use formats like WebP when possible for better compression.

## 4. Responsive Images with picture

The picture element allows for delivering different image sizes based on the viewport size or device characteristics, which is crucial for responsive design.

```jsx
<picture>
  <source media="(min-width: 768px)" srcset="/images/sample-large.jpg">
  <source media="(min-width: 320px)" srcset="/images/sample-medium.jpg">
  <img src="/images/sample-small.jpg" alt="Sample Image">
</picture>
```

In this example:

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