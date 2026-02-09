---
title: Molecule
layout: doc
slug: molecule
---
# Molecule

> - Comprised of multiple atoms or molecules
> - Populates a grouped or assembled sections of UI

## Key Insight

Molecules are where atoms come together to form functional UI patterns—think of a search bar (input + button + icon) or a form field (label + input + error message). By composing simple [atoms](atom.html) into cohesive groups with a single purpose, molecules create reusable interface patterns that maintain consistency while reducing the need to rebuild common UI combinations from scratch every time.

## Detailed Description

In the [Atomic Design](atomic-design.html) methodology, molecules represent the first level of composition where individual atoms combine into functional groups. While atoms are deliberately simple and focused on a single responsibility, molecules bring atoms together to create meaningful interface patterns that users actually interact with. A button atom is useful, but a search bar molecule (combining an input atom, button atom, and perhaps an icon atom) creates a complete, reusable search interface.

The power of molecules lies in their balance between simplicity and functionality. They're complex enough to be useful as standalone interface patterns, but simple enough to remain reusable across different contexts. A well-designed molecule doesn't know about the broader application state or business logic—it simply accepts props, renders atoms in a cohesive layout, and communicates user interactions back through callbacks. This encapsulation makes molecules portable across different pages, applications, or even frameworks.

In the Universal Frontend Architecture, molecules serve as the bridge between atomic primitives and complex organisms. They handle common UI patterns like form fields, card headers, list items, or navigation links, freeing developers from repeatedly composing the same atoms. When you need a form field throughout your application, you don't combine Label + Input + ErrorMessage atoms each time—you use a FormField molecule that handles this composition consistently.

Molecules can also contain other molecules, creating nested composition patterns. A Card molecule might include a CardHeader molecule (which itself combines an Image atom, Title atom, and IconButton atom). This hierarchical composition allows for sophisticated interfaces built from well-defined, testable pieces. The key is maintaining clear boundaries: each molecule should have a single, well-defined purpose.

From a practical perspective, molecules reduce code duplication and enforce design consistency. When your design system specifies that form fields always have a label above the input with error messages below, encoding this pattern in a FormField molecule ensures every instance follows the same structure. Changes to the pattern (like adding a character counter) happen in one place and propagate automatically.

## Code Examples

### Basic Example: Search Bar Molecule

A fundamental molecule combining input and button atoms:

```jsx
// SearchBar.js - Basic molecule

import React from 'react';
import Input from './atoms/Input';
import Button from './atoms/Button';
import Icon from './atoms/Icon';
import './SearchBar.css';

/**
 * SearchBar Molecule
 * Combines Input and Button atoms into a search interface
 */
const SearchBar = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = 'Search...',
  disabled = false
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="search-bar">
      <Icon name="search" className="search-bar__icon" />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="search-bar__input"
      />
      <Button
        label="Search"
        onClick={() => onSearch(value)}
        disabled={disabled || !value}
        variant="primary"
        size="small"
      />
    </div>
  );
};

export default SearchBar;
```

```css
/* SearchBar.css */
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.search-bar__icon {
  color: #666;
}

.search-bar__input {
  flex: 1;
  border: none;
}

.search-bar__input:focus {
  outline: none;
}
```

Usage:

```jsx
import React, { useState } from 'react';
import SearchBar from './molecules/SearchBar';

const App = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // Perform search logic
  };

  return (
    <SearchBar 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onSearch={handleSearch}
    />
  );
};
```

### Practical Example: Form Field Molecule with Validation

Here is a simple molecule example called `LoginForm` that combines two atoms: an `Input` atom and a `Button` atom. The `LoginForm` molecule represents a common user interface pattern where users can input their credentials and submit the form:

```jsx
// LoginForm.js

import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Perform login logic here
    console.log("Logging in with:", { username, password });
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin} label="Login" />
      </form>
    </div>
  );
};

export default LoginForm;
```

In this example, the `LoginForm` molecule encapsulates the UI for a login form. It consists of two `Input` atoms for the username and password fields, and a `Button` atom for submitting the form. The `LoginForm` molecule manages the local state for the username and password inputs and defines a `handleLogin` function that could contain the logic for authenticating the user.

Now, we can use the `LoginForm` molecule in your application:

```jsx
// App.js

import React from "react";
import LoginForm from "./LoginForm";

const App = () => {
  return (
    <div>
      <h1>My App</h1>
      <LoginForm />
    </div>
  );
};

export default App;
```

This illustrates how molecules, composed of atoms, can be used to create more complex and reusable components in a React application.

### Advanced Example: Card Molecule with Nested Molecules

A sophisticated molecule demonstrating composition and flexibility:

```jsx
// Card.js - Advanced molecule with composition

import React from 'react';
import CardHeader from './CardHeader'; // Another molecule
import Badge from './atoms/Badge';
import Button from './atoms/Button';
import Icon from './atoms/Icon';
import './Card.css';

/**
 * Card Molecule
 * Flexible container that composes multiple molecules and atoms
 * Supports different layouts and content types
 */
const Card = ({
  title,
  subtitle,
  image,
  badge,
  actions = [],
  children,
  variant = 'default',
  hoverable = false,
  onClick
}) => {
  const cardClasses = [
    'card',
    `card--${variant}`,
    hoverable && 'card--hoverable',
    onClick && 'card--clickable'
  ].filter(Boolean).join(' ');

  return (
    <article className={cardClasses} onClick={onClick}>
      {/* Header molecule - optional */}
      {(title || subtitle || image) && (
        <CardHeader 
          title={title}
          subtitle={subtitle}
          image={image}
          badge={badge && <Badge {...badge} />}
        />
      )}

      {/* Body content - flexible slot */}
      <div className="card__body">
        {children}
      </div>

      {/* Footer with actions - optional */}
      {actions.length > 0 && (
        <footer className="card__footer">
          {actions.map((action, index) => (
            <Button
              key={index}
              label={action.label}
              onClick={action.onClick}
              variant={action.variant || 'secondary'}
              size="small"
              icon={action.icon && <Icon name={action.icon} />}
            />
          ))}
        </footer>
      )}
    </article>
  );
};

export default Card;
```

```jsx
// CardHeader.js - Nested molecule

import React from 'react';
import './CardHeader.css';

const CardHeader = ({ title, subtitle, image, badge }) => {
  return (
    <header className="card-header">
      {image && (
        <div className="card-header__image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="card-header__content">
        <div className="card-header__title-row">
          <h3 className="card-header__title">{title}</h3>
          {badge && <div className="card-header__badge">{badge}</div>}
        </div>
        {subtitle && (
          <p className="card-header__subtitle">{subtitle}</p>
        )}
      </div>
    </header>
  );
};

export default CardHeader;
```

Usage demonstrating flexibility:

{% raw %}
```jsx
// ProductCard.js - Using Card molecule

import React from 'react';
import Card from './molecules/Card';

const ProductCard = ({ product }) => {
  return (
    <Card
      title={product.name}
      subtitle={`$${product.price}`}
      image={product.imageUrl}
      badge={{ text: 'New', variant: 'success' }}
      hoverable
      variant="elevated"
      actions={[
        {
          label: 'Add to Cart',
          onClick: () => addToCart(product),
          variant: 'primary',
          icon: 'plus'
        },
        {
          label: 'Details',
          onClick: () => viewDetails(product),
          icon: 'info'
        }
      ]}
    >
      <p>{product.description}</p>
      <div className="product-rating">
        {/* Rating component */}
      </div>
    </Card>
  );
};
```
{% endraw %}

## Common Mistakes

### 1. Making Molecules Too Complex
**Mistake:** Adding too many responsibilities or business logic to molecules.

```jsx
// ❌ BAD: Molecule with too much logic
const UserProfileCard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Data fetching in molecule
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  // Complex business logic
  const calculateUserScore = () => { /* ... */ };
  const determineUserBadge = () => { /* ... */ };
  
  return (
    <Card>
      {/* Complex rendering logic */}
    </Card>
  );
};
```

```jsx
// ✅ GOOD: Molecule focused on presentation
const UserProfileCard = ({ 
  user, 
  score, 
  badge, 
  onEdit, 
  onMessage 
}) => {
  return (
    <Card
      title={user.name}
      subtitle={user.role}
      image={user.avatar}
      badge={badge}
      actions={[
        { label: 'Edit', onClick: onEdit, icon: 'edit' },
        { label: 'Message', onClick: onMessage, icon: 'message' }
      ]}
    >
      <p>Score: {score}</p>
      <p>{user.bio}</p>
    </Card>
  );
};

// Container handles data fetching and logic
const UserProfileContainer = ({ userId }) => {
  const { user, loading } = useUser(userId);
  const score = calculateUserScore(user);
  const badge = determineUserBadge(user);
  
  if (loading) return <Skeleton />;
  
  return (
    <UserProfileCard 
      user={user} 
      score={score} 
      badge={badge}
      onEdit={handleEdit}
      onMessage={handleMessage}
    />
  );
};
```

**Why it matters:** Molecules should focus on presentation and composition. Business logic, data fetching, and complex state belong in [containers](../server/container.html) or parent components. See [Organism](organism.html) for more complex patterns.

### 2. Not Making Molecules Reusable Enough
**Mistake:** Hardcoding values or tightly coupling to specific use cases.

```jsx
// ❌ BAD: Hardcoded, not reusable
const ProductSearchBar = () => {
  const [query, setQuery] = useState('');
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => window.location.href = `/products?q=${query}`}>
        Search Products
      </button>
    </div>
  );
};
```

```jsx
// ✅ GOOD: Flexible and reusable
const SearchBar = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = 'Search...',
  buttonLabel = 'Search',
  disabled = false 
}) => {
  return (
    <div className="search-bar">
      <Input 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      <Button 
        label={buttonLabel}
        onClick={() => onSearch(value)}
        disabled={disabled}
      />
    </div>
  );
};

// Now usable for products, users, articles, anything!
<SearchBar 
  value={productQuery} 
  onChange={setProductQuery}
  onSearch={searchProducts}
  placeholder="Search products..."
/>

<SearchBar 
  value={userQuery} 
  onChange={setUserQuery}
  onSearch={searchUsers}
  placeholder="Search users..."
/>
```

**Why it matters:** Reusable molecules reduce duplication and maintenance burden. Generic molecules can be used across different contexts, while specialized ones lead to molecule proliferation.

### 3. Inconsistent Atom Composition
**Mistake:** Using different atoms for similar purposes across molecules.

```jsx
// ❌ BAD: Inconsistent atom usage
const FormFieldA = ({ label, value, onChange }) => (
  <div>
    <span>{label}</span>  {/* Plain span */}
    <input value={value} onChange={onChange} />  {/* Native input */}
  </div>
);

const FormFieldB = ({ label, value, onChange }) => (
  <div>
    <Label text={label} />  {/* Label atom */}
    <Input value={value} onChange={onChange} />  {/* Input atom */}
  </div>
);
```

```jsx
// ✅ GOOD: Consistent atom composition
const FormField = ({ label, value, onChange, error, required }) => (
  <div className="form-field">
    <Label 
      text={label} 
      required={required}
      htmlFor={`field-${label}`}
    />
    <Input 
      id={`field-${label}`}
      value={value} 
      onChange={onChange}
      error={Boolean(error)}
      aria-invalid={Boolean(error)}
    />
    {error && <ErrorMessage text={error} />}
  </div>
);
```

**Why it matters:** Consistent atom usage ensures uniform behavior and styling across all molecules, making the design system predictable and maintainable.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What is the primary difference between an atom and a molecule in Atomic Design?</summary>

**Answer:** 
- **Atoms** are the smallest, indivisible UI components that serve a single purpose (Button, Input, Icon, Label)
- **Molecules** are compositions of multiple atoms working together to form a functional UI pattern (SearchBar = Input + Button + Icon, FormField = Label + Input + ErrorMessage)

**Key distinction:** Atoms cannot be broken down further while maintaining meaning, whereas molecules are purposeful combinations of atoms (and sometimes other molecules) that create reusable interface patterns.

**Example:**
- Atom: `<Button label="Search" />`
- Molecule: `<SearchBar>` (contains Input atom + Button atom + Icon atom)

**Why it matters:** Understanding this distinction helps you determine the right level of abstraction for components and prevents creating overly complex atoms or overly simple molecules.
</details>

<details>
<summary><strong>Question 2:</strong> Should molecules contain state and logic, or should they be purely presentational?</summary>

**Answer:** **It depends on the type of state and logic:**

**Molecules CAN contain:**
- **UI-only state** (dropdown open/closed, internal validation)
- **Composition logic** (combining atoms, conditional rendering)
- **Event handling** (calling callbacks passed via props)

**Molecules SHOULD NOT contain:**
- **Data fetching** (API calls, async operations)
- **Business logic** (calculations, complex validation rules)
- **Global state** (Redux actions, context mutations)
- **Routing logic** (navigation, URL manipulation)

**Example:**
```jsx
// ✅ GOOD: UI state in molecule
const Dropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false); // UI state OK
  
  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <Menu options={options} onSelect={onSelect} />}
    </div>
  );
};

// ❌ BAD: Business logic in molecule
const UserDropdown = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users').then(/* ... */); // Fetching - should be in container
  }, []);
};
```

**Why it matters:** Keeping molecules focused on presentation and composition makes them reusable, testable, and easier to maintain. Complex logic belongs in [containers](../server/container.html).
</details>

<details>
<summary><strong>Question 3:</strong> When should you create a molecule versus using atoms directly?</summary>

**Answer:** Create a molecule when:

1. **The pattern repeats** - You're composing the same atoms together multiple times
   - Example: Label + Input + ErrorMessage appears in 10+ places → Create FormField molecule

2. **The composition has cohesive purpose** - The atoms work together as a functional unit
   - Example: Icon + Text + Badge = NotificationItem (not just random atoms)

3. **You want consistent behavior** - The pattern should always work the same way
   - Example: All search bars should submit on Enter, show icon, have same layout

4. **Atoms alone aren't sufficient** - Single atoms don't provide enough functionality
   - Example: Just an Input atom doesn't show validation errors or labels

**Don't create a molecule when:**
- It's used only once (just compose atoms inline)
- Atoms are unrelated (arbitrary grouping)
- It would be simpler as an organism or template

**Example decision:**
```jsx
// Used once - DON'T make a molecule
<div>
  <Button onClick={handleSave} />
  <Icon name="info" />  // Unrelated, happens to be near button
</div>

// Repeated pattern - DO make a molecule
// Pattern: Image + Title + Subtitle appears 20 times
const MediaItem = ({ image, title, subtitle }) => (
  <div className="media-item">
    <Image src={image} size="small" />
    <div>
      <Heading level={3}>{title}</Heading>
      <Text variant="secondary">{subtitle}</Text>
    </div>
  </div>
);
```

**Why it matters:** Creating molecules at the right granularity prevents both under-abstraction (duplicated code) and over-abstraction (too many single-use components).
</details>

<details>
<summary><strong>Question 4:</strong> Can molecules contain other molecules, or only atoms?</summary>

**Answer:** **Yes, molecules can (and often should) contain other molecules.** This creates hierarchical composition:

**Example hierarchy:**
```
Card (Molecule)
├── CardHeader (Molecule)
│   ├── Image (Atom)
│   ├── Title (Atom)
│   └── Badge (Atom)
├── CardBody (content slot)
└── CardFooter (Molecule)
    └── Button (Atom) × multiple
```

**Benefits of nested molecules:**
1. **Reusability** - CardHeader can be used in Card, Modal, Drawer
2. **Testability** - Test CardHeader independently
3. **Maintainability** - Change header layout in one place
4. **Clarity** - Clear component boundaries

**Guidelines:**
- Nest when sub-molecules have independent value
- Don't nest more than 2-3 levels (becomes organism territory)
- Each nested molecule should have clear purpose

**When nesting gets too deep, promote to [Organism](organism.html):**
```jsx
// This is actually an organism, not a molecule:
const ComplexDataTable = () => (
  <Table>
    <TableHeader />
    <TableFilters>
      <SearchBar />
      <FilterDropdown />
      <DateRangePicker />
    </TableFilters>
    <TableBody>
      <TableRow /> {/* repeated */}
    </TableBody>
    <TablePagination />
  </Table>
);
```

**Why it matters:** Understanding composition depth helps you organize components appropriately and know when to move from molecules to organisms.
</details>

<details>
<summary><strong>Question 5:</strong> How do you decide what props a molecule should accept?</summary>

**Answer:** Molecule props should:

**1. Expose atom props that vary:**
```jsx
// ✅ GOOD: Expose varying props
const FormField = ({ 
  label,           // Varies per field
  value,           // Varies
  onChange,        // Varies
  type = 'text',   // Sometimes varies
  required = false,// Sometimes varies
  error            // Varies
}) => (
  <div>
    <Label text={label} required={required} />
    <Input type={type} value={value} onChange={onChange} />
    {error && <ErrorMessage text={error} />}
  </div>
);
```

**2. Provide composition options:**
```jsx
const Card = ({
  showHeader = true,    // Toggle sections
  showFooter = true,
  variant = 'default',  // Visual variants
  actions = []          // Flexible action buttons
}) => { /* ... */ };
```

**3. Accept callbacks for interactions:**
```jsx
const SearchBar = ({
  onSearch,    // Required callback
  onChange,    // Required callback
  onClear      // Optional callback
}) => { /* ... */ };
```

**Avoid:**
- Passing through every possible atom prop (prop explosion)
- Complex object structures (harder to use)
- Global state as props (tight coupling)

**Pattern - use rest props for flexibility:**
```jsx
const FormField = ({ label, error, ...inputProps }) => (
  <div>
    <Label text={label} />
    <Input {...inputProps} /> {/* Flexible */}
    {error && <ErrorMessage text={error} />}
  </div>
);

// Usage
<FormField 
  label="Email" 
  type="email"
  value={email}
  onChange={setEmail}
  placeholder="you@example.com"  // Passed to Input
  autoComplete="email"           // Passed to Input
/>
```

**Why it matters:** Well-designed props make molecules flexible without being overwhelming. Balance between explicit control and simplicity.
</details>

## References

- https://atomicdesign.bradfrost.com/chapter-2/#molecules
