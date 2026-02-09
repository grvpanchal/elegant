---
description: Guidance for Atomic Design - hierarchical component methodology
name: Atomic Design - UI
applyTo: |
  **/ui/**/*.{jsx,tsx,vue,js,ts}
  **/components/**/*.{jsx,tsx,vue,js,ts}
---

# Atomic Design Instructions

## What is Atomic Design?

Atomic Design is a methodology for creating UI component systems with five hierarchical levels: Atoms → Molecules → Organisms → Templates → Pages. It's a mental model for discussing and organizing component modularity.

## Key Principles

1. **Non-Linear Process**: Don't build all atoms first—work across levels simultaneously. The hierarchy is a classification system, not a workflow.

2. **Shared Vocabulary**: Use chemistry metaphor for team communication: "This card header is a molecule (avatar atom + title atom + menu atom)."

3. **Both Forest and Trees**: Drill down from pages to atoms, or build up from atoms to pages. See the whole system and individual pieces.

## Best Practices

✅ **DO**:
- Organize components by atomic level in folder structure
- Use consistent naming: `atoms/Button`, `molecules/SearchBar`, `organisms/Header`
- Build molecules from imported atoms (not recreating)
- Keep each level focused on its responsibility
- Document component level in file header

❌ **DON'T**:
- Rigidly follow "atoms first, then molecules" workflow
- Debate endlessly whether something is molecule or organism
- Skip levels—don't put business logic in atoms
- Create atoms that are too specific to one use case
- Ignore the hierarchy entirely

## Hierarchy Reference

```
ATOMS        → Button, Input, Icon, Label, Image
  ↓            Single purpose, no children components
MOLECULES    → SearchBar, FormField, CardHeader, NavLink
  ↓            Composed of atoms, single function
ORGANISMS    → Header, ProductGrid, CommentSection, Footer
  ↓            Complex sections, may connect to state
TEMPLATES    → ProductPageTemplate, BlogTemplate, DashboardLayout
  ↓            Page wireframes, content slots
PAGES        → iPhone15Page, BlogPost123, UserDashboard
               Real content filling templates
```

## Code Patterns

### Folder Structure

```
ui/
├── atoms/
│   ├── Button/
│   ├── Input/
│   └── Icon/
├── molecules/
│   ├── SearchBar/
│   ├── FormField/
│   └── CardHeader/
├── organisms/
│   ├── Header/
│   ├── ProductGrid/
│   └── Footer/
├── templates/
│   ├── ProductTemplate/
│   └── BlogTemplate/
└── theme.css
```

### Composition Pattern

```jsx
// Organism composed of molecules and atoms
import Logo from '../atoms/Logo';
import SearchBar from '../molecules/SearchBar';
import Navigation from '../molecules/Navigation';
import UserMenu from '../molecules/UserMenu';

const Header = () => (
  <header className="header">
    <Logo />
    <Navigation />
    <SearchBar />
    <UserMenu />
  </header>
);
```

## Related Terminologies

- **Atom** (UI) - Smallest building blocks
- **Molecule** (UI) - Functional atom groups
- **Organism** (UI) - Complex feature sections
- **Template** (UI) - Page wireframe layouts
- **Page** (Server) - Templates with real data

## Quality Gates

- [ ] Components organized by atomic level
- [ ] Clear hierarchy in composition
- [ ] Each level has appropriate responsibility
- [ ] No logic skipping levels (atoms don't fetch data)
- [ ] Team understands vocabulary

**Source**: `/docs/ui/atomic-design.md`
