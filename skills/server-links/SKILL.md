---
name: server-links
description: Links and navigation — `<a href>` vs `<button>` semantics, client-side router links vs full page reloads, `rel="noopener noreferrer"` on `target="_blank"`, `javascript:` href sanitisation, URL/search-param state, prefetch strategies (hover / viewport / idle) and resource hints, `aria-current` and skip links, canonical URLs and crawlability. Use when adding navigation, building a Link component, or reviewing an anchor that isn't really navigating.
when_to_use: Adding or reviewing navigation markup and Link components; deciding between an anchor and a button; wiring client-side router links while keeping a real `href` for no-JS and crawlers; securing external links and user-supplied hrefs; storing filter/search/pagination state in the URL; choosing a prefetch strategy or resource hint; fixing `href="#"` anchors used as action controls.
paths:
  - "**/ui/atoms/Link/**/*"
  - "**/*Link*.{jsx,tsx,vue,js,ts}"
  - "**/{routes,router,navigation}/**/*.{jsx,tsx,vue,js,ts}"
---

# Links

## What is a Link?

A link is a navigation to another resource — and that word is load-bearing. `<a href>` gives you keyboard activation, focus, the context menu, middle-click, a status-bar URL preview, crawlability, and a "link" role in assistive tech. A `<button>` gives you an *action* in the current document. A router `<Link>` is an `<a href>` whose click is intercepted so the URL changes via `history.pushState()` and the component tree re-renders instead of the page reloading, which preserves store and component state.

## Key Principles

1. **Navigation → Anchor, Action → Button**: If activating it changes the URL/resource, it must be an `<a href>` (or a router `<Link>` that renders one). If it mutates state, toggles UI, or submits, it must be a `<button>`. `href="#"` with `preventDefault()` is a smell: it pollutes history, scrolls to top, and lies about semantics.

2. **Keep the Real `href`**: A router link should still emit a working `href` so it survives no-JS, is crawlable, and supports open-in-new-tab. Use plain `<a>` deliberately for cross-origin, downloads, `mailto:`/`tel:`, and when you *want* a hard reload.

3. **Links Are an Attack Surface**: `target="_blank"` without `rel="noopener noreferrer"` hands the destination `window.opener`; a user-supplied `href` can be `javascript:…`; an unvalidated `?url=` redirect is an open redirect. Validate protocol and allow-list destinations.

## Best Practices

✅ **DO**:
- Use `<a href>`/`<Link to>` for navigation and `<button type="button">` for actions
- Add `rel="noopener noreferrer"` to every `target="_blank"` link
- Allow only `http:`/`https:` (plus known schemes) for hrefs that come from data
- Mark the current destination with `aria-current="page"`
- Offer a focus-visible skip link to `#main-content`
- Keep shareable state (filters, search, sort, page) in search params

❌ **DON'T**:
- Use `href="#"` + `onClick` as a substitute for a button
- Navigate with `window.location = …` inside a `<button>`
- Disable a link with a class — render a `<button disabled>` or plain text instead
- Announce external links by icon alone (add visually hidden text)
- Prefetch every link on the page regardless of connection or `saveData`
- Put tokens, passwords, or PII in the URL

## Code Patterns

### Semantics: Link vs Button

```jsx
// Navigation — a resource change
<Link to="/checkout">Checkout</Link>
<a href="/report.pdf" download="report.pdf">Download report</a>

// Action — no resource change
<button type="button" onClick={toggleMenu}>Open menu</button>
<button type="button" onClick={() => onFilterClick(id)}>Completed</button>

// Anti-pattern: an anchor pretending to be a button
<a href="#" onClick={(e) => { e.preventDefault(); doThing(); }}>Do thing</a>
```

### External and Untrusted Links

```jsx
const SAFE = ['http:', 'https:', 'mailto:', 'tel:'];
const safeHref = (url) => {
  try { return SAFE.includes(new URL(url, window.location.origin).protocol) ? url : null; }
  catch { return null; }
};

const href = safeHref(user.website);
return href ? (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {user.website}
    <span className="sr-only"> (opens in a new window)</span>
  </a>
) : null;
```

`noopener` blocks `window.opener.location` phishing; `noreferrer` also withholds the `Referer`. Never interpolate an unvalidated URL into `href` — `javascript:alert(1)` executes.

### URL as State

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const filter = searchParams.get('filter') ?? 'all';

const setFilter = (value) => {
  const next = new URLSearchParams(searchParams);
  value === 'all' ? next.delete('filter') : next.set('filter', value);
  next.delete('page');            // reset pagination when filters change
  setSearchParams(next);
};
```

Put filters, search text, sort and pagination in the URL (shareable, bookmarkable, back/forward-safe, crawlable). Keep modals, drafts, tokens and theme in client state.

### Prefetching and Resource Hints

```html
<link rel="dns-prefetch" href="https://api.example.com" /><!-- resolve DNS early -->
<link rel="preconnect" href="https://cdn.example.com" />   <!-- DNS + TCP + TLS -->
<link rel="prefetch" href="/products" />                   <!-- low-pri, next nav -->
<link rel="preload" as="style" href="/critical.css" />     <!-- high-pri, this page -->
```

```js
// Respect the network before prefetching aggressively
const c = navigator.connection;
const aggressive = !c || (c.effectiveType === '4g' && !c.saveData);
```

Hover prefetch is accurate but desktop-only; viewport (Intersection Observer) prefetch works on touch but wastes bytes; idle prefetch is cheapest to write and least accurate. Manual prefetch on a known next step (cart → checkout) has the best hit rate.

### Accessible Navigation

```jsx
<a href="#main-content" className="skip-link">Skip to main content</a>

<nav aria-label="Main">
  <a href="/" aria-current={pathname === '/' ? 'page' : undefined}>Home</a>
  <a href="/about" aria-current={pathname === '/about' ? 'page' : undefined}>About</a>
</nav>

<main id="main-content" tabIndex={-1}>…</main>
```

After a client-side navigation, move focus to `#main-content` — otherwise focus stays on the old link and screen-reader users get no announcement that the view changed.

### In the elegant templates

`ui/atoms/Link/Link.component.jsx` is **not** a navigation link — read it before reusing it:

```jsx
const Link = ({ isActive, children, onClick }) => (
  <a href="#" className={`button ${isActive ? 'primary' : 'outline'}`}
     onClick={onClick} disabled={isActive} role="button">
    {children}
  </a>
);
```

It is an action control styled as a chota button, consumed by `ui/molecules/FilterGroup` to switch the todo filter (the click callback comes from `containers/TodoFiltersContainer.jsx`). That is why the file carries an `eslint-disable jsx-a11y/anchor-is-valid` comment. Two honest consequences: `href="#"` and `disabled` are both inert-to-harmful on an anchor (a native `<button>` would give real disabled semantics and no history entry), and this atom must not be used for navigation. **When you are actually navigating, render a real `href`** — a router `<Link to>` or `<a href="/path">` — and keep the atom presentational: the click handler always arrives as a prop from a container, never a `useNavigate`/`useDispatch` call inside `src/ui/**`.

## Related Terminologies

- **Atom** (UI) - `Link` is an atom wrapping the anchor element
- **Router** (Server) - Intercepts link clicks for client-side navigation
- **Container** (Server) - Supplies `onClick`/navigation callbacks to presentational links
- **Accessibility** (UI) - Roles, `aria-current`, skip links, focus after navigation
- **Page** (Server) - Links are how pages are discovered and connected
- **App Shell** (Server) - Navigation lives in the cached shell

## Quality Gates

- [ ] Every navigation uses `<a href>`/`<Link to>`; every action uses `<button>`
- [ ] No `href="#"` anchors standing in for buttons
- [ ] All `target="_blank"` links carry `rel="noopener noreferrer"`
- [ ] Data-supplied hrefs are protocol-validated (no `javascript:`)
- [ ] Current destination marked with `aria-current="page"`
- [ ] Shareable state (filter/search/sort/page) lives in the URL, secrets do not

**Source**: `/docs/server/links.md`
