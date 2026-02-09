---
title: Props
layout: doc
slug: props
---
# Props

> - Props are arguments passed into JS components
> - Deliver structural information that unlike attributes, can be used by JS within components
> - We can also define our custom properties, to define the custom behaviours of our custom elements.
> - Properties can have any value and they are case sensitive.

## Key Insight

Props are the contract between a component and its users—they define what data a component accepts, how it behaves, and how it communicates back to parent components. By treating props as an immutable, read-only interface, you create predictable, reusable components that work reliably across your entire application, making component APIs as clear and dependable as function signatures.

## Detailed Description

In component-based architecture, props (short for "properties") serve as the primary mechanism for passing data from parent components to children. They function similarly to function parameters in traditional programming: a parent component provides values through props, and the child component uses those values to render its output. This unidirectional data flow—from parent to child—is fundamental to the Universal Frontend Architecture and creates predictable, debuggable applications.

Props are intentionally immutable within the receiving component. When a component receives props, it cannot modify them directly—this constraint enforces the principle that data flows down the component tree while events flow up. If a child component needs to "change" a prop value, it calls a callback function passed as a prop, which allows the parent to update its state, triggering a re-render with new props. This pattern prevents the chaotic bidirectional data flow that plagues many UI frameworks.

The distinction between props and state is crucial: props are external inputs controlled by parent components, while state is internal data managed by the component itself. A component's props might include a `username` from a parent, while its state might track whether a dropdown is open. Props flow down from ancestors, state lives within the component, and together they determine what the component renders.

In the context of Web Components and custom elements, props vs attributes becomes important. HTML attributes (strings in markup) get converted to JavaScript properties (any type) on element instances. Modern frameworks abstract this complexity, but understanding the distinction helps when working with native Web Components or debugging framework behavior. Attributes are limited to strings in HTML, while props can be any JavaScript value—objects, arrays, functions.

Props serve as the component's API, and like any API, should be designed with care. Well-designed props make components flexible without being overwhelming. Too few props make components inflexible and lead to duplication. Too many props create cognitive overload and make components difficult to use. The art lies in finding the right abstractions: provide props for things that vary, use sensible defaults for things that rarely change, and leverage composition (children prop) for flexible content.

## Code Examples

### Basic Example: Simple Props Usage

Fundamental props demonstration showing data flow:

```jsx
// Button.js - Component receiving props

import React from 'react';

const Button = ({ label, onClick, variant = 'primary', disabled = false }) => {
  // Props are read-only - cannot modify them
  // variant and disabled have default values
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant}`}
    >
      {label}
    </button>
  );
};

export default Button;
```

Usage showing prop passing:

```jsx
// App.js - Parent component passing props

import React from 'react';
import Button from './Button';

const App = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div>
      {/* Passing different props to same component */}
      <Button 
        label="Save" 
        onClick={handleClick} 
        variant="primary" 
      />
      
      <Button 
        label="Cancel" 
        onClick={() => console.log('Cancelled')} 
        variant="secondary" 
      />
      
      <Button 
        label="Delete" 
        onClick={() => console.log('Deleted')} 
        variant="danger"
        disabled={true}
      />
    </div>
  );
};
```

### Practical Example: Props with TypeScript and Validation

Real-world props with type safety and documentation:

```typescript
// UserCard.tsx - Component with TypeScript props

import React from 'react';
import './UserCard.css';

// Define prop types interface
interface UserCardProps {
  // Required props (no ? mark)
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  
  // Optional props (with ? mark)
  showEmail?: boolean;
  
  // Callback props
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  
  // Props with default values
  variant?: 'compact' | 'detailed';
  elevated?: boolean;
}

// Component with destructured props and defaults
const UserCard: React.FC<UserCardProps> = ({
  user,
  showEmail = true,
  onEdit,
  onDelete,
  variant = 'compact',
  elevated = false
}) => {
  return (
    <div className={`user-card user-card--${variant} ${elevated ? 'user-card--elevated' : ''}`}>
      <div className="user-card__avatar">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} />
        ) : (
          <div className="user-card__avatar-placeholder">
            {user.name.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="user-card__info">
        <h3 className="user-card__name">{user.name}</h3>
        {showEmail && (
          <p className="user-card__email">{user.email}</p>
        )}
      </div>
      
      {(onEdit || onDelete) && (
        <div className="user-card__actions">
          {onEdit && (
            <button onClick={() => onEdit(user.id)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(user.id)}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
```

Usage with type checking:

```typescript
import React from 'react';
import UserCard from './UserCard';

const UserList = () => {
  const users = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: '/alice.jpg' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com' }
  ];

  const handleEdit = (userId: string) => {
    console.log('Editing user:', userId);
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure?')) {
      console.log('Deleting user:', userId);
    }
  };

  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          showEmail={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          variant="detailed"
          elevated
        />
      ))}
    </div>
  );
};
```

### Advanced Example: Props Spreading, Children, and Composition

Sophisticated props patterns for flexible components:

```jsx
// Card.js - Flexible component with composition

import React from 'react';
import './Card.css';

const Card = ({
  children,           // Special prop for nested content
  header,             // Named slot
  footer,             // Named slot
  className = '',     // Additional CSS classes
  ...restProps        // Spread remaining props to root element
}) => {
  return (
    <article 
      className={`card ${className}`}
      {...restProps}    // Passes onClick, data-*, aria-*, etc.
    >
      {header && (
        <header className="card__header">
          {header}
        </header>
      )}
      
      <div className="card__body">
        {children}      {/* Flexible content slot */}
      </div>
      
      {footer && (
        <footer className="card__footer">
          {footer}
        </footer>
      )}
    </article>
  );
};

export default Card;
```

Advanced usage patterns:

```jsx
import React from 'react';
import Card from './Card';
import Button from './Button';

const ProductPage = () => {
  return (
    <div>
      {/* Pattern 1: Using children prop */}
      <Card>
        <h2>Simple Content</h2>
        <p>This goes in the children slot.</p>
      </Card>

      {/* Pattern 2: Using named slots (header, footer) */}
      <Card
        header={<h2>Product Details</h2>}
        footer={
          <div>
            <Button label="Add to Cart" variant="primary" />
            <Button label="Save for Later" variant="secondary" />
          </div>
        }
      >
        <p>Product description goes here.</p>
        <span>$99.99</span>
      </Card>

      {/* Pattern 3: Props spreading for accessibility */}
      <Card
        onClick={() => console.log('Card clicked')}
        role="button"
        tabIndex={0}
        aria-label="Product card"
        data-product-id="123"
        className="product-card"
      >
        <h3>Clickable Card</h3>
      </Card>

      {/* Pattern 4: Render props pattern */}
      <DataProvider
        render={(data) => (
          <Card>
            <h3>{data.title}</h3>
            <p>{data.description}</p>
          </Card>
        )}
      />
    </div>
  );
};
```

All attributes and properties are a bit hard to understand by just looking into the code, it will get easier once you'll see it working in a real custom element. Meanwhile, remember the trick to achieve reflection: linking get/set property methods to get/set attribute methods

Maybe this schema will help clarify how attributes and properties reflection works:

![Props vs Attributes](../assets/img/props_vs_attributes.webp "Props vs Attributes")

Click [here](https://elegant.js.org/setup/TodoList-basic-component.html#basic-understanding-of-attribute-vs-props) to learn more about the difference between props and attributes.

## Common Mistakes

### 1. Mutating Props Directly
**Mistake:** Attempting to modify props within the component.

```jsx
// ❌ BAD: Mutating props
const UserProfile = ({ user }) => {
  // Trying to modify props directly
  user.name = user.name.toUpperCase();  // ERROR! Props are read-only
  
  return <h1>{user.name}</h1>;
};
```

```jsx
// ✅ GOOD: Compute derived values without mutation
const UserProfile = ({ user }) => {
  // Create new value without mutating props
  const displayName = user.name.toUpperCase();
  
  return <h1>{displayName}</h1>;
};

// ✅ GOOD: Use state if you need to modify
const UserProfile = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser);
  
  const handleNameChange = (newName) => {
    setUser({ ...user, name: newName });  // Update state, not props
  };
  
  return (
    <div>
      <h1>{user.name}</h1>
      <input value={user.name} onChange={(e) => handleNameChange(e.target.value)} />
    </div>
  );
};
```

**Why it matters:** Props are immutable by design. Mutating them breaks React's reconciliation, causes unpredictable renders, and violates the unidirectional data flow principle. See [State](../state/state.html) for managing changeable data.

### 2. Prop Drilling Through Multiple Levels
**Mistake:** Passing props through many intermediate components that don't use them.

```jsx
// ❌ BAD: Prop drilling through unnecessary levels
const App = () => {
  const user = { name: 'Alice', role: 'admin' };
  return <Dashboard user={user} />;
};

const Dashboard = ({ user }) => {
  return <Layout user={user} />;  // Just passing through
};

const Layout = ({ user }) => {
  return <Sidebar user={user} />;  // Just passing through
};

const Sidebar = ({ user }) => {
  return <UserMenu user={user} />;  // Just passing through
};

const UserMenu = ({ user }) => {
  return <div>{user.name}</div>;  // Finally using it!
};
```

```jsx
// ✅ GOOD: Use Context API for deeply nested data
import React, { createContext, useContext } from 'react';

// Create context
const UserContext = createContext(null);

const App = () => {
  const user = { name: 'Alice', role: 'admin' };
  
  return (
    <UserContext.Provider value={user}>
      <Dashboard />
    </UserContext.Provider>
  );
};

const Dashboard = () => <Layout />;  // No props needed
const Layout = () => <Sidebar />;    // No props needed
const Sidebar = () => <UserMenu />;  // No props needed

const UserMenu = () => {
  const user = useContext(UserContext);  // Access directly
  return <div>{user.name}</div>;
};
```

**Why it matters:** Prop drilling creates fragile code where intermediate components become coupled to data they don't use. Context, composition, or state management libraries ([Redux](../state/store.html), Zustand) solve this more elegantly.

### 3. Not Using Default Props
**Mistake:** Handling undefined props with verbose conditional logic.

```jsx
// ❌ BAD: Defensive checks everywhere
const Button = (props) => {
  const label = props.label ? props.label : 'Click Me';
  const variant = props.variant ? props.variant : 'primary';
  const disabled = props.disabled !== undefined ? props.disabled : false;
  
  return (
    <button 
      className={`btn btn--${variant}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
```

```jsx
// ✅ GOOD: Default parameter values (modern JavaScript)
const Button = ({ 
  label = 'Click Me', 
  variant = 'primary', 
  disabled = false,
  onClick 
}) => {
  return (
    <button 
      className={`btn btn--${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// ✅ GOOD: TypeScript with default props
interface ButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  label = 'Click Me', 
  variant = 'primary', 
  disabled = false,
  onClick 
}) => {
  // Component implementation
};
```

**Why it matters:** Default props make components easier to use, reduce boilerplate, and make the API more discoverable. Users can see default behavior without reading documentation.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What happens if you try to modify a prop inside a component?</summary>

**Answer:** 

In **React**, props are **read-only** and attempting to modify them will:
1. In development mode: Trigger a warning or error
2. In production: May appear to work but breaks React's reconciliation and causes bugs
3. Violates the principle of unidirectional data flow

**Example of the problem:**
```jsx
const MyComponent = ({ count }) => {
  count = count + 1;  // ❌ TypeError in strict mode or silent bug
  return <div>{count}</div>;
};
```

**Why props are immutable:**
- Ensures predictable component behavior
- Allows React to optimize re-renders
- Makes debugging easier (data flows one direction: down)
- Prevents components from creating side effects

**What to do instead:**
```jsx
// If you need to derive a value:
const MyComponent = ({ count }) => {
  const nextCount = count + 1;  // ✅ Create new variable
  return <div>{nextCount}</div>;
};

// If you need to modify it:
const MyComponent = ({ count: initialCount }) => {
  const [count, setCount] = useState(initialCount);  // ✅ Use state
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

**Key principle:** Props flow down (parent to child), events flow up (child to parent via callbacks). See [State](../state/state.html) for managing mutable data.
</details>

<details>
<summary><strong>Question 2:</strong> What's the difference between props and attributes in Web Components?</summary>

**Answer:** 

**Attributes** (HTML/DOM):
- **Format:** Always strings in HTML markup
- **Syntax:** `<my-element title="Hello" count="5">`
- **Access:** `element.getAttribute('title')`
- **Kebab-case:** `<my-element user-name="Alice">`
- **Limited types:** Only strings (or boolean presence)

**Props** (JavaScript):
- **Format:** Any JavaScript value (string, number, object, array, function)
- **Syntax:** Set via JavaScript: `element.userName = { first: 'Alice', last: 'Smith' }`
- **Access:** `element.userName`
- **CamelCase:** `element.userName`
- **Rich types:** Objects, arrays, functions, etc.

**Example showing the difference:**
```html
<!-- HTML attributes - strings only -->
<user-card name="Alice" age="30"></user-card>

<script>
const card = document.querySelector('user-card');

// Attributes (strings)
console.log(card.getAttribute('age'));  // "30" (string)

// Props (any type)
card.userData = {                      // Object
  name: 'Alice',
  age: 30,                            // Number
  roles: ['admin', 'user']            // Array
};

card.onUserClick = (user) => {        // Function
  console.log('Clicked:', user);
};
</script>
```

**Reflection** - keeping them in sync:
```javascript
class UserCard extends HTMLElement {
  // Reflect property to attribute
  set name(value) {
    this.setAttribute('name', value);
  }
  
  get name() {
    return this.getAttribute('name');
  }
  
  // Rich property without attribute
  set userData(value) {
    this._userData = value;  // No attribute, objects can't be attributes
  }
  
  get userData() {
    return this._userData;
  }
}
```

**In React/Vue:** Frameworks abstract this - you use "props" in JavaScript, and the framework handles the attribute/property distinction for you.

**Why it matters:** Understanding this distinction is crucial when working with Web Components, custom elements, or debugging framework behavior.
</details>

<details>
<summary><strong>Question 3:</strong> Should you pass individual values or entire objects as props?</summary>

**Answer:** **It depends on the use case.** Both patterns have trade-offs:

**Pass individual values when:**
- Component only needs a few specific values
- You want explicit, clear interfaces
- You want to minimize re-renders (React only re-renders when specific values change)

```jsx
// ✅ GOOD: Explicit, minimal props
const UserGreeting = ({ firstName, lastName }) => (
  <h1>Hello, {firstName} {lastName}!</h1>
);

<UserGreeting firstName={user.firstName} lastName={user.lastName} />
```

**Pass objects when:**
- Many related values need to be passed together
- Object represents a cohesive entity
- You want to reduce prop drilling
- Component truly uses most/all object properties

```jsx
// ✅ GOOD: Cohesive object
const UserProfile = ({ user }) => (
  <div>
    <h1>{user.name}</h1>
    <p>{user.email}</p>
    <p>{user.bio}</p>
    <img src={user.avatar} alt={user.name} />
  </div>
);

<UserProfile user={user} />
```

**Anti-pattern: Passing entire objects when only needing one field:**
```jsx
// ❌ BAD: Passing whole object for one field
const UserBadge = ({ user }) => <span>{user.role}</span>;

// Component re-renders whenever ANY user property changes,
// even though it only displays role

// ✅ BETTER:
const UserBadge = ({ role }) => <span>{role}</span>;
<UserBadge role={user.role} />
```

**Performance consideration:**
```jsx
// Object reference changes = re-render (even if values same)
const App = () => {
  // This creates NEW object on every render
  const config = { theme: 'dark', lang: 'en' };  // ❌
  
  return <Settings config={config} />;  // Re-renders every time
};

// ✅ BETTER: Memoize or move outside
const config = { theme: 'dark', lang: 'en' };  // Outside component

const App = () => {
  return <Settings config={config} />;  // Stable reference
};
```

**Best practice:** Pass the **minimal set of props** needed for the component to function. Prefer objects for cohesive entities (user, product, config), individual values for unrelated data.

**Why it matters:** Prop design affects component reusability, performance, and clarity. Good prop interfaces make components easy to understand and use.
</details>

<details>
<summary><strong>Question 4:</strong> How do you type-check props effectively?</summary>

**Answer:** Several approaches depending on your stack:

**1. TypeScript (recommended for large projects):**
```typescript
interface ButtonProps {
  label: string;                        // Required
  onClick: () => void;                  // Required callback
  variant?: 'primary' | 'secondary';    // Optional with literal types
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false,
  icon 
}) => {
  // Type-safe implementation
};

// Usage - TypeScript catches errors
<Button label="Save" onClick={handleSave} />  // ✅
<Button onClick={handleSave} />               // ❌ Error: label required
<Button label="Save" variant="danger" />      // ❌ Error: invalid variant
```

**Benefits:** Compile-time checking, IDE autocomplete, refactoring safety

**2. PropTypes (runtime validation for JavaScript):**
```jsx
import PropTypes from 'prop-types';

const Button = ({ label, onClick, variant, disabled }) => {
  // Component implementation
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  disabled: PropTypes.bool,
  icon: PropTypes.node
};

Button.defaultProps = {
  variant: 'primary',
  disabled: false
};

export default Button;
```

**Benefits:** Runtime warnings in development, works with plain JavaScript

**3. JSDoc (type hints for JavaScript):**
```javascript
/**
 * @typedef {Object} ButtonProps
 * @property {string} label - Button label text
 * @property {() => void} onClick - Click handler
 * @property {'primary'|'secondary'} [variant='primary'] - Button style
 * @property {boolean} [disabled=false] - Whether button is disabled
 */

/** @param {ButtonProps} props */
const Button = ({ label, onClick, variant = 'primary', disabled = false }) => {
  // Component implementation
};
```

**Benefits:** IDE support without TypeScript, self-documenting code

**4. Zod (runtime validation with type inference):**
```typescript
import { z } from 'zod';

const ButtonPropsSchema = z.object({
  label: z.string(),
  onClick: z.function(),
  variant: z.enum(['primary', 'secondary']).default('primary'),
  disabled: z.boolean().default(false)
});

type ButtonProps = z.infer<typeof ButtonPropsSchema>;

const Button = (props: ButtonProps) => {
  const validated = ButtonPropsSchema.parse(props);  // Runtime validation
  // Component implementation
};
```

**Comparison:**
- **TypeScript:** Best for large teams, catches errors early, requires build step
- **PropTypes:** Good for JavaScript projects, runtime warnings only in development
- **JSDoc:** Lightweight, IDE support, no runtime cost
- **Zod:** Complex validation needs, runtime safety, type inference

**Why it matters:** Type checking prevents bugs, improves developer experience with autocomplete, and serves as inline documentation. Choose based on project size and team preferences.
</details>

<details>
<summary><strong>Question 5:</strong> What is the `children` prop and when should you use it?</summary>

**Answer:** 

`children` is a **special prop** that contains whatever is placed between a component's opening and closing tags. It enables **composition** - building complex UIs by nesting components.

**Basic usage:**
```jsx
const Card = ({ children }) => (
  <div className="card">
    {children}  {/* Renders whatever is nested inside */}
  </div>
);

// Usage
<Card>
  <h2>Title</h2>
  <p>Content goes here</p>
</Card>

// children receives:
{children} = [
  <h2>Title</h2>,
  <p>Content goes here</p>
]
```

**Use `children` when:**

**1. Building layout components:**
```jsx
const Container = ({ children }) => (
  <div className="container">{children}</div>
);

const Section = ({ title, children }) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
);

// Usage
<Container>
  <Section title="About">
    <p>About content...</p>
  </Section>
</Container>
```

**2. Wrapper components (higher-order patterns):**
```jsx
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) return <div>Something went wrong</div>;
  
  return children;  // Renders child components
};

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**3. Flexible content areas:**
```jsx
const Modal = ({ title, children, footer }) => (
  <div className="modal">
    <header>{title}</header>
    <div className="modal__body">
      {children}  {/* Flexible content */}
    </div>
    <footer>{footer}</footer>
  </div>
);

<Modal 
  title="Confirm Action" 
  footer={<Button label="OK" />}
>
  <p>Are you sure you want to proceed?</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</Modal>
```

**TypeScript typing:**
```typescript
interface CardProps {
  children: React.ReactNode;  // Can be anything renderable
  title?: string;
}

// React.ReactNode accepts: strings, numbers, elements, arrays, null, undefined, booleans
```

**Advanced: Manipulating children:**
```jsx
import React from 'react';

const List = ({ children }) => {
  // Transform children array
  const items = React.Children.map(children, (child, index) => (
    React.cloneElement(child, { key: index, className: 'list-item' })
  ));
  
  return <ul>{items}</ul>;
};

<List>
  <li>Item 1</li>
  <li>Item 2</li>
</List>
```

**When NOT to use children:**
- When you need multiple named content slots → use named props
- When content needs specific structure → use explicit props

```jsx
// ❌ Unclear with children
<Card>
  <div data-slot="header">Header</div>
  <div data-slot="body">Body</div>
</Card>

// ✅ Clear with named props
<Card
  header={<div>Header</div>}
  body={<div>Body</div>}
/>
```

**Why it matters:** `children` enables powerful composition patterns, making components flexible without complex prop APIs. It's fundamental to building reusable layout and wrapper components. See [Component](component.html) for more composition patterns.
</details>

## References

- https://www.freecodecamp.org/news/how-to-use-props-in-reactjs/
- https://javascript.works-hub.com/learn/web-components-api-definition-attributes-and-props-886c0
