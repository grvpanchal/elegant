---
name: server-index-file
description: Index files as entry-point contracts — `index.html` as the directory default (Apache `DirectoryIndex` / Nginx `index`), the SPA host document with its mount node and deferred module script, `index.js` directory resolution and barrel exports, bundler entry points, and `package.json` `main`/`module`/`exports`. Use when editing an HTML entry document, wiring a bundler entry, adding or debugging a barrel file, configuring SPA history fallback, or fixing "Cannot find module" on a package entry.
when_to_use: Editing or reviewing an `index.html` host document; adding a barrel `index.js` and hitting circular-import or tree-shaking problems; setting a bundler entry or output dir; configuring Nginx/Apache directory index and SPA fallback; declaring `main`/`module`/`types`/`exports` for a publishable package; debugging 403 on a directory URL or 404 on a deep SPA route.
paths:
  - "**/index.html"
  - "**/src/index.{js,jsx,ts,tsx}"
  - "**/{pages,state,components,ui,utils}/index.{js,jsx,ts,tsx}"
---

# Index File

## What is an Index File?

An index file is the default name a resolver reaches for when a path points at a *directory* instead of a file. Servers map `/docs/` to `docs/index.html`; Node and bundlers map `import './pages'` to `pages/index.js`; npm consumers land on whatever `package.json` `main`/`exports` names. It is one convention reused at three layers — HTTP, module resolution, and package publishing — and each layer fails differently when it is missing.

## Key Principles

1. **Index is a Default, Not a Filename**: Nothing special happens because a file is called `index`. A server directive (`DirectoryIndex`, `index`), the Node resolution algorithm, or a bundler `entry` field is what confers the meaning. Change the directive and the default moves.

2. **One Document, Many Roles**: A SPA's `index.html` is simultaneously the crawler's first response, the critical-path budget, and the mount point for the JS app. Everything that must exist before hydration — charset, viewport, favicon, manifest, the root `<div>` — lives there and nowhere else.

3. **Entry Points Define Reachability**: Tree-shaking is reachability analysis from the entry. Pick the wrong entry, or funnel every import through a fat barrel, and the bundler can no longer prove unused exports are dead.

## Best Practices

✅ **DO**:
- Ship an index file in every served directory, or disable directory listing (`Options -Indexes`, `autoindex off`)
- Add SPA history fallback (`try_files $uri $uri/ /index.html`) so deep routes survive a refresh
- Keep the host document minimal: `charset` first, viewport, title/description, one mount node, one deferred module script
- Use barrels for *public* surfaces (a feature folder, a component library) and direct paths inside a folder
- Declare `exports` (plus `main`/`module`/`types` for legacy resolvers) and verify with `npm pack` before publishing
- Pick one canonical URL form (with or without trailing slash) and 301 the other

❌ **DON'T**:
- Import a sibling through the barrel that re-exports it — that is a circular import and yields `undefined` at module-init time
- Put render-blocking `<link rel="stylesheet">` / synchronous `<script>` chains in `<head>`
- Point `main` at a source path that the build never emits
- Rely on directory listing as a file browser in production
- Assume `/products` and `/products/` are the same URL to a crawler
- Re-export everything from a root barrel just to shorten imports

## Code Patterns

### Directory Index on the Server

```nginx
server {
  root /var/www/html;
  index index.html index.htm;
  autoindex off;                       # no filename leaks

  location / {
    try_files $uri $uri/ /index.html;  # SPA history fallback
  }

  location ~* \.(js|css|png|svg|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

Apache's equivalent is `DirectoryIndex index.html index.htm` plus `Options -Indexes`. Without either, a directory request returns 403 or an auto-generated listing.

### The SPA Host Document

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My App</title>
    <meta name="description" content="150–160 characters for the SERP snippet" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />
    <style>/* critical, above-the-fold CSS only */</style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

`type="module"` is deferred by definition, so parsing is never blocked. A crawler that does not execute JS sees only the empty `#root` — that is the SEO trade-off SSR/SSG exists to solve.

### Directory Resolution and Barrels

```javascript
// src/ui/atoms/index.js — a barrel over a public surface
export { default as Button } from './Button/Button.component';
export { default as Input } from './Input/Input.component';

// Consumers resolve the directory, not the file
import { Button, Input } from '../ui/atoms';   // → ../ui/atoms/index.js

// ❌ Inside Button.component.jsx — cycles back through the mid-evaluation barrel
import { Input } from '../index';
// ✅ Import the sibling directly
import Input from '../Input/Input.component';
```

Node's order is: exact file → `<dir>/package.json` `main` → `<dir>/index.js` → throw `Cannot find module`.

### Package Entry Points

```json
{
  "name": "my-library",
  "exports": {
    ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" },
    "./utils": "./dist/utils/index.mjs"
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"]
}
```

When `exports` is present it wins over `main`/`module` *and* blocks unlisted deep imports. Resolution priority: `exports` → `module` (bundlers) → `main` → `index.js`.

### In the elegant templates

`templates/chota-react-saga` uses the Vite convention: `index.html` at the project root is the build entry, not a `public/` asset.

```html
<!-- index.html -->
<div id="root"></div>
<script type="module" src="/src/index.jsx"></script>
```

```jsx
// src/index.jsx
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

`vite.config.js` sets `build: { outDir: 'build' }` and `base: './'` — relative asset URLs, so the built `build/index.html` can be served from a subdirectory (which is how `demos.sh` publishes it under `docs/demos/`). The templates also lean on directory resolution for their own layers: `App.jsx` does `import HomePage from './pages'` (→ `src/pages/index.jsx`) and `import store from './state'` (→ `src/state/index.js`). Note there is no `main` field in a template's `package.json` — these are apps, not libraries, so the bundler entry is the only entry that matters.

## Related Terminologies

- **App Shell** (Server) - The cached skeleton the host document paints first
- **SEO** (Server) - An empty `#root` is what crawlers see without SSR/SSG
- **SSR / SSG** (Server) - Fill `index.html` with real markup per route
- **PWA** (Server) - Manifest and service-worker registration hang off the host document
- **Atom / Molecule** (UI) - Barrel `index.js` files expose these layers

## Quality Gates

- [ ] Every served directory has an index file, or listing is disabled
- [ ] SPA deep routes fall back to `index.html` (no 404 on refresh)
- [ ] Host document has `charset` first, viewport, title, description, and one mount node
- [ ] Scripts are `type="module"` or `defer`; no render-blocking `<head>` chains
- [ ] Barrels never import their own siblings back through themselves
- [ ] Published packages declare `exports`/`main` pointing at emitted build output

**Source**: `/docs/server/index-file.md`
