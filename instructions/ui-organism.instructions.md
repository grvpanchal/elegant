---
description: Guidance for Organisms - complex UI sections that can connect to state
name: Organism - UI
applyTo: |
  **/ui/organisms/**/*.{jsx,tsx,vue,js,ts}
  **/components/organisms/**/*
  **/organisms/**/*
---

# Organism Instructions

## What is an Organism?

Organisms are complex, self-contained UI sections composed of molecules and atoms—headers, product grids, comment sections. They often connect to state, handle business logic, and represent features users recognize by name.

## Key Principles

1. **Feature Encapsulation**: Organisms encapsulate entire features (ProductGrid, CommentSection, NavigationBar). They're the boundary between presentational and container logic.

2. **State Connection Point**: Organisms are where you connect to stores, make API calls, and handle business logic. Keep atoms/molecules pure.

3. **Responsive Orchestration**: Organisms handle responsive layout changes (mobile hamburger vs desktop nav) while child components remain unchanged.

## Best Practices

✅ **DO**:
- Connect to state management (Redux, Vuex, Pinia)
- Handle data fetching and loading states
- Compose molecules and atoms for complex UI
- Implement feature-specific business logic
- Define responsive breakpoint behaviors
- Handle error states and edge cases

❌ **DON'T**:
- Put layout concerns here (that's templates)
- Make organisms too large—split into sub-organisms
- Duplicate logic across similar organisms
- Mix multiple unrelated features in one organism
- Ignore loading/error/empty states

## Code Patterns

### Recommended

```jsx
// ProductGrid.jsx - Organism with state connection
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../molecules/ProductCard';
import FilterBar from '../molecules/FilterBar';
import LoadingSpinner from '../atoms/LoadingSpinner';

const ProductGrid = ({ category }) => {
  const [filters, setFilters] = useState({ sortBy: 'popular' });
  const { products, loading, error } = useProducts({ category, ...filters });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!products.length) return <EmptyState />;

  return (
    <section className="product-grid">
      <FilterBar filters={filters} onChange={setFilters} />
      <div className="product-grid__items">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
```

### Avoid

```jsx
// ❌ WRONG - Organism with no state handling
const ProductGrid = ({ products }) => (
  <div>{products.map(p => <ProductCard product={p} />)}</div>
);
// This is a molecule, not an organism!

// ✅ CORRECT - Organism handles its own data
const ProductGrid = ({ categoryId }) => {
  const { products, loading } = useProducts(categoryId);
  // Full feature encapsulation
};
```

## Related Terminologies

- **Molecule** (UI) - Simpler components organisms compose
- **Template** (UI) - Page layouts that arrange organisms
- **Container** (Server) - Similar concept for data connection
- **Store** (State) - Where organisms get their data

## Quality Gates

- [ ] Represents a recognizable feature
- [ ] Handles loading, error, empty states
- [ ] Connects to state management appropriately
- [ ] Composes molecules/atoms (doesn't recreate)
- [ ] Responsive behavior defined
- [ ] Single feature focus

**Source**: `/docs/ui/organism.md`
