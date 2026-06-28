---
name: ui-organism
description: Atomic-design guidance for Organisms — complex feature-level sections (Header, ProductGrid, CommentSection) that compose molecules, render loading/error/empty states from props, and own responsive layout decisions. Organisms stay presentational; a Container connects them to state and passes data/events down. Use when authoring components under ui/organisms or deciding molecule vs organism boundaries.
when_to_use: Creating or reviewing organism-level components; keeping organisms presentational (data and event callbacks arrive as props from a Container, not from store hooks inside the organism); keeping loading/error/empty rendering at this layer (not in molecules); defining responsive breakpoint behaviour per feature.
paths:
  - "**/ui/organisms/**/*.{jsx,tsx,vue,js,ts}"
  - "**/components/organisms/**/*"
  - "**/organisms/**/*"
---

# Organism

## What is an Organism?

Organisms are complex, self-contained UI sections composed of molecules and atoms—headers, product grids, comment sections. They represent features users recognize by name and render the feature's loading/error/empty states. Crucially, they stay **presentational**: their data and event callbacks arrive as props from a Container, which is what actually connects to state.

## Key Principles

1. **Feature Encapsulation**: Organisms encapsulate entire features (ProductGrid, CommentSection, NavigationBar). They're the presentational half of the boundary with container logic.

2. **Connected via a Container, not directly**: Organisms do **not** subscribe to the store, fetch data, or call APIs themselves. A Container (see the Container skill) connects to state, performs the side effects, and passes `data` + `events` props down. The organism receives those props and renders—keep atoms, molecules, and organisms pure.

3. **Responsive Orchestration**: Organisms handle responsive layout changes (mobile hamburger vs desktop nav) while child components remain unchanged.

## Best Practices

✅ **DO**:
- Receive feature data and event callbacks as props from a Container
- Render loading, error, and empty states from those props
- Compose molecules and atoms for complex UI
- Keep feature-specific presentation logic (conditional layout, formatting)
- Define responsive breakpoint behaviors
- Handle error states and edge cases

❌ **DON'T**:
- Connect to the store, fetch data, or call APIs directly here (that's the Container's job)
- Put business logic here (it belongs in state/containers)
- Put layout concerns here (that's templates)
- Make organisms too large—split into sub-organisms
- Duplicate logic across similar organisms
- Mix multiple unrelated features in one organism
- Ignore loading/error/empty states

## Code Patterns

### Recommended

The organism is presentational; a **Container** connects it to state and passes `data` + `events` props.

```jsx
// ui/organisms/ProductGrid/ProductGrid.component.jsx — presentational organism
import ProductCard from '../../molecules/ProductCard/ProductCard.component';
import FilterBar from '../../molecules/FilterBar/FilterBar.component';
import LoadingSpinner from '../../atoms/LoadingSpinner/LoadingSpinner.component';
import EmptyState from '../../atoms/EmptyState/EmptyState.component';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage.component';

export default function ProductGrid({ productData, events }) {
  if (productData.error) return <ErrorMessage message={productData.error} />;
  if (productData.isLoading) return <LoadingSpinner />;
  if (!productData.products.length) return <EmptyState />;

  return (
    <section className="product-grid">
      <FilterBar filters={productData.filters} onChange={events.onFilterChange} />
      <div className="product-grid__items">
        {productData.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

```jsx
// containers/ProductGridContainer.jsx — Container: connects state to the organism
import useStore from '../state'; // or react-redux useSelector/useDispatch, etc.
import ProductGrid from '../ui/organisms/ProductGrid/ProductGrid.component';

export default function ProductGridContainer() {
  const productData = useStore((state) => state.products);
  const setFilter = useStore((state) => state.setFilter);

  const events = { onFilterChange: (filters) => setFilter(filters) };

  return <ProductGrid productData={productData} events={events} />;
}
```

### Avoid

```jsx
// ❌ WRONG - Organism reaching into the store / fetching directly
import { useProducts } from '../hooks/useProducts';

const ProductGrid = ({ category }) => {
  const { products, loading } = useProducts(category); // organism now coupled to state
  useEffect(() => { /* fetch on mount */ }, []);
  return <div>{products.map((p) => <ProductCard product={p} />)}</div>;
};
// Move the store/fetch wiring into a Container and pass data + events as props.
// A pure props-driven organism is correct — it is NOT "just a molecule".
```

## Related Terminologies

- **Molecule** (UI) - Simpler components organisms compose
- **Template** (UI) - Page layouts that arrange organisms
- **Container** (Server) - Connects state to the organism and passes data/events as props
- **Store** (State) - Where the Container (not the organism) reads data from

## Quality Gates

- [ ] Represents a recognizable feature
- [ ] Renders loading, error, empty states from props
- [ ] Stays presentational — connected to state through a Container, not directly
- [ ] Composes molecules/atoms (doesn't recreate)
- [ ] Responsive behavior defined
- [ ] Single feature focus

**Source**: `/docs/ui/organism.md`
