---
title: Story
layout: doc
slug: story
---
# Story

## Key Insight

A Storybook story is a **component development snapshot**—capturing one specific visual state with precise props and data. Stories transform your component library into an **interactive workshop** where designers, developers, and QA can explore every edge case (loading state, error state, empty data) without touching application code. Think of stories as **unit tests for the eyes**: each story isolates and documents exactly how your component should look and behave in different scenarios.

## Detailed Description

Stories are the fundamental building blocks of Storybook, providing an isolated environment to develop and test UI components independently from the rest of your application.

**What is a Story?**
A story is a named export in a `.stories.js` or `.stories.ts` file that describes how to render a component with specific props, state, and data. Each story represents one "interesting state" of your component—such as a button in its disabled state, a form with validation errors, or a data table with 1000 rows.

**Component Story Format (CSF):**
Storybook uses CSF (Component Story Format), an ES6 module standard that makes stories portable and machine-readable:

- **Default export**: Metadata about the component (title, component, decorators, etc.)
- **Named exports**: Individual stories, each representing a specific component state
- **Args**: Props passed to the component, editable via Controls addon
- **Decorators**: Wrapper components that provide context (themes, routers, providers)
- **Play functions**: Automated interactions to test user flows

**Benefits of Story-Driven Development:**

1. **Isolated Development**: Build components without starting the entire app
2. **Visual Testing**: Catch UI regressions by comparing story snapshots
3. **Living Documentation**: Stories show designers/stakeholders actual component behavior
4. **Edge Case Coverage**: Explicitly test loading states, errors, empty data, long text
5. **Team Collaboration**: Shared workspace for developers, designers, and QA
6. **Faster Debugging**: Reproduce bugs by creating a story that matches production state

**Storybook Workflow:**
Developers write stories alongside components → Storybook renders stories in isolated iframe → Addons provide Controls (edit args), Actions (event logging), Accessibility checks, Visual regression tests → Stories become reusable test fixtures for unit tests, integration tests, and screenshot tests.

By leveraging stories, developers can efficiently build, document, and test UI components, making Storybook a powerful tool in the frontend development process.

## References
- [1] https://storybook.js.org/docs/7/get-started/whats-a-story
- [2] https://storybook.js.org/docs/get-started/whats-a-story
- [3] https://storybook.js.org/blog/the-storybook-story/
- [4] https://www.youtube.com/watch?v=QbthZStwESI
- [5] https://storybook.js.org/docs/writing-stories
- [6] https://storybook.js.org/docs
- [7] https://storybook.js.org/docs/get-started/browse-stories
- [8] https://storybook.js.org/docs-assets/6.5/get-started/example-button-noargs.png?sa=X&ved=2ahUKEwiZkJ3bnd-KAxXymIkEHdz4A8UQ_B16BAgHEAI
## Code Examples

### Basic Example: Button Component Stories

```javascript
// Button.stories.js - Basic story file structure
import React from 'react';
import { Button } from './Button';

// Default export: Component metadata
export default {
  title: 'UI/Button',  // Sidebar location
  component: Button,
  // Automatic prop documentation
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger']
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large']
    },
    disabled: {
      control: 'boolean'
    },
    onClick: { action: 'clicked' }  // Log clicks in Actions panel
  }
};

// Named exports: Individual stories

// Story 1: Primary button (most common state)
export const Primary = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Click me'
  }
};

// Story 2: Secondary variant
export const Secondary = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Cancel'
  }
};

// Story 3: Danger/destructive action
export const Danger = {
  args: {
    variant: 'danger',
    size: 'medium',
    children: 'Delete'
  }
};

// Story 4: Disabled state
export const Disabled = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Click me',
    disabled: true
  }
};

// Story 5: Large button
export const Large = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button'
  }
};

// Story 6: Small button
export const Small = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small'
  }
};

// Story 7: Long text edge case
export const LongText = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'This is a button with very long text that might wrap or overflow'
  }
};

// Story 8: Icon button
export const WithIcon = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: (
      <>
        <Icon name="search" /> Search
      </>
    )
  }
};
```

### Practical Example: Form Component with Decorators and Play Functions

{% raw %}
```javascript
// LoginForm.stories.jsx - Advanced story features
import React from 'react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { LoginForm } from './LoginForm';

export default {
  title: 'Forms/LoginForm',
  component: LoginForm,
  // Decorators: Add theme/router/store context
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <Story />
      </div>
    )
  ],
  // Global args shared by all stories
  args: {
    onSubmit: () => console.log('Form submitted')
  }
};

// Story 1: Empty form (initial state)
export const Empty = {
  args: {}
};

// Story 2: Filled form
export const Filled = {
  args: {
    initialValues: {
      email: 'user@example.com',
      password: 'password123'
    }
  }
};

// Story 3: Validation errors
export const WithErrors = {
  args: {
    errors: {
      email: 'Email is required',
      password: 'Password must be at least 8 characters'
    }
  }
};

// Story 4: Loading state
export const Loading = {
  args: {
    isLoading: true,
    initialValues: {
      email: 'user@example.com',
      password: 'password123'
    }
  }
};

// Story 5: Submit error
export const SubmitError = {
  args: {
    submitError: 'Invalid email or password'
  }
};

// Story 6: Interaction test with play function
export const InteractionTest = {
  args: {},
  play: async ({ canvasElement }) => {
    // Canvas is the preview iframe
    const canvas = within(canvasElement);
    
    // Find form elements
    const emailInput = canvas.getByLabelText(/email/i);
    const passwordInput = canvas.getByLabelText(/password/i);
    const submitButton = canvas.getByRole('button', { name: /log in/i });
    
    // Simulate user interactions
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    // Verify form state
    await expect(emailInput).toHaveValue('user@example.com');
    await expect(passwordInput).toHaveValue('password123');
    await expect(submitButton).toBeEnabled();
    
    // Submit form
    await userEvent.click(submitButton);
  }
};

// Story 7: Accessibility test
export const AccessibilityTest = {
  args: {
    initialValues: {
      email: 'user@example.com',
      password: 'password123'
    }
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'label',  // Ensure all inputs have labels
            enabled: true
          }
        ]
      }
    }
  }
};
```
{% endraw %}

### Advanced Example: Data Table with Complex States

{% raw %}
```typescript
// DataTable.stories.ts - TypeScript stories with complex data
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { User } from './types';

// Generate mock data
const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'admin' : 'user',
    status: i % 2 === 0 ? 'active' : 'inactive'
  }));
};

const meta: Meta<typeof DataTable> = {
  title: 'Data/DataTable',
  component: DataTable,
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    )
  ],
  argTypes: {
    onRowClick: { action: 'row clicked' },
    onSort: { action: 'sorted' },
    onPageChange: { action: 'page changed' }
  }
};

export default meta;
type Story = StoryObj<typeof DataTable>;

// Story 1: Empty state
export const Empty: Story = {
  args: {
    data: [],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' }
    ]
  }
};

// Story 2: Small dataset (5 rows)
export const SmallDataset: Story = {
  args: {
    data: generateUsers(5),
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: true },
      { key: 'status', label: 'Status' }
    ]
  }
};

// Story 3: Large dataset (1000 rows with pagination)
export const LargeDataset: Story = {
  args: {
    data: generateUsers(1000),
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: true },
      { key: 'status', label: 'Status' }
    ],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 1000
    }
  }
};

// Story 4: Loading state
export const Loading: Story = {
  args: {
    data: generateUsers(5),
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' }
    ],
    isLoading: true
  }
};

// Story 5: Error state
export const Error: Story = {
  args: {
    data: [],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' }
    ],
    error: 'Failed to load data. Please try again.'
  }
};

// Story 6: Row selection
export const WithRowSelection: Story = {
  args: {
    data: generateUsers(10),
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' }
    ],
    selectable: true,
    selectedRows: [2, 5, 7]
  }
};

// Story 7: Custom cell rendering
export const CustomCells: Story = {
  args: {
    data: generateUsers(5),
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { 
        key: 'role', 
        label: 'Role',
        render: (value: string) => (
          <span className={`badge badge-${value}`}>{value}</span>
        )
      },
      {
        key: 'status',
        label: 'Status',
        render: (value: string) => (
          <span className={`status-${value}`}>
            {value === 'active' ? '���' : '���'} {value}
          </span>
        )
      }
    ]
  }
};

// Story 8: Responsive mobile view
export const MobileView: Story = {
  args: {
    data: generateUsers(5),
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' }
    ]
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'  // iPhone view
    }
  }
};
```

## Common Mistakes

### 1. Not Creating Stories for Edge Cases
**Mistake:** Only creating "happy path" stories, missing error states, loading states, and empty data.

```javascript
// ❌ BAD: Only one story showing ideal state
// UserList.stories.js
export default {
  title: 'UserList',
  component: UserList
};

export const Default = {
  args: {
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  }
};
// Missing: empty state, loading, error, 1000 users, long names


// ✅ GOOD: Cover all important states
export const Empty = {
  args: {
    users: []
  }
};

export const Loading = {
  args: {
    users: [],
    isLoading: true
  }
};

export const Error = {
  args: {
    users: [],
    error: 'Failed to load users'
  }
};

export const LargeDataset = {
  args: {
    users: Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`
    }))
  }
};

export const LongNames = {
  args: {
    users: [
      { id: 1, name: 'Wolfeschlegelsteinhausenbergerdorff' }
    ]
  }
};

export const WithPagination = {
  args: {
    users: generateUsers(100),
    pagination: { page: 1, pageSize: 20 }
  }
};
```

**Why it matters:** Edge cases reveal bugs that don't appear in ideal conditions (overflow, layout breaks, poor error handling).

### 2. Hardcoding Component Data Instead of Using Args
**Mistake:** Rendering components with hardcoded props, making stories non-interactive.

```javascript
// ❌ BAD: Hardcoded props, can't edit in Controls
export const PrimaryButton = () => (
  <Button variant="primary" size="medium">
    Click me
  </Button>
);
// Controls addon shows nothing to edit


// ✅ GOOD: Use args for interactive controls
export const PrimaryButton = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Click me'
  }
};
// Now you can edit variant/size/text in Controls panel

// Even better: Define argTypes for better controls
export default {
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Button color variant'
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large']
    },
    disabled: {
      control: 'boolean'
    }
  }
};
```

**Why it matters:** Args make stories interactive—designers can tweak values without code changes, and args are reusable across stories.

### 3. Forgetting Decorators for Context Providers
**Mistake:** Stories fail because components need context (theme, router, Redux store) but stories don't provide it.

{% raw %}
```javascript
// ❌ BAD: Component needs ThemeProvider but story doesn't wrap it
// ThemeButton.stories.js
export const Primary = {
  args: { children: 'Click me' }
};
// ERROR: ThemeButton crashes because it calls useTheme() but no provider exists


// ✅ GOOD: Add decorator to provide context
import { ThemeProvider } from '../ThemeProvider';

export default {
  component: ThemeButton,
  decorators: [
    (Story) => (
      <ThemeProvider theme={{ primaryColor: '#0066cc' }}>
        <Story />
      </ThemeProvider>
    )
  ]
};

export const Primary = {
  args: { children: 'Click me' }
};


// ✅ EVEN BETTER: Global decorator in .storybook/preview.js
// .storybook/preview.js
import { ThemeProvider } from '../src/ThemeProvider';

export const decorators = [
  (Story) => (
    <ThemeProvider theme={{ primaryColor: '#0066cc' }}>
      <Story />
    </ThemeProvider>
  )
];

// Now all stories have theme context automatically


// Multiple decorators example
export default {
  component: UserProfile,
  decorators: [
    // Router context
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
    // Redux store
    (Story) => (
      <Provider store={mockStore}>
        <Story />
      </Provider>
    ),
    // Theme
    (Story) => (
      <ThemeProvider theme="light">
        <Story />
      </ThemeProvider>
    )
  ]
};
```
{% endraw %}

**Why it matters:** Components often depend on context providers (React Router, Redux, theme). Without decorators, stories crash or render incorrectly.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What's the difference between args and argTypes?</summary>

**Answer:** **`args` are the actual prop values passed to the component. `argTypes` define how those args appear in the Controls panel (input type, options, descriptions).**

```javascript
export default {
  component: Button,
  
  // argTypes: Define control UI and documentation
  argTypes: {
    variant: {
      control: 'select',  // Dropdown in Controls
      options: ['primary', 'secondary', 'danger'],
      description: 'Button color variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      control: 'radio',  // Radio buttons in Controls
      options: ['small', 'medium', 'large']
    },
    disabled: {
      control: 'boolean'  // Checkbox in Controls
    },
    onClick: {
      action: 'clicked'  // Log events in Actions panel
    }
  }
};

// args: Actual values for this specific story
export const Primary = {
  args: {
    variant: 'primary',   // Actual value
    size: 'medium',       // Actual value
    disabled: false,      // Actual value
    children: 'Click me'  // Actual value
  }
};

export const Disabled = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: true,  // Different value
    children: 'Click me'
  }
};
```

**Summary:**
- **`argTypes`**: Control configuration (once per component)
- **`args`**: Prop values (per story)

**Why it matters:** argTypes make stories interactive and well-documented. Without them, Controls panel is generic.
</details>

<details>
<summary><strong>Question 2:</strong> How do you test user interactions in stories?</summary>

**Answer:** **Use play functions with `@storybook/testing-library` to simulate clicks, typing, and verify component behavior.**

```javascript
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export const InteractionTest = {
  args: {},
  play: async ({ canvasElement }) => {
    // Get canvas (preview iframe DOM)
    const canvas = within(canvasElement);
    
    // STEP 1: Find elements
    const emailInput = canvas.getByLabelText(/email/i);
    const passwordInput = canvas.getByLabelText(/password/i);
    const submitButton = canvas.getByRole('button', { name: /log in/i });
    
    // STEP 2: Simulate user actions
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    // STEP 3: Verify state changes
    await expect(emailInput).toHaveValue('user@example.com');
    await expect(passwordInput).toHaveValue('password123');
    
    // STEP 4: Click button
    await userEvent.click(submitButton);
    
    // STEP 5: Verify result
    const successMessage = await canvas.findByText(/logged in/i);
    await expect(successMessage).toBeInTheDocument();
  }
};


// Example: Testing form validation
export const ValidationTest = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Submit empty form
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    
    // Expect validation errors
    await expect(canvas.getByText(/email is required/i)).toBeInTheDocument();
    await expect(canvas.getByText(/password is required/i)).toBeInTheDocument();
  }
};


// Example: Testing dropdown interaction
export const DropdownTest = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Open dropdown
    const trigger = canvas.getByRole('button', { name: /select option/i });
    await userEvent.click(trigger);
    
    // Verify menu is visible
    const menu = canvas.getByRole('menu');
    await expect(menu).toBeVisible();
    
    // Select option
    const option = canvas.getByRole('menuitem', { name: /option 2/i });
    await userEvent.click(option);
    
    // Verify selection
    await expect(trigger).toHaveTextContent(/option 2/i);
  }
};
```

**Why it matters:** Play functions automate testing so you catch bugs during development, not in production.
</details>

<details>
<summary><strong>Question 3:</strong> When should you use decorators vs parameters?</summary>

**Answer:** **Use decorators to wrap components with context/providers. Use parameters to configure addons and Storybook behavior.**

{% raw %}
```javascript
// DECORATORS: Wrap component with context

export default {
  component: UserProfile,
  decorators: [
    // Centering decorator
    (Story) => (
      <div style={{ margin: '50px auto', maxWidth: '600px' }}>
        <Story />
      </div>
    ),
    // Theme provider
    (Story) => (
      <ThemeProvider theme="light">
        <Story />
      </ThemeProvider>
    ),
    // Router
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
};


// PARAMETERS: Configure Storybook addons

export const MobileView = {
  args: { user: mockUser },
  
  parameters: {
    // Viewport addon: Set default viewport
    viewport: {
      defaultViewport: 'mobile1'  // iPhone size
    },
    
    // Backgrounds addon: Set background color
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' }
      ]
    },
    
    // A11y addon: Configure accessibility tests
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true }
        ]
      }
    },
    
    // Actions addon: Disable action logging
    actions: { disable: true },
    
    // Controls addon: Disable controls for this story
    controls: { disable: true },
    
    // Docs addon: Customize documentation
    docs: {
      description: {
        story: 'This story shows mobile view with dark background'
      }
    },
    
    // Layout: fullscreen, centered, or padded
    layout: 'fullscreen'  // Remove padding
  }
};


// Global parameters in .storybook/preview.js
export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#333333' }
    ]
  },
  viewport: {
    viewports: {
      mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
      tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } }
    }
  }
};
```
{% endraw %}

**Summary:**
- **Decorators**: Wrap components (context, layout)
- **Parameters**: Configure addons (viewport, backgrounds, a11y)

**Why it matters:** Decorators affect component rendering. Parameters affect Storybook UI and testing tools.
</details>

<details>
<summary><strong>Question 4:</strong> How do you share stories across multiple components?</summary>

**Answer:** **Export stories as objects, then import and reuse them in other story files. Or use composition with `render` function.**

```javascript
// ===== METHOD 1: Export and reuse story args =====

// Button.stories.js
export const buttonArgs = {
  Primary: {
    variant: 'primary',
    children: 'Click me'
  },
  Secondary: {
    variant: 'secondary',
    children: 'Cancel'
  }
};

export const Primary = { args: buttonArgs.Primary };
export const Secondary = { args: buttonArgs.Secondary };


// Form.stories.js - Reuse button args
import { buttonArgs } from './Button.stories';

export const LoginForm = {
  render: () => (
    <form>
      <input type="email" />
      <input type="password" />
      <Button {...buttonArgs.Primary} />
    </form>
  )
};


// ===== METHOD 2: Composition with render function =====

// Card.stories.js
export const ProductCard = {
  render: (args) => (
    <Card>
      <CardImage src={args.image} />
      <CardTitle>{args.title}</CardTitle>
      <CardDescription>{args.description}</CardDescription>
      <Button variant="primary">Add to Cart</Button>
    </Card>
  ),
  args: {
    image: '/product.jpg',
    title: 'Product Name',
    description: 'Product description'
  }
};


// ProductGrid.stories.js - Reuse ProductCard
import { ProductCard } from './Card.stories';

export const GridView = {
  render: () => (
    <div className="grid">
      <ProductCard.render {...ProductCard.args} />
      <ProductCard.render {...ProductCard.args} />
      <ProductCard.render {...ProductCard.args} />
    </div>
  )
};


// ===== METHOD 3: Story templates =====

// Create reusable template
const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = { variant: 'primary', children: 'Primary' };

export const Secondary = Template.bind({});
Secondary.args = { variant: 'secondary', children: 'Secondary' };

export const Danger = Template.bind({});
Danger.args = { variant: 'danger', children: 'Delete' };
```

**Why it matters:** Reusing stories prevents duplication and ensures consistency when same component appears in multiple contexts.
</details>

<details>
<summary><strong>Question 5:</strong> How do you organize stories for a large component library?</summary>

**Answer:** **Use hierarchical naming, group related components, create separate folders for atoms/molecules/organisms, and use MDX for documentation pages.**

{% raw %}
```javascript
// ===== FOLDER STRUCTURE =====

src/components/
├── atoms/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.stories.js       // title: 'Atoms/Button'
│   │   ├── Button.test.js
│   │   └── Button.module.css
│   ├── Input/
│   │   ├── Input.jsx
│   │   ├── Input.stories.js        // title: 'Atoms/Input'
│   └── ...
│
├── molecules/
│   ├── FormField/
│   │   ├── FormField.jsx
│   │   ├── FormField.stories.js    // title: 'Molecules/FormField'
│   └── SearchForm/
│       ├── SearchForm.jsx
│       ├── SearchForm.stories.js   // title: 'Molecules/SearchForm'
│
├── organisms/
│   ├── Header/
│   │   ├── Header.jsx
│   │   ├── Header.stories.js       // title: 'Organisms/Header'
│   └── ProductCard/
│       ├── ProductCard.jsx
│       ├── ProductCard.stories.js  // title: 'Organisms/ProductCard'
│
└── templates/
    └── HomepageTemplate/
        ├── HomepageTemplate.jsx
        ├── HomepageTemplate.stories.js  // title: 'Templates/Homepage'


// ===== NAMING CONVENTIONS =====

// Button.stories.js
export default {
  title: 'Design System/Atoms/Button',  // Creates hierarchy in sidebar
  component: Button,
  tags: ['autodocs'],  // Auto-generate docs page
};

// ProductCard.stories.js
export default {
  title: 'Design System/Organisms/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
};


// ===== MDX DOCUMENTATION PAGES =====

// .storybook/stories/Introduction.mdx
import { Meta } from '@storybook/blocks';

<Meta title="Introduction/Getting Started" />

# Design System

Welcome to our component library!

## Quick Start
...


// .storybook/stories/Colors.mdx
<Meta title="Design Tokens/Colors" />

# Color Palette

<ColorPalette>
  <ColorItem
    title="Primary"
    subtitle="Main brand color"
    colors={{ Primary: '#0066cc' }}
  />
</ColorPalette>


// ===== STORYBOOK SIDEBAR ORGANIZATION =====

.storybook/
└── main.js

// main.js
export default {
  stories: [
    '../src/**/*.mdx',  // MDX docs first
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y'
  ]
};

// Result in sidebar:
// ��� Introduction
//   └── Getting Started
// ��� Design Tokens
//   ├── Colors
//   └── Typography
// ��� Atoms
//   ├── Button
//   ├── Input
//   └── Label
// ��� Molecules
//   ├── FormField
//   └── SearchForm
// ��� Organisms
//   ├── Header
//   └── ProductCard
```
{% endraw %}

**Why it matters:** Clear organization makes design systems navigable for large teams and scales to hundreds of components.
</details>

## References

- [1] https://storybook.js.org/docs/7/get-started/whats-a-story
- [2] https://storybook.js.org/docs/get-started/whats-a-story
- [3] https://storybook.js.org/blog/the-storybook-story/
- [4] https://www.youtube.com/watch?v=QbthZStwESI
- [5] https://storybook.js.org/docs/writing-stories
- [6] https://storybook.js.org/docs
- [7] https://storybook.js.org/docs/get-started/browse-stories
