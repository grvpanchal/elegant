---
name: server-container
description: Container/presentational component split — "smart" containers connect to the store, fetch data, and orchestrate loading/error/empty states; "dumb" children just render props. Use when extracting data logic from views, introducing custom hooks, or reviewing `*Container` components.
when_to_use: Splitting a component into container + presentational pair; connecting a view to Redux/NgRx/Pinia; extracting reusable data logic into a custom hook; reviewing whether a presentational component accidentally imports store code.
paths:
  - "**/containers/**/*.{jsx,tsx,vue}"
  - "**/*Container*.{jsx,tsx,vue}"
---

# Container

## What is a Container Component?

Containers are "smart" components that handle data fetching, state management, and business logic. They wrap "dumb" presentational components, connecting them to data sources (Redux, APIs).

## Key Principles

1. **Smart vs Dumb Separation**: Containers know about Redux, API calls, business logic. Presentational components only know about props and rendering.

2. **Data Orchestration**: Containers fetch data, manage loading/error states, transform data, and pass to presentational components.

3. **Reusability Through Separation**: Presentational components become reusable across different data sources; containers can swap presentational components.

## Best Practices

✅ **DO**:
- Connect to Redux store in containers
- Handle loading, error, empty states
- Transform API data to component props
- Keep containers focused on one feature
- Use custom hooks to extract container logic

❌ **DON'T**:
- Put data fetching in presentational components
- Mix styling concerns in containers
- Create containers that are too large (split them)
- Duplicate logic across similar containers (extract hooks)

## Code Patterns

### Container/Presentational Pattern

The container is the **connection point**: it reads the store, builds a `data` value and an `events` object, and passes them to a purely presentational organism. The organism (`TodoList`) never connects to state directly — state → container → organism.

```jsx
// TodoListContainer.jsx - SMART (Container), connects state to the organism
import TodoList from '../ui/organisms/TodoList/TodoList.component';  // DUMB organism
import { useDispatch, useSelector } from 'react-redux';
import { createTodo, deleteTodo, readTodo, toggleTodo } from '../state/todo/todo.actions';
import { getSelectedFilter } from '../state/filters/filters.selectors';
import { getVisibleTodos } from '../state/todo/todo.selectors';
import { useEffect } from 'react';

export default function TodoListContainer() {
  const dispatch = useDispatch();
  const selectedFilter = useSelector(getSelectedFilter);
  const todoData = useSelector((state) =>
    getVisibleTodos(state.todo, selectedFilter.id)
  );

  useEffect(() => {
    dispatch(readTodo());
  }, [dispatch]);

  const events = {
    onTodoCreate: (payload) => dispatch(createTodo(payload)),
    onTodoToggleUpdate: (id) => dispatch(toggleTodo(id)),
    onTodoDelete: (payload) => dispatch(deleteTodo(payload)),
  };

  // Container passes `data` + `events` to the presentational organism
  return <TodoList todoData={todoData} events={events} />;
}

// TodoList.component.jsx - DUMB (Presentational organism): props in, events out, no store
const TodoList = ({ todoData, events }) => (
  <ul>
    {todoData.items.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={() => events.onTodoToggleUpdate(todo.id)}
      />
    ))}
  </ul>
);
```

The same shape applies with Zustand — only the store-read changes (`useStore` instead of `useSelector`/`useDispatch`), while the `data` + `events` hand-off to the organism is identical:

```jsx
// TodoListContainer.jsx (Zustand variant)
import useStore from '../state';

export default function TodoListContainer() {
  const selectedFilter = useStore(getSelectedFilter);
  const todoState = useStore((state) => state.todo);
  const todoData = getVisibleTodos(todoState, selectedFilter.id);

  const readTodo = useStore((state) => state.readTodo);
  const toggleTodo = useStore((state) => state.toggleTodo);

  useEffect(() => { readTodo(); }, [readTodo]);

  const events = { onTodoToggleUpdate: (id) => toggleTodo(id) };
  return <TodoList todoData={todoData} events={events} />;
}
```

A container can also be side-effect only — reading state and returning `null` (e.g. `ConfigContainer.js` toggles the `dark` body class from `state.config.theme`).

### Modern Hook-Based Pattern

```jsx
// Custom hook extracts container logic
function useTodos() {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector(state => state.todos);
  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  const toggleTodo = (id) => dispatch(toggleTodoAction(id));
  
  return { todos, loading, error, toggleTodo };
}

// Container becomes thin wrapper
const TodoListContainer = () => {
  const { todos, loading, error, toggleTodo } = useTodos();
  
  return (
    <TodoList
      todos={todos}
      loading={loading}
      error={error}
      onToggle={toggleTodo}
    />
  );
};
```

### Testing Benefits

```jsx
// Presentational organism easy to test (Vitest)
test('TodoList renders items', () => {
  const todoData = { items: [{ id: 1, text: 'Test', completed: false }] };

  render(<TodoList todoData={todoData} events={{ onTodoToggleUpdate: vi.fn() }} />);

  expect(screen.getByText('Test')).toBeInTheDocument();
});

// No store mocking needed for presentational organisms!
```

## Related Terminologies

- **Organism** (UI) - Organisms often become containers
- **Store** (State) - Containers connect to store
- **Component** (UI) - Presentational components
- **Selectors** (State) - Containers use selectors

## Quality Gates

- [ ] Data logic in container, rendering in presentational
- [ ] Loading/error/empty states handled
- [ ] Presentational components have no store connection
- [ ] Logic extracted to custom hooks when reusable
- [ ] Clear naming convention (*Container suffix)

**Source**: `/docs/server/container.md`
