---
title: Molecule
layout: doc
slug: molecule
---
# Molecule

> - Comprised of multiple atoms or molecules
> - Populates a grouped or assembled sections of UI
> - Creates functional UI patterns with single purpose

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

{% include quiz.html id="molecule-1"
   question="What is the primary difference between an atom and a molecule in Atomic Design?"
   options="A|Atoms are single-purpose indivisible units, molecules are purposeful compositions of multiple atoms that form a functional UI pattern;;B|Molecules always fetch data, atoms never do;;C|Atoms are styled, molecules are unstyled;;D|Atoms render, molecules manage state"
   correct="A"
   explanation="Atoms (Button, Input, Icon) can't be broken down further without losing meaning. A molecule (SearchBar = Input + Button + Icon) assembles atoms into a reusable pattern with a cohesive purpose." %}

{% include quiz.html id="molecule-2"
   question="Which of these belongs inside a molecule, and which does NOT?"
   options="A|Only pure markup; not even local UI state is allowed;;B|UI-only state like dropdown open/closed is fine; data fetching and business logic do NOT belong;;C|Everything belongs — molecules should be self-sufficient"
   correct="B"
   explanation="Molecules can own composition logic and local UI state (e.g., menu open/closed). Data fetching, global state mutations, and routing belong in containers or higher-level components." %}

{% include quiz.html id="molecule-3"
   question="When should you extract a molecule instead of just composing atoms inline?"
   options="A|When the same atom composition repeats across the app or encodes a cohesive, consistent pattern;;B|Only for forms;;C|As soon as two atoms are placed next to each other;;D|Only when the product manager asks"
   correct="A"
   explanation="A molecule earns its keep when the pattern repeats and has a single purpose (FormField, SearchBar, NotificationItem). Extracting once-used combinations just adds files for no reuse gain." %}

{% include quiz.html id="molecule-4"
   question="Can a molecule contain other molecules?"
   options="A|No, molecules may only contain atoms;;B|Yes — nested molecules (e.g. Card -> CardHeader) are encouraged when each has independent reuse value, but deep nesting usually signals an organism"
   correct="B"
   explanation="Hierarchical composition (Card -> CardHeader -> Image/Title/Badge atoms) is a core part of the methodology. Push to an organism when nesting stops being about cohesion and starts managing multiple concerns." %}

{% include quiz.html id="molecule-5"
   question="What's the best strategy for molecule props?"
   options="A|Accept the whole Redux state as a prop so the molecule is self-contained;;B|Expose every possible atom prop so nothing is hidden;;C|Expose only what varies, accept interaction callbacks, and use rest-props spread onto the inner atom for flexibility"
   correct="C"
   explanation="Well-scoped props (label, value, onChange, error, variant) plus a rest-spread onto the core atom keep molecules flexible without prop explosion. Passing global state tightly couples the molecule to your store." %}

## References

- [Molecules — Atomic Design (Brad Frost)](https://atomicdesign.bradfrost.com/chapter-2/#molecules)
