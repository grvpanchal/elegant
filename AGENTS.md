# Elegant - Agent Guidelines

This document provides guidelines for agentic coding tools operating in this repository.

## Project Overview
Elegant is a CLI tool that generates front-end boilerplate applications using atomic design principles. It supports React (Redux, Redux Toolkit, Redux Saga), Angular (NgRx), Vue (Pinia), and Web Components.

## Build/Lint/Test Commands

### Main Package (CLI Tool)
- **Build**: N/A - This is a Node.js CLI tool
- **Lint**: N/A - No linting configured for the main package  
- **Test**: `npm test` - Currently not implemented, placeholder command

### Generated Templates - React (CRA-based: chota-react-redux, chota-react-saga, chota-react-rtk)
- **Start dev server**: `npm start` or `npm run start`
- **Build production**: `npm run build`
- **Run tests**: `npm test` (React with Redux Saga uses coverage by default: `react-scripts test --coverage`)
- **Storybook dev**: `npm run storybook`
- **Storybook build**: `npm run build-storybook`

### Generated Templates - Vue 3 (chota-vue-pinia)
- **Start dev server**: `npm start`, `npm run start`, or `npm run dev` (all alias to Vite)
- **Build production**: `npm run build`
- **Run tests**: `npm test` (runs Cypress e2e: `cypress run`)
- **Type check**: `npm run type-check` (vue-tsc --noEmit)
- **Storybook dev**: `npm run storybook`
- **Storybook build**: `npm run build-storybook`

### Generated Templates - Angular (chota-angular-ngrx)
- **Start dev server**: `npm start` or `ng serve`
- **Build production**: `npm run build` or `ng build`
- **Run unit tests**: `npm test` or `ng test` (uses Karma)
- **Lint code**: `npm run lint` or `ng lint`
- **Storybook dev**: `npm run storybook`
- **Storybook build**: `npm run build-storybook`

### Generated Templates - Web Components (chota-wc-saga)
- **Build production**: Check package.json for specific build command
- **Run tests**: Uses Web Test Runner (`web-test-runner`), config at `web-test-runner.config.mjs`
- **Storybook dev**: `npm run storybook`
- **Storybook build**: `npm run build-storybook`

## Code Style Guidelines

### Imports
- Use ES6 module syntax (import/export)
- Import order: Built-in modules first, then third-party, then internal/local imports
- Group related imports from the same library on one line when possible
- Relative paths use `./` and `../` prefixes

### Formatting
- **React templates**: Uses Create React App defaults (ESLint + Jest)
- **Angular templates**: Uses Angular CLI defaults with TSLint/ESLint
- **Vue templates**: Standard Vue 3 SFC format (.vue files)
- **Web Components**: Lit-based custom elements with component.js, style.js, stories.js separation
- No specific Prettier configuration found; rely on framework defaults

### Typescript/Type Usage
- Angular: Full TypeScript with strict typing in `tsconfig.app.json`
- Vue: TypeScript support via `vue-tsc`, config in `tsconfig.config.json`
- React templates: JavaScript with PropTypes for runtime type checking
- Web Components: JavaScript with JSDoc type hints in `.type.js` files

### Naming Conventions
- **Files**: PascalCase for components (e.g., `Button.component.ts`, `TodoItem.component.vue`)
- **Types/Interfaces**: PascalCase (e.g., `TodoItem.type.ts`)
- **Functions/Variables**: camelCase throughout all templates
- **Constants**: UPPER_SNAKE_CASE in Redux state files (e.g., `LOAD_TODOS_SUCCESS`)
- **Stories**: `.stories.js/ts` extension for Storybook stories
- **Styles**: `.style.css` or embedded `<style>` tags

### Error Handling
- Angular NgRx: Actions follow request/success/fail pattern (`loadTodosRequest`, `loadTodosSuccess`, `loadTodosFail`)
- Redux templates: Saga patterns handle async errors via try/catch in saga files
- State management stores error messages for UI display
- No centralized error boundary pattern observed; rely on framework error handling

### Project Structure (Atomic Design)
All generated templates follow atomic design:
```
src/
  ui/           # Presentational components
    atoms/      # Basic building blocks (Button, Input)
    molecules/  # Groups of atoms (TodoItems, FilterGroup)  
    organisms/  # Complex UI sections (TodoList, SiteHeader)
    templates/  # Layout compositions (Layout)
    skeletons/  # Loading placeholders
  containers/   # Data-aware components
  state/        # Redux/NgRx/Pinia stores and sagas/effects
  utils/        # Helper functions and providers
  pages/        # Route-level page components
```

### Testing Patterns
- React: Jest + React Testing Library (`@testing-library/react`)
- Angular: Jasmine + Karma (`karma-jasmine`, `karma-coverage`)
- Vue: Cypress for e2e testing
- Web Components: Web Test Runner with Lit's testing utilities (`@open-wc/testing`)
- Storybook stories used as living documentation and visual regression tests

### State Management Patterns
- **Redux Toolkit**: Slices with `createSlice`, RTK Query for data fetching
- **Redux + Saga**: Separate action, reducer, saga files; effects in `rootSagas.js`
- **NgRx**: Feature slices with actions, reducers, selectors, effects following official NgRx patterns
- **Pinia**: Composables using Vue 3 Composition API with Pinia stores

### Storybook Integration
All templates include Storybook v7/v8:
- Preview configuration in `.storybook/preview.js`
- Component stories in `*.stories.js` or `*.stories.ts`
- Use `-p 6006` for default port
- Addons: essentials, interactions, links, onboarding, blocks

### Environment Configuration
- Angular: Separate environments (`environment.ts`, `environment.prod.ts`)
- React/Vue/Web Components: Use process.env or Vite env files
- Plain `npm install` works across every template; `--legacy-peer-deps` is no longer needed

## Cursor/Copilot Rules
No existing `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` files were found in this repository.
