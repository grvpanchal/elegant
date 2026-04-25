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

### Basic Example: TodoList organism across frameworks

A real organism pulled from the `chota-*` templates: `TodoList` assembles an `Alert` atom, an `AddTodoForm` molecule, `TodoItems` molecule and a `Skeleton` atom into a full "todo page body" region. It takes the entire slice of todo state as a prop plus an `events` bag of callbacks — it doesn't know or care that the state comes from Redux / NgRx / Pinia behind it.

{::nomarkdown}<div class="code-tabs">{:/}

React
{% raw %}
```jsx
// templates/chota-react-redux/src/ui/organisms/TodoList/TodoList.component.jsx
import Alert from "../../atoms/Alert/Alert.component";
import AddTodoForm from "../../molecules/AddTodoForm/AddTodoForm.component";
import TodoItems from "../../molecules/TodoItems/TodoItems.component";
import Skeleton from "../../skeletons/Skeleton/Skeleton.component";

export default function TodoList({ todoData, events }) {
  const { onTodoCreate, onTodoEdit, onTodoUpdate, onTodoToggleUpdate, onTodoDelete } = events;
  return (
    <>
      {todoData.error ? (
        <Alert variant="error" show={!!todoData.error} message={todoData.error} />
      ) : null}
      <AddTodoForm
        todoValue={todoData.currentTodoItem.text || ""}
        onTodoAdd={onTodoCreate}
        onTodoUpdate={onTodoUpdate}
        placeholder="Add your task"
        isLoading={todoData.isActionLoading}
        buttonInfo={{
          label: todoData.currentTodoItem.text ? "Save" : "Add",
          variant: "primary",
        }}
      />
      {todoData.isContentLoading ? (
        <>
          <Skeleton height="24px" />
          <Skeleton height="24px" />
          <Skeleton height="24px" />
        </>
      ) : (
        <TodoItems
          todos={todoData.todoItems || []}
          isDisabled={todoData.isActionLoading}
          onToggleClick={onTodoToggleUpdate}
          onDeleteClick={onTodoDelete}
          onEditClick={onTodoEdit}
        />
      )}
    </>
  );
}
```
{% endraw %}

Angular
```ts
// templates/chota-angular-ngrx/src/ui/organisms/TodoList/TodoList.component.ts
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [AlertComponent, AddTodoFormComponent, TodoItemsComponent, SkeletonComponent],
  templateUrl: './TodoList.component.html',
  styleUrls: ['./TodoList.style.css'],
})
export default class TodoListComponent {
  @Input() todoData: TodoState = { /* initial defaults */ };
  @Input() events = {
    onTodoCreate: (text: string) => {},
    onTodoEdit: (todo: any) => {},
    onTodoUpdate: (text: string) => {},
    onTodoToggleUpdate: (todo: any) => {},
    onTodoDelete: (id: number) => {},
  };
  get buttonInfo() {
    return {
      label: this.todoData.currentTodoItem.text ? 'Save' : 'Add',
      variant: 'primary',
    };
  }
}
```

```html
<!-- TodoList.component.html -->
@if (todoData.error) {
  <app-alert variant="error" [show]="!!todoData.error" [message]="todoData.error"></app-alert>
}
<app-add-todo-form
  [todoValue]="todoData.currentTodoItem.text || ''"
  (onTodoAdd)="events.onTodoCreate($event)"
  (onTodoUpdate)="events.onTodoUpdate($event)"
  placeholder="Add your task"
  [isLoading]="todoData.isActionLoading"
  [buttonInfo]="buttonInfo"
></app-add-todo-form>
@if (todoData.isContentLoading) {
  <app-skeleton height="24px"></app-skeleton>
  <app-skeleton height="24px"></app-skeleton>
  <app-skeleton height="24px"></app-skeleton>
} @else {
  <app-todo-items
    [todos]="todoData.todoItems"
    [isDisabled]="todoData.isActionLoading"
    (onToggleClick)="events.onTodoToggleUpdate($event)"
    (onDeleteClick)="events.onTodoDelete($event)"
    (onEditClick)="events.onTodoEdit($event)"
  ></app-todo-items>
}
```

Vue
```vue
<!-- templates/chota-vue-pinia/src/ui/organisms/TodoList/TodoList.component.vue -->
<template>
  <div>
    <Alert v-if="todoData.error" variant="error" :show="!!todoData.error" :message="todoData.error" />
    <AddTodoForm
      :todoValue="todoData.currentTodoItem.text || ''"
      @onTodoAdd="events.onTodoCreate"
      @onTodoUpdate="events.onTodoUpdate"
      placeholder="Add your task"
      :isLoading="todoData.isActionLoading"
      :buttonInfo="getButtonInfo()"
    />
    <template v-if="todoData.isContentLoading">
      <Skeleton height="24px" />
      <Skeleton height="24px" />
      <Skeleton height="24px" />
    </template>
    <template v-else>
      <TodoItems
        :todos="todoData.todoItems || []"
        :isDisabled="todoData.isActionLoading"
        @onToggleClick="events.onTodoToggleUpdate"
        @onDeleteClick="events.onTodoDelete"
        @onEditClick="events.onTodoEdit"
      />
    </template>
  </div>
</template>
```

Web Components
{% raw %}
```js
// templates/chota-wc-saga/src/ui/organisms/TodoList/TodoList.component.js
import { html } from "lit";
import "../../atoms/Alert/app-alert";
import "../../molecules/AddTodoForm/app-add-todo-form";
import "../../molecules/TodoItems/app-todo-items";
import "../../skeletons/Skeleton/app-skeleton";

export default function TodoList({ todoData, events }) {
  const { onTodoCreate, onTodoEdit, onTodoUpdate, onTodoToggleUpdate, onTodoDelete } = events;
  return html`
    ${todoData.error ? html`
      <app-alert .variant=${"error"} .show=${!!todoData.error} .message=${todoData.error}></app-alert>
    ` : null}
    <app-add-todo-form
      .todoValue=${todoData.currentTodoItem.text || ""}
      @onTodoAdd=${onTodoCreate}
      @onTodoUpdate=${onTodoUpdate}
      .placeholder=${"Add your task"}
      .isLoading=${todoData.isActionLoading}
      .buttonInfo=${{
        label: todoData.currentTodoItem.text ? "Save" : "Add",
        variant: "primary",
      }}
    ></app-add-todo-form>
    ${todoData.isContentLoading ? html`
      <app-skeleton height="24px"></app-skeleton>
      <app-skeleton height="24px"></app-skeleton>
      <app-skeleton height="24px"></app-skeleton>
    ` : html`
      <app-todo-items
        .todos=${todoData.todoItems || []}
        .isDisabled=${todoData.isActionLoading}
        @onToggleClick=${onTodoToggleUpdate}
        @onDeleteClick=${onTodoDelete}
        @onEditClick=${onTodoEdit}
      ></app-todo-items>
    `}
  `;
}
```
{% endraw %}

{::nomarkdown}</div>{:/}

The organism's *interface* — `{ todoData, events }` — is identical in all four tabs. Containers in each template subscribe to their respective store (Redux store / NgRx selectors / Pinia store / saga-backed store) and fan the same prop shape into this component, so the organism itself is store-agnostic and framework-portable in its *shape*.

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

{% include quiz.html id="organism-1"
   question="What distinguishes an organism from a molecule in Atomic Design?"
   options="A|There is no difference;;B|Organisms are complex, self-contained UI sections composed of multiple molecules (and atoms) that represent a meaningful region — header, product card, comment thread — whereas molecules are smaller single-purpose compositions;;C|Organisms must use TypeScript;;D|Organisms render on the server"
   correct="B"
   explanation="If a component is orchestrating several molecules to form a distinct region of the page, it has graduated to organism level." %}

{% include quiz.html id="organism-2"
   question="Should organisms contain business logic and data fetching, or stay purely presentational?"
   options="A|They should fetch data directly for convenience;;B|Organisms must be stateless;;C|They replace Redux;;D|Organisms can own UI-level state (dropdown open/closed, filter selection) but business logic, data fetching, and global state mutations belong in containers — the container wires a fetched data shape into the organism via props"
   correct="D"
   explanation="Keeping organisms presentational makes them reusable across pages and testable in Storybook. The container/organism split is how large apps scale." %}

{% include quiz.html id="organism-3"
   question="When should you create a new organism rather than extending an existing one?"
   options="A|When the purpose of the UI section is meaningfully different from any existing organism, when reuse of the current organism would require many conditional props/branches, or when the responsibilities differ;;B|Never — always extend;;C|Every time a designer changes a color;;D|When you run out of file names"
   correct="A"
   explanation="Forking into a new organism beats piling variant props onto the old one past the point where the code reads as &quot;two different things pretending to be one.&quot;" %}

{% include quiz.html id="organism-4"
   question="How should organisms handle responsive design compared to molecules?"
   options="A|They shouldn't — responsive only belongs at the page level;;B|Organisms often coordinate layout across multiple molecules, so they're a natural place for container queries / breakpoint-driven layout changes; molecules typically only need to handle their own internal responsive behavior;;C|Only atoms handle responsive;;D|Responsive design is legacy"
   correct="B"
   explanation="Molecules worry about their internal flex/grid. Organisms decide when the whole region rearranges (side-by-side vs stacked, nav collapsing to hamburger)." %}

{% include quiz.html id="organism-5"
   question="What is the typical relationship between organisms and state management (Redux, Context, etc.)?"
   options="A|Organisms stay pure and receive what they need via props; a surrounding container subscribes to the store, derives data with selectors, and passes it down — keeping the organism decoupled from the specific store tech;;B|State managers were deprecated;;C|Organisms must import the Redux store directly;;D|Organisms are the only layer allowed to subscribe to the store"
   correct="A"
   explanation="Subscribing inside organisms ties their reuse to one specific app. Pushing subscriptions up to a container lets the same organism live in Storybook, tests, or a different app without rewiring." %}

## References

- [1] https://atomicdesign.bradfrost.com/chapter-2/