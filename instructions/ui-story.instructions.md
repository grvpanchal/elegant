---
description: Guidance for Stories - Storybook component documentation and testing
name: Story - UI
applyTo: |
  **/*.stories.{js,jsx,ts,tsx}
  **/*.story.{js,jsx,ts,tsx}
---

# Story Instructions

## What is a Story?

Stories are Storybook component snapshots—isolated renders showing specific props/states. They serve as living documentation, visual tests, and a component workshop for exploring every edge case.

## Key Principles

1. **One State Per Story**: Each story captures ONE specific component state (Primary button, Disabled button, Loading button). Explicit, not comprehensive.

2. **Component Story Format (CSF)**: Default export = metadata, named exports = individual stories. Standard ES6 modules that are portable.

3. **Args-First**: Use `args` for props—enables Controls addon for interactive exploration and makes stories reusable as test fixtures.

## Best Practices

✅ **DO**:
- Create stories for all meaningful states
- Cover edge cases (empty data, long text, errors)
- Use Controls addon for interactive exploration
- Add play functions for interaction testing
- Group related components in story hierarchy
- Include accessibility addon checks

❌ **DON'T**:
- Create stories that need real backend data
- Skip error/loading/empty states
- Ignore mobile/responsive variants
- Write stories only for happy path
- Forget to document props via argTypes

## Code Patterns

### Recommended

```javascript
// Button.stories.js - Component Story Format
import { Button } from './Button';

export default {
  title: 'UI/Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger']
    },
    onClick: { action: 'clicked' }
  }
};

// Story: Primary state
export const Primary = {
  args: {
    variant: 'primary',
    children: 'Click me'
  }
};

// Story: Disabled state
export const Disabled = {
  args: {
    variant: 'primary',
    children: 'Cannot click',
    disabled: true
  }
};

// Story: Loading state
export const Loading = {
  args: {
    variant: 'primary',
    children: 'Submit',
    loading: true
  }
};

// Story: With interaction test
export const WithInteraction = {
  args: { ...Primary.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  }
};
```

### Edge Case Stories

```javascript
// Cover all edge cases
export const LongText = {
  args: {
    children: 'This is an extremely long button label that might overflow'
  }
};

export const IconOnly = {
  args: {
    children: <Icon name="search" />,
    'aria-label': 'Search'
  }
};

export const InLoadingState = {
  args: {
    loading: true,
    children: 'Saving...'
  }
};
```

### Avoid

```javascript
// ❌ WRONG - Story requires backend
export const WithRealData = {
  render: () => {
    const data = useFetch('/api/data');  // Don't do this!
    return <Component data={data} />;
  }
};

// ✅ CORRECT - Mock data in story
export const WithData = {
  args: {
    data: mockData  // Use mock data
  }
};
```

## Related Terminologies

- **Component** (UI) - Stories document components
- **Atom/Molecule/Organism** (UI) - Organize stories by atomic level
- **Props** (UI) - Args map to component props
- **Accessibility** (UI) - Stories enable a11y testing

## Quality Gates

- [ ] All meaningful states have stories
- [ ] Edge cases covered (error, empty, loading)
- [ ] Args used (not inline props)
- [ ] Play functions for interactions
- [ ] Accessible (a11y addon passes)
- [ ] Mobile/responsive variants included

**Source**: `/docs/ui/story.md`
