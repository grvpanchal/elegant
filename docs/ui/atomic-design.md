---
title: Atomic Design
layout: doc
slug: atomic-design
---

# Atomic Design

> - Design methodology inspired by chemistry: atoms → molecules → organisms → templates → pages
> - Creates scalable, reusable component design systems
> - Enables concurrent creation of UI and design system

## Key Insight

Atomic Design isn't a step-by-step process ("first make all atoms, then molecules...")—it's a mental model for thinking about UI hierarchy. The chemistry metaphor helps teams communicate: "This button is an atom, this search form is a molecule (label + input + button), this header is an organism (logo molecule + navigation molecule + search molecule)." The power comes from seeing both the forest and the trees simultaneously: you can drill down from a page to its template to its organisms to its molecules to its atoms, or build up from atoms to pages. This prevents the common trap of designing one-off pages with no reusable components. The five levels (atoms, molecules, organisms, templates, pages) aren't strict rules—some teams add ions (design tokens) or ecosystems (multi-page flows)—they're a shared language for discussing modularity.

## Detailed Description

Atomic design is a methodology for creating interface design systems, inspired by chemistry and the natural world. It consists of five distinct stages that work together to create a hierarchical and deliberate approach to UI design.

**The Five Levels:**

1. **Atoms**: The basic building blocks of interfaces
   - HTML elements like `<button>`, `<input>`, `<label>`, `<h1>`
   - Abstract elements like colors, fonts, spacing values
   - Cannot be broken down further without losing meaning
   - Examples: Button, input field, icon, color swatch, typography style

2. **Molecules**: Simple groups of UI elements functioning together as a unit
   - Combination of atoms that form a functional unit
   - Single responsibility: do one thing well
   - Examples: Search form (label + input + button), card header (avatar + name + timestamp), form field (label + input + error message)

3. **Organisms**: Relatively complex components composed of groups of molecules and/or atoms
   - Form distinct sections of an interface
   - Standalone, reusable components
   - Examples: Header (logo + navigation + search), product card (image + title + description + price + button), comment thread (multiple comment molecules)

4. **Templates**: Page-level objects that place components into a layout
   - Articulate the design's underlying content structure
   - Focus on content structure, not final content
   - Show component placement and relationships
   - Examples: Homepage template (hero + features grid + testimonials + footer), blog post template (header + sidebar + content area), dashboard template (nav + stats widgets + charts)

5. **Pages**: Specific instances of templates with real representative content
   - Show what the UI actually looks like with real content
   - Test templates with varying content lengths
   - Examples: Homepage with actual product data, blog post about "Atomic Design", user dashboard for "Alice"

**Key Principles:**

- **Non-linear process**: You don't create atoms first, then molecules, etc. You work across all levels simultaneously
- **Abstract to concrete**: Quickly shift between abstract components and concrete implementations
- **Content awareness**: While templates are content-agnostic, pages reveal how real content affects design
- **Shared vocabulary**: Chemistry metaphor provides intuitive language for discussing hierarchy
- **Technology agnostic**: Works with React, Vue, Angular, Web Components, CSS, etc.

## References

- [1] https://atomicdesign.bradfrost.com/chapter-2/
## Code Examples

### Basic Example: Atoms → Molecules → Organisms

```html
<!-- ===== ATOMS ===== -->
<!-- Basic building blocks that can't be broken down further -->

<!-- Atom: Button -->
<button class="btn btn-primary">Click me</button>
<button class="btn btn-secondary">Cancel</button>

<!-- Atom: Input -->
<input type="text" class="input" placeholder="Enter text">

<!-- Atom: Label -->
<label class="label">Email</label>

<!-- Atom: Icon -->
<svg class="icon icon-search">
  <use href="#icon-search"></use>
</svg>

<!-- Atom: Heading -->
<h2 class="heading heading-lg">Welcome</h2>


<!-- ===== MOLECULES ===== -->
<!-- Simple groups of atoms functioning together -->

<!-- Molecule: Form Field (label + input + error) -->
<div class="form-field">
  <label class="label" for="email">Email</label>
  <input type="email" class="input" id="email">
  <span class="error-message">Please enter a valid email</span>
</div>

<!-- Molecule: Search Form (label + input + button) -->
<form class="search-form">
  <label class="label sr-only" for="search">Search</label>
  <input type="search" class="input" id="search" placeholder="Search...">
  <button type="submit" class="btn btn-primary">
    <svg class="icon"><use href="#icon-search"></use></svg>
    Search
  </button>
</form>

<!-- Molecule: Card Header (avatar + name + timestamp) -->
<div class="card-header">
  <img src="avatar.jpg" alt="User avatar" class="avatar">
  <div class="user-info">
    <h3 class="heading heading-sm">Alice Johnson</h3>
    <time class="timestamp">2 hours ago</time>
  </div>
</div>


<!-- ===== ORGANISMS ===== -->
<!-- Complex components made of molecules and atoms -->

<!-- Organism: Site Header (logo + navigation + search) -->
<header class="site-header">
  <!-- Logo molecule (image + text) -->
  <div class="logo">
    <img src="logo.svg" alt="Company Logo" class="logo-image">
    <span class="logo-text">MyApp</span>
  </div>
  
  <!-- Navigation molecule (list of links) -->
  <nav class="main-nav">
    <a href="/home" class="nav-link">Home</a>
    <a href="/products" class="nav-link">Products</a>
    <a href="/about" class="nav-link">About</a>
  </nav>
  
  <!-- Search molecule -->
  <form class="search-form">
    <input type="search" class="input" placeholder="Search...">
    <button type="submit" class="btn btn-primary">Search</button>
  </form>
</header>

<!-- Organism: Product Card -->
<article class="product-card">
  <!-- Image atom -->
  <img src="product.jpg" alt="Product name" class="product-image">
  
  <!-- Card content molecules -->
  <div class="product-info">
    <h3 class="heading heading-md">Product Name</h3>
    <p class="product-description">Product description text here.</p>
    
    <!-- Price molecule (label + price) -->
    <div class="product-price">
      <span class="price-label">Price:</span>
      <span class="price-value">$99.99</span>
    </div>
    
    <!-- Button atom -->
    <button class="btn btn-primary">Add to Cart</button>
  </div>
</article>
```

### Practical Example: Building a Complete Design System

```javascript
// ===== DESIGN TOKENS (Sub-atomic level) =====
// Values that feed into atoms

const designTokens = {
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    gray100: '#f8f9fa',
    gray900: '#212529'
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem'      // 32px
  },
  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      heading: 'Georgia, serif'
    },
    fontSize: {
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.5rem',    // 24px
      '2xl': '2rem'    // 32px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px'
  }
};


// ===== ATOMS =====
// React component examples

import React from 'react';

// Atom: Button
function Button({ variant = 'primary', size = 'md', children, ...props }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      {...props}>
      {children}
    </button>
  );
}

// Atom: Input
function Input({ type = 'text', ...props }) {
  return (
    <input
      type={type}
      className="input"
      {...props}
    />
  );
}

// Atom: Label
function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="label">
      {children}
    </label>
  );
}

// Atom: Heading
function Heading({ level = 2, size = 'md', children }) {
  const Tag = `h${level}`;
  return <Tag className={`heading heading-${size}`}>{children}</Tag>;
}


// ===== MOLECULES =====

// Molecule: Form Field (label + input + error)
function FormField({ label, id, error, ...inputProps }) {
  return (
    <div className="form-field">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!error} {...inputProps} />
      {error && <span className="error-message" role="alert">{error}</span>}
    </div>
  );
}

// Molecule: Search Form
function SearchForm({ onSearch, placeholder = 'Search...' }) {
  const [query, setQuery] = React.useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <Label htmlFor="search" className="sr-only">Search</Label>
      <Input
        type="search"
        id="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="primary">Search</Button>
    </form>
  );
}

// Molecule: User Badge (avatar + name)
function UserBadge({ user }) {
  return (
    <div className="user-badge">
      <img src={user.avatar} alt="" className="avatar" />
      <span className="user-name">{user.name}</span>
    </div>
  );
}


// ===== ORGANISMS =====

// Organism: Site Header
function SiteHeader({ user, onSearch }) {
  return (
    <header className="site-header">
      {/* Logo molecule */}
      <div className="logo">
        <img src="/logo.svg" alt="MyApp" className="logo-image" />
        <span className="logo-text">MyApp</span>
      </div>
      
      {/* Navigation */}
      <nav className="main-nav">
        <a href="/home" className="nav-link">Home</a>
        <a href="/products" className="nav-link">Products</a>
        <a href="/about" className="nav-link">About</a>
      </nav>
      
      {/* Search molecule */}
      <SearchForm onSearch={onSearch} />
      
      {/* User molecule */}
      <UserBadge user={user} />
    </header>
  );
}

// Organism: Product Grid
function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Organism: Product Card
function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      
      <div className="product-info">
        <Heading level={3} size="md">{product.name}</Heading>
        <p className="product-description">{product.description}</p>
        
        <div className="product-price">
          <span className="price-label">Price:</span>
          <span className="price-value">${product.price}</span>
        </div>
        
        <Button variant="primary" onClick={() => addToCart(product)}>
          Add to Cart
        </Button>
      </div>
    </article>
  );
}


// ===== TEMPLATES =====

// Template: E-commerce Homepage Layout
function HomepageTemplate({ header, hero, featuredProducts, footer }) {
  return (
    <div className="homepage-template">
      {header}
      
      <main>
        <section className="hero-section">
          {hero}
        </section>
        
        <section className="featured-products-section">
          <Heading level={2} size="xl">Featured Products</Heading>
          {featuredProducts}
        </section>
      </main>
      
      {footer}
    </div>
  );
}

// Template: Dashboard Layout
function DashboardTemplate({ sidebar, mainContent, widgets }) {
  return (
    <div className="dashboard-template">
      <aside className="dashboard-sidebar">
        {sidebar}
      </aside>
      
      <main className="dashboard-main">
        <div className="dashboard-widgets">
          {widgets}
        </div>
        
        <div className="dashboard-content">
          {mainContent}
        </div>
      </main>
    </div>
  );
}


// ===== PAGES =====

// Page: Actual Homepage with real content
function Homepage() {
  const user = { name: 'Alice', avatar: '/alice.jpg' };
  const products = [
    { id: 1, name: 'Laptop', description: 'Powerful laptop', price: 999, image: '/laptop.jpg' },
    { id: 2, name: 'Mouse', description: 'Wireless mouse', price: 29, image: '/mouse.jpg' }
  ];
  
  return (
    <HomepageTemplate
      header={<SiteHeader user={user} onSearch={query => console.log(query)} />}
      hero={
        <div className="hero">
          <Heading level={1} size="2xl">Welcome to MyApp</Heading>
          <p>Find the best products</p>
          <Button variant="primary" size="lg">Shop Now</Button>
        </div>
      }
      featuredProducts={<ProductGrid products={products} />}
      footer={<footer className="site-footer">© 2024 MyApp</footer>}
    />
  );
}
```

### Advanced Example: Atomic Design in Vue with Composition API

```vue
<!-- ===== ATOMS ===== -->

<!-- Button.vue -->
<template>
  <button
    :class="['btn', `btn-${variant}`, `btn-${size}`]"
    :type="type"
    @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' }
});

defineEmits(['click']);
</script>


<!-- Input.vue -->
<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :aria-invalid="invalid"
    class="input"
    @input="$emit('update:modelValue', $event.target.value)">
</template>

<script setup>
defineProps({
  type: { type: String, default: 'text' },
  modelValue: String,
  placeholder: String,
  invalid: Boolean
});

defineEmits(['update:modelValue']);
</script>


<!-- ===== MOLECULES ===== -->

<!-- FormField.vue -->
<template>
  <div class="form-field">
    <label :for="id" class="label">{{ label }}</label>
    <Input
      :id="id"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :invalid="!!error"
    />
    <span v-if="error" class="error-message" role="alert">
      {{ error }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Input from './Input.vue';

const props = defineProps({
  label: String,
  id: String,
  type: String,
  placeholder: String,
  modelValue: String,
  error: String
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>


<!-- SearchForm.vue -->
<template>
  <form class="search-form" @submit.prevent="handleSearch">
    <Input
      v-model="query"
      type="search"
      :placeholder="placeholder"
    />
    <Button type="submit" variant="primary">
      Search
    </Button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import Input from './Input.vue';
import Button from './Button.vue';

defineProps({
  placeholder: { type: String, default: 'Search...' }
});

const emit = defineEmits(['search']);

const query = ref('');

function handleSearch() {
  emit('search', query.value);
}
</script>


<!-- ===== ORGANISMS ===== -->

<!-- ProductCard.vue -->
<template>
  <article class="product-card">
    <img
      :src="product.image"
      :alt="product.name"
      class="product-image">
    
    <div class="product-info">
      <h3 class="heading heading-md">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      
      <div class="product-price">
        <span class="price-label">Price:</span>
        <span class="price-value">${{ product.price }}</span>
      </div>
      
      <Button variant="primary" @click="$emit('add-to-cart', product)">
        Add to Cart
      </Button>
    </div>
  </article>
</template>

<script setup>
import Button from './Button.vue';

defineProps({
  product: {
    type: Object,
    required: true
  }
});

defineEmits(['add-to-cart']);
</script>


<!-- SiteHeader.vue -->
<template>
  <header class="site-header">
    <div class="logo">
      <img src="/logo.svg" alt="MyApp" class="logo-image">
      <span class="logo-text">MyApp</span>
    </div>
    
    <nav class="main-nav">
      <a href="/home" class="nav-link">Home</a>
      <a href="/products" class="nav-link">Products</a>
      <a href="/about" class="nav-link">About</a>
    </nav>
    
    <SearchForm @search="handleSearch" />
    
    <div class="user-badge">
      <img :src="user.avatar" alt="" class="avatar">
      <span class="user-name">{{ user.name }}</span>
    </div>
  </header>
</template>

<script setup>
import SearchForm from './SearchForm.vue';

defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['search']);

function handleSearch(query) {
  emit('search', query);
}
</script>


<!-- ===== TEMPLATES ===== -->

<!-- HomepageTemplate.vue -->
<template>
  <div class="homepage-template">
    <slot name="header" />
    
    <main>
      <section class="hero-section">
        <slot name="hero" />
      </section>
      
      <section class="featured-products-section">
        <h2 class="heading heading-xl">Featured Products</h2>
        <slot name="featured-products" />
      </section>
    </main>
    
    <slot name="footer" />
  </div>
</template>


<!-- ===== PAGES ===== -->

<!-- HomePage.vue -->
<template>
  <HomepageTemplate>
    <template #header>
      <SiteHeader :user="user" @search="handleSearch" />
    </template>
    
    <template #hero>
      <div class="hero">
        <h1 class="heading heading-2xl">Welcome to MyApp</h1>
        <p>Find the best products</p>
        <Button variant="primary" size="lg">Shop Now</Button>
      </div>
    </template>
    
    <template #featured-products>
      <div class="product-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
    </template>
    
    <template #footer>
      <footer class="site-footer">© 2024 MyApp</footer>
    </template>
  </HomepageTemplate>
</template>

<script setup>
import { ref } from 'vue';
import HomepageTemplate from './HomepageTemplate.vue';
import SiteHeader from './SiteHeader.vue';
import ProductCard from './ProductCard.vue';
import Button from './Button.vue';

const user = ref({ name: 'Alice', avatar: '/alice.jpg' });

const products = ref([
  { id: 1, name: 'Laptop', description: 'Powerful laptop', price: 999, image: '/laptop.jpg' },
  { id: 2, name: 'Mouse', description: 'Wireless mouse', price: 29, image: '/mouse.jpg' }
]);

function handleSearch(query) {
  console.log('Search:', query);
}

function addToCart(product) {
  console.log('Add to cart:', product);
}
</script>
```

## Common Mistakes

### 1. Skipping Atoms and Creating One-Off Components
**Mistake:** Building molecules directly without reusable atoms.

{% raw %}
```javascript
// ❌ BAD: One-off search form with no reusable atoms
function SearchForm() {
  return (
    <form>
      {/* Hardcoded styles, no reusability */}
      <input
        type="search"
        style={{ padding: '8px', border: '1px solid #ccc' }}
        placeholder="Search..."
      />
      <button style={{ background: '#0066cc', color: 'white', padding: '8px 16px' }}>
        Search
      </button>
    </form>
  );
}

// ✅ GOOD: Build from reusable atoms
function Button({ children, ...props }) {
  return <button className="btn btn-primary" {...props}>{children}</button>;
}

function Input({ type = 'text', ...props }) {
  return <input className="input" type={type} {...props} />;
}

function SearchForm() {
  return (
    <form className="search-form">
      <Input type="search" placeholder="Search..." />
      <Button type="submit">Search</Button>
    </form>
  );
}
// Now Button and Input can be reused elsewhere
```
{% endraw %}

**Why it matters:** Without atoms, you'll duplicate code and have inconsistent styling across your app.

### 2. Confusing Molecules with Organisms
**Mistake:** Creating overly complex molecules or too-simple organisms.

```javascript
// ❌ BAD: Molecule doing too much (this is an organism)
function UserProfileMolecule({ user }) {
  return (
    <div className="user-profile">
      {/* Too complex for a molecule */}
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <ul>
        {user.posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <button>Follow</button>
      <button>Message</button>
    </div>
  );
}

// ✅ GOOD: Break into proper hierarchy

// Molecule: User Badge (simple, single purpose)
function UserBadge({ user }) {
  return (
    <div className="user-badge">
      <img src={user.avatar} alt="" className="avatar" />
      <span>{user.name}</span>
    </div>
  );
}

// Molecule: Post List Item
function PostListItem({ post }) {
  return (
    <li className="post-item">
      <a href={`/posts/${post.id}`}>{post.title}</a>
    </li>
  );
}

// Organism: User Profile Card (combines molecules)
function UserProfileCard({ user }) {
  return (
    <div className="user-profile-card">
      <UserBadge user={user} />
      <p className="user-bio">{user.bio}</p>
      
      <ul className="post-list">
        {user.posts.map(post => (
          <PostListItem key={post.id} post={post} />
        ))}
      </ul>
      
      <div className="actions">
        <Button>Follow</Button>
        <Button variant="secondary">Message</Button>
      </div>
    </div>
  );
}
```

**Why it matters:** Molecules should be simple and focused. Complex components should be organisms.

### 3. Creating Page-Specific Components Instead of Reusable Organisms
**Mistake:** Building components that only work on one page.

```javascript
// ❌ BAD: HomePage-specific component
function HomePageProductGrid({ products }) {
  return (
    <div className="homepage-product-grid">
      <h2>Featured on Homepage</h2>  {/* Hardcoded text */}
      <div className="grid-4-col">  {/* Hardcoded 4 columns */}
        {products.slice(0, 4).map(product => (  /* Hardcoded limit */
          <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <span>${product.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// Can only be used on homepage!

// ✅ GOOD: Reusable organism with props
function ProductGrid({ products, columns = 3, heading }) {
  return (
    <div className="product-grid">
      {heading && <h2 className="grid-heading">{heading}</h2>}
      <div className={`grid-${columns}-col`}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Now works on any page
function HomePage() {
  return <ProductGrid products={featured} columns={4} heading="Featured Products" />;
}

function CategoryPage() {
  return <ProductGrid products={allProducts} columns={3} heading="All Products" />;
}
```

**Why it matters:** Reusable organisms reduce code duplication and ensure consistency across pages.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What's the difference between a molecule and an organism?</summary>

**Answer:** **Molecules are simple, single-purpose combinations of atoms. Organisms are complex, standalone sections made of molecules and atoms.**

```javascript
// MOLECULE: Simple, single purpose
function SearchForm() {
  return (
    <form className="search-form">
      <Input type="search" placeholder="Search..." />  {/* Atom */}
      <Button type="submit">Search</Button>  {/* Atom */}
    </form>
  );
}
// Purpose: Search functionality
// Reusable: Can go in header, sidebar, etc.

// MOLECULE: Form Field
function FormField({ label, id, error, ...props }) {
  return (
    <div className="form-field">
      <Label htmlFor={id}>{label}</Label>  {/* Atom */}
      <Input id={id} {...props} />  {/* Atom */}
      {error && <span className="error">{error}</span>}  {/* Atom */}
    </div>
  );
}
// Purpose: Labeled input with error
// Reusable: Anywhere you need a form field

// ORGANISM: Site Header
function SiteHeader() {
  return (
    <header className="site-header">
      <Logo />  {/* Molecule */}
      <Navigation />  {/* Molecule */}
      <SearchForm />  {/* Molecule */}
      <UserMenu />  {/* Molecule */}
    </header>
  );
}
// Purpose: Complete header section
// Context: Page-level component
// Combines: Multiple molecules into cohesive section

// ORGANISM: Product Card
function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />  {/* Atom */}
      <h3>{product.name}</h3>  {/* Atom */}
      <p>{product.description}</p>  {/* Atom */}
      <PriceDisplay price={product.price} />  {/* Molecule */}
      <Button onClick={() => addToCart(product)}>Add to Cart</Button>  {/* Atom */}
    </article>
  );
}
// Purpose: Complete product representation
// Standalone: Works independently on page
```

**Rule of thumb:**
- **Molecule**: Combines 2-5 atoms for single purpose
- **Organism**: Combines molecules (and atoms) into standalone section

**Why it matters:** Clear hierarchy prevents creating god components and encourages reusability.
</details>

<details>
<summary><strong>Question 2:</strong> When should you create a new atom vs reusing an existing one?</summary>

**Answer:** **Create a new atom when functionality or semantics differ. Reuse with props when only styling differs.**

```javascript
// ❌ BAD: Creating new atom for every variant
function PrimaryButton({ children, ...props }) {
  return <button className="btn btn-primary" {...props}>{children}</button>;
}

function SecondaryButton({ children, ...props }) {
  return <button className="btn btn-secondary" {...props}>{children}</button>;
}

function DangerButton({ children, ...props }) {
  return <button className="btn btn-danger" {...props}>{children}</button>;
}
// 3 components with identical logic!

// ✅ GOOD: Single atom with variants
function Button({ variant = 'primary', size = 'md', children, ...props }) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} {...props}>
      {children}
    </button>
  );
}

// Usage:
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>


// ✅ GOOD: Separate atoms when semantics differ
function Button({ children, ...props }) {
  return <button className="btn" {...props}>{children}</button>;
}

function Link({ href, children, ...props }) {
  return <a href={href} className="link" {...props}>{children}</a>;
}

function IconButton({ icon, label, ...props }) {
  return (
    <button className="icon-btn" aria-label={label} {...props}>
      <Icon name={icon} />
    </button>
  );
}
// Different semantics: button vs link vs icon button


// ✅ GOOD: Separate atoms when functionality differs
function Input({ type = 'text', ...props }) {
  return <input type={type} className="input" {...props} />;
}

function TextArea({ rows = 4, ...props }) {
  return <textarea rows={rows} className="textarea" {...props} />;
}

function Select({ options, ...props }) {
  return (
    <select className="select" {...props}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
// Different HTML elements, different behavior
```

**Decision tree:**
1. **Same HTML element?** → Use variant prop
2. **Different HTML element but similar purpose?** → Separate atoms
3. **Completely different functionality?** → Separate atoms

**Why it matters:** Too many atoms create maintenance burden. Too few atoms create inflexible components.
</details>

<details>
<summary><strong>Question 3:</strong> What's the role of templates vs pages?</summary>

**Answer:** **Templates define content structure (placeholder content). Pages show real content (actual data).**

```javascript
// TEMPLATE: Defines structure, uses placeholder content
function BlogPostTemplate({ header, sidebar, content, footer }) {
  return (
    <div className="blog-post-template">
      {header}
      
      <div className="layout-2-col">
        <main className="main-content">
          {content}
        </main>
        
        <aside className="sidebar">
          {sidebar}
        </aside>
      </div>
      
      {footer}
    </div>
  );
}
// Template shows WHERE content goes, not WHAT content is


// PAGE: Real instance with actual content
function BlogPostPage({ post }) {
  return (
    <BlogPostTemplate
      header={<SiteHeader user={currentUser} />}
      
      content={
        <article>
          <h1>{post.title}</h1>
          <p className="meta">
            By {post.author} on {post.date}
          </p>
          <div className="post-body">
            {post.content}
          </div>
          <CommentList comments={post.comments} />
        </article>
      }
      
      sidebar={
        <>
          <AuthorBio author={post.author} />
          <RelatedPosts posts={relatedPosts} />
        </>
      }
      
      footer={<SiteFooter />}
    />
  );
}
// Page shows ACTUAL content: real post data, real author, real comments


// Why both?

// Template benefits:
// - Test layout with varying content lengths
// - Visualize structure without distraction
// - Reuse across multiple pages

// Example: Testing template with different content
<BlogPostTemplate
  content={
    <article>
      <h1>Short Title</h1>
      <p>Brief content...</p>
    </article>
  }
/>

<BlogPostTemplate
  content={
    <article>
      <h1>Very Long Title That Might Wrap to Multiple Lines in Mobile View</h1>
      <p>Extremely long content that tests how the layout handles lots of text...</p>
    </article>
  }
/>


// Page benefits:
// - Show stakeholders real design
// - Identify content issues (text too long, image missing, etc.)
// - Test with actual data edge cases

function HomePage() {
  const products = useProducts();  // Real data from API
  
  return (
    <HomepageTemplate
      hero={<Hero title="Spring Sale" subtitle="Up to 50% off" />}
      products={<ProductGrid products={products} />}
    />
  );
}
```

**Why it matters:** Templates ensure consistent structure. Pages reveal real-world content issues.
</details>

<details>
<summary><strong>Question 4:</strong> How do you handle shared styles across atoms?</summary>

**Answer:** **Use design tokens (sub-atomic values) and CSS custom properties or utility classes.**

```javascript
// ===== DESIGN TOKENS =====
// tokens.js
export const tokens = {
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
    danger: '#dc3545'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem'
  }
};

// ===== METHOD 1: CSS Custom Properties =====
// styles.css
:root {
  --color-primary: #0066cc;
  --color-secondary: #6c757d;
  --color-danger: #dc3545;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-family: var(--font-base);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

// Atoms use CSS custom properties
function Button({ variant, children }) {
  return <button className={`btn btn-${variant}`}>{children}</button>;
}


// ===== METHOD 2: CSS-in-JS with Tokens =====
import styled from 'styled-components';
import { tokens } from './tokens';

const StyledButton = styled.button`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.sm};
  background: ${props => tokens.colors[props.variant] || tokens.colors.primary};
  color: white;
`;

function Button({ variant = 'primary', children }) {
  return <StyledButton variant={variant}>{children}</StyledButton>;
}


// ===== METHOD 3: Utility Classes (Tailwind-style) =====
// Define utility classes based on tokens
.p-xs { padding: 0.25rem; }
.p-sm { padding: 0.5rem; }
.p-md { padding: 1rem; }

.bg-primary { background: #0066cc; }
.bg-secondary { background: #6c757d; }

.rounded-sm { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.5rem; }

// Atoms compose utility classes
function Button({ variant, children }) {
  return (
    <button className={`p-sm rounded-sm bg-${variant} text-white`}>
      {children}
    </button>
  );
}


// ===== METHOD 4: Style Props (Chakra UI-style) =====
function Button({ variant = 'primary', size = 'md', children }) {
  const styles = {
    padding: tokens.spacing[size],
    borderRadius: tokens.borderRadius.sm,
    background: tokens.colors[variant],
    color: 'white'
  };
  
  return <button style={styles}>{children}</button>;
}
```

**Why it matters:** Design tokens ensure consistency and make global changes easy (one place to update all primary colors).
</details>

<details>
<summary><strong>Question 5:</strong> How do atomic design and component libraries work together?</summary>

**Answer:** **Component libraries ARE atomic design systems. Atomic design provides the mental model for organizing the library.**

```
// Component Library Structure Following Atomic Design

my-design-system/
├── tokens/           # Sub-atomic (design tokens)
│   ├── colors.js
│   ├── spacing.js
│   └── typography.js
│
├── atoms/            # Foundational components
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.test.jsx
│   │   ├── Button.stories.jsx  # Storybook story
│   │   └── Button.module.css
│   ├── Input/
│   ├── Label/
│   └── Icon/
│
├── molecules/        # Simple combinations
│   ├── FormField/
│   │   ├── FormField.jsx
│   │   ├── FormField.test.jsx
│   │   └── FormField.stories.jsx
│   ├── SearchForm/
│   └── UserBadge/
│
├── organisms/        # Complex components
│   ├── SiteHeader/
│   ├── ProductCard/
│   └── CommentThread/
│
├── templates/        # Page layouts
│   ├── HomepageTemplate/
│   ├── DashboardTemplate/
│   └── BlogPostTemplate/
│
└── pages/           # Actual pages (usually in app, not library)
    ├── HomePage/
    └── ProductPage/
```

**Usage in application:**

```javascript
// Install design system
// npm install @company/design-system

// Use in your app
import {
  Button,        // Atom
  Input,         // Atom
  FormField,     // Molecule
  SearchForm,    // Molecule
  SiteHeader,    // Organism
  ProductCard    // Organism
} from '@company/design-system';

function MyApp() {
  return (
    <div>
      <SiteHeader />
      <main>
        <SearchForm onSearch={handleSearch} />
        <ProductCard product={product} />
      </main>
    </div>
  );
}
```

**Benefits:**
- **Consistency**: All apps use same components
- **Efficiency**: Don't rebuild common components
- **Maintenance**: Update library once, affects all apps
- **Documentation**: Storybook shows all components
- **Testing**: Components tested in library

**Why it matters:** Atomic design provides the framework for building and organizing reusable component libraries.
</details>

## References

- [1] https://atomicdesign.bradfrost.com/chapter-2/
