---
title: "Containers: where data meets the UI"
layout: lesson
course: server-layer
slug: container
term: server/container
skill: server-container
practice: presentational-vs-container
description: "Keep store reads, fetching and business rules in a thin container, so every component an agent writes below it stays props in, events out."
insight: "A container is the brain and the presentational component is the beauty: the container knows the store, the API and the business rules, and the component it renders knows only props. When an agent puts a fetch and a page of JSX in one file, it has written a component nobody can reuse, test or put in Storybook."
---

## The split, as the templates ship it

Every `chota-*` template has a `src/containers` folder, and the files in it are
short. `templates/chota-react-redux/src/containers/TodoListContainer.jsx` reads
two values with `useSelector` — the selected filter, and the visible todos from
`getVisibleTodos` — wraps five dispatches in an `events` object, and returns one
line: `<TodoList todoData={todoData} events={events} />`. The Vue version,
`templates/chota-vue-pinia/src/containers/TodoListContainer.vue`, swaps the
selectors for two Pinia stores and keeps exactly the same `todoData` + `events`
hand-off. The `TodoList` organism underneath never imports the store.

State flows container to organism, in that direction only. The page above them,
`src/pages/index.jsx` in the React template, does even less: it places
`SiteHeaderContainer`, `TodoListContainer` and `TodoFiltersContainer` inside the
`Layout` template.

That is the whole definition. A container fetches, connects to the store,
transforms API data into props and owns the loading, error and empty states. A
presentational component renders the props it is given and calls back when the
user does something.

## What an agent gets wrong

Ask an agent for "a user list page" and it will usually make all three of the
mistakes the [Container doc]({{ '/server/container.html' | relative_url }}) names:

- **Mixing data fetching with rendering.** A `useEffect` calling `fetch` sits
  beside eighty lines of JSX, so the component cannot be rendered in a story
  without mocking the network.
- **Passing too many individual props.** Ten loose props instead of one grouped
  data object and one `events` object.
- **Containers rendering too much UI.** The "thin" layer grew markup, so now it
  needs visual review as well as logic review.

The skill adds the rules that catch the rest: a container does not carry
styling, a container that grows too large is split, and logic duplicated across
similar containers is extracted into a custom hook instead of copied. Hooks such
as `useTodos()` can replace a container component, but the separation survives
the refactor: the code that fetches is not the code that renders.

## Brief it, then review it

```text
Create UserListContainer in src/containers. It reads users and the
request status from the store, dispatches the load on mount, and
renders the UserList organism with two props: userData (items,
isLoading, error) and events (onUserSelect). UserList must not
import the store or call fetch.
```

Then check what came back:

1. Does any file under `src/ui/` import from `src/state/` or call `fetch`? That
   is a container in disguise.
2. Does the container return a single presentational component, with no
   styling of its own?
3. Are loading, error and empty decided in the container and passed down as
   data?
4. Does the name carry the `Container` suffix, and could the presentational
   component render in Storybook from hardcoded props alone?
