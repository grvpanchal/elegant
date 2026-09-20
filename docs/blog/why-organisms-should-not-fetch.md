---
title: "Why an organism should not fetch its own data"
slug: why-organisms-should-not-fetch
layout: post
date: 2026-07-03
author: The Elegant team
category: architecture
tags: [ui, atomic-design, architecture, data]
description: 'The moment a reusable organism fetches its own data, it stops being reusable and becomes a feature bolted to one endpoint. Keeping the fetch above it, in a container, is what keeps the UI layer portable and testable.'
cover: /assets/img/atomic-design.png
reading_minutes: 6
related_practice: [atom-boundaries, presentational-vs-container, normalize-entities]
---

An organism — a product grid, a comment thread, a sign-up form — feels big enough
to "own" its data, and the tempting move is to let it fetch on mount. Resist it.
The moment a reusable organism fetches its own data, it stops being reusable: it
is now welded to one endpoint, one data shape, one loading policy, and one set of
assumptions about *when* to load. Keep the fetch **above** the organism, in a
container, and the organism stays a portable, prop-driven piece you can drop
anywhere, render in Storybook, and test without a network. This is the single
discipline that most determines whether your UI layer is a library or a pile of
one-off features.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="of-t of-d" class="blog-figure__svg">
  <title id="of-t">An organism that fetches is bound to one endpoint; one that takes props is reusable</title>
  <desc id="of-d">Left: an organism with a fetch inside it, chained to a single endpoint, not reusable. Right: a container fetches and passes items as a prop to the same organism, which now renders in many contexts.</desc>
  <text x="150" y="26" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">fetches itself</text>
  <rect x="70" y="45" width="160" height="55" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="150" y="68" text-anchor="middle" fill="#c2571a" font-size="10">organism + fetch</text><text x="150" y="86" text-anchor="middle" fill="#819198" font-size="9">welded to /api/products</text>
  <path d="M150 100 L150 135" stroke="#c2571a" stroke-width="2" marker-end="url(#of-a)"/>
  <rect x="95" y="137" width="110" height="26" rx="5" fill="#f3f6fa" stroke="#819198"/><text x="150" y="155" text-anchor="middle" fill="#819198" font-size="9">one endpoint only</text>
  <line x1="320" y1="26" x2="320" y2="195" stroke="#dce6f0"/>
  <text x="480" y="26" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">takes props</text>
  <rect x="400" y="40" width="160" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="480" y="62" text-anchor="middle" fill="#157878" font-size="10">container fetches</text>
  <path d="M480 74 L480 100" stroke="#819198" stroke-width="2" marker-end="url(#of-a)"/><text x="520" y="92" fill="#819198" font-size="9">items={...}</text>
  <rect x="400" y="102" width="160" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="480" y="124" text-anchor="middle" fill="#c2571a" font-size="10">organism (pure)</text>
  <g stroke="#819198" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#of-a)"><path d="M400 119 L355 105"/><path d="M400 130 L355 150"/></g>
  <text x="360" y="170" text-anchor="middle" fill="#819198" font-size="9">reused in app, marketing, Storybook</text>
  <defs><marker id="of-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>The fetch is what pins an organism to a single context. Move it up to a container and the same organism serves many.</figcaption>
</figure>

## The welded version cannot be reused

Here is the organism that fetches. It works — once — for exactly the endpoint and
shape it was written against, and it drags a loading state and an error state into
a component whose job was to render a grid:

```jsx
// BOUND: this ProductGrid can only ever show /api/products
function ProductGrid() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);
  return <div className="grid">{products.map((p) => <Card key={p.id} {...p} />)}</div>;
}
```

Now try to use it for search results, or a category page, or a "related items"
strip. You cannot — you would have to change the fetch, and there is only one.

## The prop-driven version serves everyone

Hoist the fetch into a container and make the organism take `products` as a prop.
The organism no longer knows or cares where the data came from:

```jsx
// PORTABLE: renders whatever list it is handed
function ProductGrid({ products }) {
  return <div className="grid">{products.map((p) => <Card key={p.id} {...p} />)}</div>;
}

// containers supply different data to the SAME organism
const AllProducts = () => <ProductGrid products={useProducts()} />;
const SearchResults = ({ q }) => <ProductGrid products={useSearch(q)} />;
const RelatedItems = ({ id }) => <ProductGrid products={useRelated(id)} />;
```

One organism, three features. And in Storybook you render `<ProductGrid
products={fixture} />` with no network at all.

## The rule, and where it bends

The rule is crisp: **data enters at the container line, above the organism, never
inside it.** Fetching, `useSelector`, dispatching — all of it belongs at or above
that line, so everything below stays pure and portable. The one honest nuance is
that "container" is a role, not necessarily a separate file: a page component that
already has the data can compose the organism directly. What must not happen is
the organism reaching out to the world on its own, because that is the exact moment
it stops being a reusable piece and becomes a feature. This is also the boundary an
AI erodes fastest, since fetching-in-place is locally the shortest answer — which
is why it is worth a check, not just a convention. The presentational-vs-container
and atom-boundaries exercises are built around performing this hoist and defending
the line.
