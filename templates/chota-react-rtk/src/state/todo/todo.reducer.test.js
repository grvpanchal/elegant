import todoReducer, { todoSlice } from './todo.reducer';
import initialState from './todo.initial';
import { createTodo, editTodo, updateTodo, toggleTodo, deleteTodo } from './todo.actions';

describe('todo reducer', () => {
  it('should return the initial state', () => {
    expect(todoReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle createTodo', () => {
    const previousState = { ...initialState, todoItems: [] };
    const nextState = todoReducer(previousState, createTodo('Test todo'));
    expect(nextState.todoItems).toHaveLength(1);
    expect(nextState.todoItems[0]).toEqual({
      text: 'Test todo',
      completed: false,
      id: expect.any(Number),
    });
  });

  it('should handle createTodo with multiple items', () => {
    const previousState = { ...initialState, todoItems: [] };
    const state1 = todoReducer(previousState, createTodo('First'));
    const state2 = todoReducer(state1, createTodo('Second'));
    expect(state2.todoItems).toHaveLength(2);
    expect(state2.todoItems[0].text).toBe('First');
    expect(state2.todoItems[1].text).toBe('Second');
  });

  it('should handle editTodo', () => {
    const todoItem = { id: 1, text: 'Edit me' };
    const nextState = todoReducer(initialState, editTodo(todoItem));
    expect(nextState.currentTodoItem).toEqual(todoItem);
  });

  it('should handle updateTodo', () => {
    const stateWithTodo = {
      ...initialState,
      todoItems: [{ id: 1, text: 'Old text', completed: false }],
      currentTodoItem: { id: 1, text: 'New text' },
    };
    const nextState = todoReducer(stateWithTodo, updateTodo({ id: 1, text: 'Updated' }));
    expect(nextState.todoItems[0].text).toBe('Updated');
    expect(nextState.currentTodoItem).toEqual(initialState.currentTodoItem);
  });

  it('should handle updateTodo with multiple todos (non-matching branch)', () => {
    const stateWithTodos = {
      ...initialState,
      todoItems: [
        { id: 1, text: 'First', completed: false },
        { id: 2, text: 'Second', completed: true },
      ],
      currentTodoItem: { id: 1, text: 'Updated First' },
    };
    const nextState = todoReducer(stateWithTodos, updateTodo({ id: 1, text: 'Updated First' }));
    expect(nextState.todoItems[0].text).toBe('Updated First');
    expect(nextState.todoItems[1].text).toBe('Second');
    expect(nextState.currentTodoItem).toEqual(initialState.currentTodoItem);
  });

  it('should handle toggleTodo', () => {
    const stateWithTodo = {
      ...initialState,
      todoItems: [{ id: 1, text: 'Todo', completed: false }],
    };
    const nextState = todoReducer(stateWithTodo, toggleTodo({ id: 1 }));
    expect(nextState.todoItems[0].completed).toBe(true);

    const toggledBackState = todoReducer(nextState, toggleTodo({ id: 1 }));
    expect(toggledBackState.todoItems[0].completed).toBe(false);
  });

  it('should handle toggleTodo with multiple todos (non-matching branch)', () => {
    const stateWithTodos = {
      ...initialState,
      todoItems: [
        { id: 1, text: 'First', completed: false },
        { id: 2, text: 'Second', completed: false },
      ],
    };
    const nextState = todoReducer(stateWithTodos, toggleTodo({ id: 1 }));
    expect(nextState.todoItems[0].completed).toBe(true);
    expect(nextState.todoItems[1].completed).toBe(false);
  });

  it('should handle deleteTodo', () => {
    const stateWithTodos = {
      ...initialState,
      todoItems: [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ],
      currentTodoItem: { id: 1, text: 'Todo 1' },
    };
    const nextState = todoReducer(stateWithTodos, deleteTodo(1));
    expect(nextState.todoItems).toHaveLength(1);
    expect(nextState.todoItems[0].id).toBe(2);
    expect(nextState.currentTodoItem).toEqual(initialState.currentTodoItem);
  });

  it('should handle deleteTodo with multiple todos (non-matching branch)', () => {
    const stateWithTodos = {
      ...initialState,
      todoItems: [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ],
      currentTodoItem: { id: 1, text: 'Todo 1' },
    };
    const nextState = todoReducer(stateWithTodos, deleteTodo(2));
    expect(nextState.todoItems).toHaveLength(1);
    expect(nextState.todoItems[0].id).toBe(1);
    expect(nextState.todoItems[0].text).toBe('Todo 1');
  });
});

describe('todo actions', () => {
  it('should create a createTodo action', () => {
    const action = createTodo('Learn Redux');
    expect(action.type).toBe(todoSlice.actions.createTodo.type);
    expect(action.payload).toBe('Learn Redux');
  });

  it('should create an editTodo action', () => {
    const payload = { id: 1, text: 'Edit' };
    const action = editTodo(payload);
    expect(action.type).toBe(todoSlice.actions.editTodo.type);
    expect(action.payload).toEqual(payload);
  });

  it('should create an updateTodo action', () => {
    const payload = { id: 1, text: 'Updated' };
    const action = updateTodo(payload);
    expect(action.type).toBe(todoSlice.actions.updateTodo.type);
    expect(action.payload).toEqual(payload);
  });

  it('should create a toggleTodo action', () => {
    const payload = { id: 1 };
    const action = toggleTodo(payload);
    expect(action.type).toBe(todoSlice.actions.toggleTodo.type);
    expect(action.payload).toEqual(payload);
  });

  it('should create a deleteTodo action', () => {
    const payload = 1;
    const action = deleteTodo(payload);
    expect(action.type).toBe(todoSlice.actions.deleteTodo.type);
    expect(action.payload).toBe(payload);
  });
});
