---
title: Organism
layout: doc
slug: organism
---

# Organism

> - UI connector to state
> - Deliver UX scaffolding to UI
> - Complex, self-contained UI sections composed of molecules and atoms

## Key Insight

Organisms are where your UI becomes truly functional—they're complex components that combine molecules and atoms into cohesive interface sections like headers, product grids, or comment systems. Unlike simpler molecules, organisms often connect to application state, handle business logic, and represent distinct features users recognize ("the navigation bar," "the product listing"). They're the bridge between presentational atomic components and full page layouts, making them reusable across different templates while maintaining their own identity and purpose.

## Detailed Description

In the Atomic Design hierarchy, organisms represent a significant step up in complexity from molecules. While molecules are simple combinations of atoms with a focused purpose (like a search bar), organisms are larger, more complex assemblies that often represent entire sections of an interface. A header organism might contain a logo molecule, navigation molecule, search bar molecule, and user profile menu molecule—all working together as a cohesive unit.

The defining characteristic of organisms is their **contextual wholeness**. They're complex enough to serve as standalone interface sections that users mentally recognize as distinct features. When you think "navigation bar" or "product grid" or "comment section," you're thinking of organisms. They have clear boundaries and can be moved between different pages or contexts while maintaining their identity and functionality.

In the Universal Frontend Architecture, organisms often serve as the boundary where **presentational components** (atoms and molecules) meet **container logic**. While atoms and molecules should be pure and presentational, organisms frequently connect to state management, make API calls, or contain business logic. A ProductCard molecule displays product data it receives via props, but a ProductGrid organism might fetch that data, handle pagination, manage filters, and compose multiple ProductCard molecules.

This makes organisms the perfect level for **feature encapsulation**. A CommentSection organism encapsulates all the complexity of displaying comments, handling replies, pagination, and submission—exposing a simple interface to parent components while managing considerable internal complexity. This encapsulation makes organisms highly reusable: drop the same CommentSection organism into blog posts, product pages, or forum threads.

Organisms also represent the level where **responsive design** often becomes explicit. A Header organism might rearrange its child molecules differently on mobile (hamburger menu) vs desktop (horizontal navigation), while the molecules themselves remain unchanged. This separation of concerns—molecules define what elements exist, organisms define how they're arranged—creates flexible, maintainable responsive interfaces.

From a development workflow perspective, organisms are often the components that product teams discuss and reference by name. "The header needs a new search feature" or "the product grid should show more items" are organism-level conversations. This makes organisms natural boundaries for component ownership, testing strategies, and feature development.

## Code Examples

### Basic Example: Header Organism

Here is an example of an organism called `Header` that combines multiple molecules and atoms. The `Header` organism might consist of a `Logo` molecule, a `Navigation` molecule, and a `Button` atom for a user profile:

```jsx
// Header.js

import React from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import Button from "./Button";

const Header = () => {
  return (
    <header>
      <Logo />
      <Navigation />
      <Button label="Profile" />
    </header>
  );
};

export default Header;
```

In this example:

- The `Header` organism is composed of the `Logo` molecule, `Navigation` molecule, and a `Button` atom for the user's profile.
- Each of these components (`Logo`, `Navigation`, and `Button`) can be considered atoms or molecules on their own.

Now, let's create the `Logo` and `Navigation` components:

```jsx
// Logo.js

import React from "react";

const Logo = () => {
  return <div className="logo">My Logo</div>;
};

export default Logo;
```

```jsx
// Navigation.js

import React from "react";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
};

export default Navigation;
```

In this setup, the `Logo` and `Navigation` components can be considered molecules, as they are composed of simpler atoms (e.g., a `div` for the logo and a list for navigation items).

We can then use the Header organism in your application:

```jsx
// App.js

import React from "react";
import Header from "./Header";

const App = () => {
  return (
    <div>
      <Header />
      {/* Other content goes here */}
    </div>
  );
};

export default App;
```

This illustrates how organisms in Atomic Design are composed of molecules and atoms to create larger and more complex components. The `Header` organism, in this case, represents a common structure that might appear at the top of many pages in our application.

### Practical Example: Product Grid with State Management

Organism connecting to state and handling complex logic:

```jsx
// ProductGrid.jsx - Organism with state management

import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../molecules/ProductCard';
import FilterBar from '../molecules/FilterBar';
import Pagination from '../molecules/Pagination';
import LoadingSpinner from '../atoms/LoadingSpinner';
import './ProductGrid.css';

const ProductGrid = ({ category }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    sortBy: 'popular',
    inStock: true
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Organism connects to data layer
  const { products, loading, error, totalCount } = useProducts({
    category,
    ...filters,
    page: currentPage,
    limit: itemsPerPage
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (loading) {
    return (
      <div className="product-grid product-grid--loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid product-grid--error">
        <p>Failed to load products. Please try again.</p>
      </div>
    );
  }

  return (
    <section className="product-grid">
      {/* Molecule for filtering */}
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        resultCount={totalCount}
      />

      {/* Grid of product molecules */}
      <div className="product-grid__items">
        {products.length === 0 ? (
          <p className="product-grid__empty">No products found.</p>
        ) : (
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(id) => console.log('Add to cart:', id)}
              onQuickView={(id) => console.log('Quick view:', id)}
            />
          ))
        )}
      </div>

      {/* Molecule for pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

export default ProductGrid;
```

CSS for responsive layout:

```css
/* ProductGrid.css */
.product-grid {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-lg);
}

.product-grid__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
  margin: var(--space-xl) 0;
}

/* Responsive adjustments at organism level */
@media (max-width: 768px) {
  .product-grid__items {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-md);
  }
}

@media (max-width: 480px) {
  .product-grid__items {
    grid-template-columns: 1fr; /* Single column on mobile */
  }
}
```

### Advanced Example: Comment Section with Nested Structure

Complex organism with nested components and interactions:

```jsx
// CommentSection.jsx - Advanced organism

import React, { useState } from 'react';
import { useComments } from '../hooks/useComments';
import CommentForm from '../molecules/CommentForm';
import CommentThread from '../molecules/CommentThread';
import Button from '../atoms/Button';
import Avatar from '../atoms/Avatar';
import './CommentSection.css';

const CommentSection = ({ postId, currentUser }) => {
  const { 
    comments, 
    loading, 
    addComment, 
    replyToComment, 
    deleteComment,
    likeComment 
  } = useComments(postId);
  
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (content) => {
    await addComment({ postId, content, userId: currentUser.id });
    setShowForm(false);
  };

  const handleReply = async (parentId, content) => {
    await replyToComment({ parentId, content, userId: currentUser.id });
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'popular') return b.likes - a.likes;
    return 0;
  });

  // Organize into threads (top-level + replies)
  const threads = sortedComments.filter(c => !c.parentId);

  return (
    <section className="comment-section">
      <header className="comment-section__header">
        <h2 className="comment-section__title">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h2>
        
        <div className="comment-section__controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="comment-section__sort"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </header>

      {/* Add comment form */}
      {currentUser && (
        <div className="comment-section__add">
          {!showForm ? (
            <button 
              onClick={() => setShowForm(true)}
              className="comment-section__add-trigger"
            >
              <Avatar 
                src={currentUser.avatar} 
                name={currentUser.name} 
                size="small" 
              />
              <span>Add a comment...</span>
            </button>
          ) : (
            <CommentForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              placeholder="Share your thoughts..."
              currentUser={currentUser}
            />
          )}
        </div>
      )}

      {/* Comment threads */}
      {loading ? (
        <div className="comment-section__loading">Loading comments...</div>
      ) : (
        <div className="comment-section__threads">
          {threads.map(comment => (
            <CommentThread
              key={comment.id}
              comment={comment}
              replies={comments.filter(c => c.parentId === comment.id)}
              onReply={handleReply}
              onDelete={deleteComment}
              onLike={likeComment}
              currentUser={currentUser}
            />
          ))}
          
          {threads.length === 0 && (
            <p className="comment-section__empty">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
```

Usage in different contexts:

{% raw %}
```jsx
// BlogPost.jsx
import CommentSection from '../organisms/CommentSection';

const BlogPost = ({ post, user }) => (
  <article>
    <h1>{post.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: post.content }} />
    
    {/* Same organism works in blog context */}
    <CommentSection postId={post.id} currentUser={user} />
  </article>
);

// ProductPage.jsx  
const ProductPage = ({ product, user }) => (
  <div>
    <ProductDetails product={product} />
    
    {/* Same organism works for product reviews */}
    <CommentSection postId={`product-${product.id}`} currentUser={user} />
  </div>
);
```
{% endraw %}

## Common Mistakes

### 1. Making Organisms Too Large or Too Small
**Mistake:** Unclear boundaries between organisms and templates/molecules.

```jsx
// ❌ BAD: Organism too large (should be template)
const EntireProductPage = () => (
  <div>
    <Header />           {/* Organism */}
    <Breadcrumbs />      {/* Molecule */}
    <ProductDetails />   {/* Organism */}
    <RelatedProducts />  {/* Organism */}
    <ReviewSection />    {/* Organism */}
    <Footer />           {/* Organism */}
  </div>
);
// This is actually a page template, not an organism

// ❌ BAD: Organism too small (should be molecule)
const SearchIcon = () => (
  <div className="search-icon">
    <Icon name="search" />
  </div>
);
// This is just a wrapped atom, should be molecule or just use Icon atom
```

```jsx
// ✅ GOOD: Right-sized organisms
const Header = () => (
  <header className="site-header">
    <Logo />
    <MainNavigation />
    <SearchBar />
    <UserMenu />
  </header>
);
// Clear purpose: site header with distinct molecules

const ProductGrid = ({ category }) => (
  <section>
    <FilterBar />
    <div className="grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
    <Pagination />
  </section>
);
// Clear purpose: filterable product display
```

**Why it matters:** Organisms should represent recognizable interface sections. Too large and they become inflexible templates; too small and they're just molecules. The right size is "a feature users would name."

### 2. Not Handling State at the Right Level
**Mistake:** Pushing state management to atoms/molecules or pulling it up to templates.

```jsx
// ❌ BAD: State in molecule (should be in organism)
const ProductCard = ({ product }) => {
  const [inCart, setInCart] = useState(false);
  
  const addToCart = () => {
    fetch('/api/cart', { /* ... */ });  // API call in molecule!
    setInCart(true);
  };
  
  return <div>...</div>;
};
// Molecules should be presentational

// ❌ BAD: All state in template (organism should manage its own)
const ProductPageTemplate = () => {
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);
  // Too much state for template to manage
  
  return (
    <ProductGrid filters={filters} products={products} />
  );
};
```

```jsx
// ✅ GOOD: State at organism level
const ProductGrid = ({ category, onAddToCart }) => {
  // Organism manages its own state
  const [filters, setFilters] = useState({});
  const { products, loading } = useProducts({ category, ...filters });
  
  return (
    <section>
      <FilterBar filters={filters} onChange={setFilters} />
      <div className="grid">
        {products.map(p => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onAddToCart={onAddToCart}  // Callback to parent
          />
        ))}
      </div>
    </section>
  );
};

// Molecule stays presentational
const ProductCard = ({ product, onAddToCart }) => (
  <div className="product-card">
    <h3>{product.name}</h3>
    <Button onClick={() => onAddToCart(product.id)}>Add to Cart</Button>
  </div>
);
```

**Why it matters:** Organisms are the natural boundary for feature-level state. Molecules with state become less reusable; templates with too much state become unwieldy. See [State](../state/state.html) for state management patterns.

### 3. Creating Non-Reusable Organisms
**Mistake:** Hardcoding values or tightly coupling to specific contexts.

```jsx
// ❌ BAD: Hardcoded, page-specific
const ProductPageHeader = () => (
  <header>
    <Logo />
    <nav>
      <a href="/products">Products</a>  {/* Hardcoded */}
      <a href="/about">About</a>
    </nav>
  </header>
);
// Only works on product pages, not reusable

// ❌ BAD: Tightly coupled to specific data shape
const UserDashboard = () => {
  const user = useContext(UserContext);  // Specific context
  
  return (
    <div>
      <h1>Welcome, {user.profile.firstName}</h1>  {/* Assumes exact shape */}
      {/* ... */}
    </div>
  );
};
```

```jsx
// ✅ GOOD: Flexible, prop-driven organisms
const SiteHeader = ({ logo, navigation, actions }) => (
  <header className="site-header">
    {logo}
    <nav>{navigation}</nav>
    <div className="header-actions">{actions}</div>
  </header>
);

// Used in different contexts
<SiteHeader 
  logo={<Logo />}
  navigation={<MainNav items={productNavItems} />}
  actions={<UserMenu user={user} />}
/>

<SiteHeader 
  logo={<Logo variant="dark" />}
  navigation={<AdminNav items={adminNavItems} />}
  actions={<NotificationBell />}
/>
```

```jsx
// ✅ GOOD: Generic, composable organisms
const DashboardPanel = ({ title, subtitle, actions, children }) => (
  <section className="dashboard-panel">
    <header className="dashboard-panel__header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="dashboard-panel__actions">{actions}</div>
    </header>
    <div className="dashboard-panel__content">
      {children}
    </div>
  </section>
);

// Reusable across different dashboard types
<DashboardPanel title="Sales" actions={<RefreshButton />}>
  <SalesChart data={salesData} />
</DashboardPanel>

<DashboardPanel title="Users" actions={<ExportButton />}>
  <UserTable users={users} />
</DashboardPanel>
```

**Why it matters:** Good organisms work in multiple contexts. Hardcoding or tight coupling destroys reusability, leading to organism proliferation and maintenance burden.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What distinguishes an organism from a molecule in Atomic Design?</summary>

**Answer:**

**Molecules:**
- **Simple, focused combinations** of atoms with single purpose
- **Presentational** - accept props, render output, no business logic
- **Small scope** - SearchBar (Input + Button), FormField (Label + Input + Error)
- **Don't connect to state** - data passed via props only

**Organisms:**
- **Complex assemblies** of molecules/atoms representing interface sections
- **Feature-level** - often contain state, logic, data fetching
- **Larger scope** - Header (Logo + Nav + Search + UserMenu), ProductGrid (Filters + Cards + Pagination)
- **Can connect to state** - Redux, Context, API calls
- **Users recognize them** - "the navigation", "the product listing"

**Key difference:** Complexity and purpose. Molecule = simple building block. Organism = recognizable feature section.

**Example:**
- SearchBar molecule: Input + Button (no state, just composition)
- ProductGrid organism: FilterBar + ProductCards + Pagination + state management + API calls

**When to choose:** If it's a simple reusable combo → molecule. If it's a complete feature section → organism.
</details>

<details>
<summary><strong>Question 2:</strong> Should organisms contain business logic and state, or should they be purely presentational?</summary>

**Answer:** **Organisms CAN and often SHOULD contain business logic and state**, unlike atoms and molecules which should remain presentational.

**Why organisms handle logic:**
- They represent **feature boundaries** where logic naturally lives
- They're **self-contained** - encapsulate all behavior for that feature
- They're the **bridge** between presentational components and application state

**What organisms can contain:**
```jsx
const ProductGrid = () => {
  // ✅ Local state
  const [filters, setFilters] = useState({});
  
  // ✅ Data fetching
  const { products } = useProducts(filters);
  
  // ✅ Business logic
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    trackEvent('filter_applied', newFilters);
  };
  
  // ✅ Side effects
  useEffect(() => {
    saveFiltersToURL(filters);
  }, [filters]);
  
  return (/* compose molecules */);
};
```

**Pattern: Container/Presentational split:**
```jsx
// Organism with logic (container)
const UserListOrganism = () => {
  const { users, loading } = useUsers();
  const [sortBy, setSortBy] = useState('name');
  
  const sortedUsers = useMemo(
    () => sortUsers(users, sortBy),
    [users, sortBy]
  );
  
  return (
    <UserListPresentation 
      users={sortedUsers}
      loading={loading}
      sortBy={sortBy}
      onSortChange={setSortBy}
    />
  );
};

// Presentational molecule
const UserListPresentation = ({ users, loading, sortBy, onSortChange }) => (
  <div>
    <SortControls value={sortBy} onChange={onSortChange} />
    {loading ? <Spinner /> : users.map(u => <UserCard user={u} />)}
  </div>
);
```

**Rule of thumb:** Atoms/molecules = presentational. Organisms = can have logic. Templates/pages = composition + routing.
</details>

<details>
<summary><strong>Question 3:</strong> How do you decide when to create a new organism vs using existing ones?</summary>

**Answer:** Create a new organism when:

**1. It represents a distinct feature:**
```jsx
// ✅ Create new organism - distinct features
<Header />           // Site navigation
<ProductGrid />      // Product browsing
<CommentSection />   // User discussions
<CheckoutForm />     // Purchase flow
```

**2. It's reused across multiple templates:**
```jsx
// ✅ Create organism - used on 5+ pages
<ArticleCard />  // Used in: home, category, search, profile, archive
```

**3. It has complex internal state/logic:**
```jsx
// ✅ Create organism - manages pagination, filtering, sorting
const DataTable = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('date');
  // Complex internal logic
};
```

**Don't create new organism when:**

**1. It's a one-off composition:**
```jsx
// ❌ Don't create organism - just compose inline
<section>
  <Heading>About Us</Heading>
  <Paragraph>...</Paragraph>
  <Image src="..." />
</section>
// Not worth extracting unless reused
```

**2. It's simple composition of atoms:**
```jsx
// ❌ This should be a molecule, not organism
const IconButton = () => (
  <Button>
    <Icon name="plus" />
  </Button>
);
```

**3. Existing organism can be configured:**
```jsx
// ✅ Use existing with props instead of new organism
<Card 
  variant="product"
  showActions
  layout="horizontal"
/>
// vs creating ProductCard, ArticleCard, UserCard organisms
```

**Best practice:** Start with composition. Extract to organism when you need it in 3+ places or it becomes complex.
</details>

<details>
<summary><strong>Question 4:</strong> How should organisms handle responsive design differently than molecules?</summary>

**Answer:** Organisms handle **layout-level responsiveness** while molecules handle **component-level responsiveness**.

**Molecules - component responsiveness:**
```css
/* SearchBar molecule adjusts its own internals */
.search-bar {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 480px) {
  .search-bar {
    flex-direction: column;  /* Stack vertically on mobile */
  }
}
```

**Organisms - layout responsiveness:**
```css
/* Header organism rearranges molecules */
.header {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-template-areas: "logo nav search user";
}

@media (max-width: 768px) {
  .header {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 
      "logo user menu"
      "search search search";  /* Different layout */
  }
  
  .header__nav {
    display: none;  /* Hide desktop nav */
  }
  
  .header__mobile-menu {
    display: block;  /* Show mobile menu */
  }
}
```

**Organism shows/hides different molecules:**
```jsx
const Header = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <header>
      <Logo />
      
      {/* Organism decides which molecules to render */}
      {isMobile ? (
        <MobileMenu />  {/* Different molecule for mobile */}
      ) : (
        <DesktopNavigation />  {/* Different molecule for desktop */}
      )}
      
      <SearchBar />  {/* Same molecule, different position */}
    </header>
  );
};
```

**Organism changes molecule arrangement:**
```jsx
const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {/* CSS Grid at organism level */}
      <style jsx>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
        
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr;  /* Organism controls layout */
          }
        }
      `}</style>
      
      {/* Molecules remain unchanged */}
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};
```

**Summary:**
- **Molecules:** Adjust their own spacing, font sizes, internal layout
- **Organisms:** Rearrange molecules, show/hide components, change grid layouts

**Why it matters:** This separation allows molecules to be reusable (they don't know about page layout) while organisms orchestrate responsive experiences.
</details>

<details>
<summary><strong>Question 5:</strong> What's the relationship between organisms and state management patterns like Redux or Context?</summary>

**Answer:** Organisms are the **primary connection point** between presentational components and global state.

**Pattern 1: Organisms as containers (Redux):**
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const ProductGrid = ({ category }) => {
  const dispatch = useDispatch();
  
  // Organism connects to Redux
  const products = useSelector(state => 
    selectProductsByCategory(state, category)
  );
  const cartItems = useSelector(state => state.cart.items);
  
  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId));  // Organism dispatches actions
  };
  
  // Compose presentational molecules
  return (
    <div className="grid">
      {products.map(p => (
        <ProductCard  // Molecule stays pure
          key={p.id}
          product={p}
          inCart={cartItems.includes(p.id)}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};
```

**Pattern 2: Organisms providing context:**
{% raw %}
```jsx
import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

// Organism provides context to its children
const ProductGrid = ({ category }) => {
  const [filters, setFilters] = useState({});
  
  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <section>
        <FilterBar />  {/* Consumes context */}
        <ProductList />  {/* Consumes context */}
      </section>
    </FilterContext.Provider>
  );
};

// Child molecules consume context
const FilterBar = () => {
  const { filters, setFilters } = useContext(FilterContext);
  return (/* ... */);
};
```
{% endraw %}

**Pattern 3: Organism with custom hooks:**
```jsx
// Organism uses custom hook that encapsulates state logic
const CommentSection = ({ postId }) => {
  const {
    comments,
    addComment,
    deleteComment,
    loading
  } = useComments(postId);  // Hook handles state/API
  
  // Organism focuses on composition
  return (
    <section>
      <CommentForm onSubmit={addComment} />
      <CommentList comments={comments} onDelete={deleteComment} />
    </section>
  );
};
```

**Best practices:**

1. **Organisms connect to state, molecules don't:**
   - ✅ Organism: `useSelector`, `useContext`, `useQuery`
   - ❌ Molecule: Pure props in, render out

2. **Keep state logic in hooks, not organism:**
   ```jsx
   // ✅ GOOD
   const ProductGrid = () => {
     const { products, addToCart } = useProducts();  // Logic in hook
     return <ProductList products={products} onAdd={addToCart} />;
   };
   
   // ❌ BAD
   const ProductGrid = () => {
     const [products, setProducts] = useState([]);
     useEffect(() => {
       fetch('/api/products').then(/* ... */);  // Logic in organism
     }, []);
   };
   ```

3. **Organisms as state boundaries:**
   - Don't pass Redux/Context through multiple organism levels
   - Each organism connects to what it needs
   - Prevents tight coupling

**Why it matters:** This pattern keeps molecules reusable and testable while letting organisms orchestrate application features with real data. See [Store](../state/store.html) for state patterns.
</details>

## References

- [1] https://atomicdesign.bradfrost.com/chapter-2/