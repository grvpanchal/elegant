---
title: Reducers
layout: doc
slug: reducer
---

# Reducer

A reducer in state management is a pure function that takes the current state and an action as arguments, and returns a new state. Reducers are fundamental to managing state in libraries like Redux, but the concept is applicable to other state management solutions as well. It's particularly useful for handling CRUD (Create, Read, Update, Delete) operations in a predictable manner. 

Key characteristics of reducers:
1. They are pure functions, meaning they don't modify the existing state or cause side effects.
2. They always return a new state object.
3. They determine how the state should change in response to an action.

Here's an example of a reducer that manages a list of todos, demonstrating CRUD operations:

```javascript
const initialState = {
  todos: []
};

function todoReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload.id ? {...todo, ...action.payload} : todo
        )
      };
    
    case 'FETCH_TODOS':
      return {
        ...state,
        todos: action.payload
      };
    
    default:
      return state;
  }
}
```

In this example:

1. CREATE (ADD_TODO): Adds a new todo to the list.
2. READ (FETCH_TODOS): Replaces the entire todos list with fetched data.
3. UPDATE (UPDATE_TODO): Updates a specific todo in the list.
4. DELETE (DELETE_TODO): Removes a specific todo from the list.


This reducer demonstrates how to handle CRUD operations in a predictable and immutable way, which is a key principle in state management with libraries like Redux.