---
title: Actions
layout: doc
slug: actions
---

# Actions

Actions in frontend state management are plain JavaScript objects that describe changes to be made to the application's state. They are the primary way to interact with the store and trigger state updates. Here are the key aspects of actions:

## Characteristics of Actions

1. **Plain Objects**: Actions are typically simple JavaScript objects.
2. **Type Property**: Each action must have a 'type' property that describes the action.
3. **Payload**: Actions often include additional data (payload) needed for the state update.

## Purpose of Actions

- Describe state changes in a declarative way
- Provide a standardized interface for updating state
- Enable tracking and logging of all state changes

## Example Action

```javascript
{
  type: 'ADD_TODO',
  payload: {
    id: 1,
    text: 'Buy groceries',
    completed: false
  }
}
```

## Action Creators

Functions that create and return action objects, often used to encapsulate action creation logic:

```javascript
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    payload: {
      id: nextTodoId++,
      text,
      completed: false
    }
  };
}
```

## Dispatching Actions

Actions are typically dispatched to the store using a dispatch function:

```javascript
store.dispatch(addTodo('Buy milk'));
```

By using actions, developers can maintain a clear and predictable data flow in their applications, making it easier to track state changes and debug issues.