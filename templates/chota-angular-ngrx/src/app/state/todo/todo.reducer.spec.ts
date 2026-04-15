import { todoReducer } from './todo.reducer';
import * as TodoActions from './todo.actions';
import initialTodoState, { TodoState } from './todo.initial';

describe('TodoReducer', () => {
  it('should return the default state', () => {
    const action = { type: 'UNKNOWN' } as any;
    const state = todoReducer(undefined, action);
    expect(state).toEqual(initialTodoState);
  });

  describe('loadTodosRequest', () => {
    it('should set isContentLoading to true and clear error', () => {
      const state = { ...initialTodoState, isContentLoading: false, error: 'some error' };
      const action = TodoActions.loadTodosRequest();
      const result = todoReducer(state, action);
      expect(result.isContentLoading).toBe(true);
      expect(result.error).toBe('');
    });
  });

  describe('loadTodosSuccess', () => {
    it('should set isContentLoading to false', () => {
      const state = { ...initialTodoState, isContentLoading: true };
      const action = TodoActions.loadTodosSuccess();
      const result = todoReducer(state, action);
      expect(result.isContentLoading).toBe(false);
    });
  });

  describe('loadTodosFail', () => {
    it('should set isContentLoading to false and set error', () => {
      const state = { ...initialTodoState, isContentLoading: true, error: '' };
      const action = TodoActions.loadTodosFail({ error: 'Failed to load' });
      const result = todoReducer(state, action);
      expect(result.isContentLoading).toBe(false);
      expect(result.error).toBe('Failed to load');
    });
  });

  describe('loadTodos', () => {
    it('should set todoItems', () => {
      const todos = [
        { id: 1, text: 'Test 1', completed: false },
        { id: 2, text: 'Test 2', completed: true },
      ];
      const action = TodoActions.loadTodos({ todos });
      const result = todoReducer(initialTodoState, action);
      expect(result.todoItems).toEqual(todos);
    });
  });

  describe('addTodoRequest', () => {
    it('should set isActionLoading to true and clear error', () => {
      const state = { ...initialTodoState, isActionLoading: false, error: 'some error' };
      const action = TodoActions.addTodoRequest({ text: 'New todo' });
      const result = todoReducer(state, action);
      expect(result.isActionLoading).toBe(true);
      expect(result.error).toBe('');
    });
  });

  describe('addTodoSuccess', () => {
    it('should set isActionLoading to false', () => {
      const state = { ...initialTodoState, isActionLoading: true };
      const action = TodoActions.addTodoSuccess();
      const result = todoReducer(state, action);
      expect(result.isActionLoading).toBe(false);
    });
  });

  describe('addTodoFail', () => {
    it('should set isActionLoading to false and set error', () => {
      const state = { ...initialTodoState, isActionLoading: true, error: '' };
      const action = TodoActions.addTodoFail({ error: 'Failed to add' });
      const result = todoReducer(state, action);
      expect(result.isActionLoading).toBe(false);
      expect(result.error).toBe('Failed to add');
    });
  });

  describe('updateTodoRequest', () => {
    it('should update the todo text, set isActionLoading, and reset currentTodoItem', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        isActionLoading: false,
        error: 'some error',
        todoItems: [
          { id: 1, text: 'Old text', completed: false },
          { id: 2, text: 'Other todo', completed: true },
        ],
        currentTodoItem: { id: 1, text: 'Old text' },
      };
      const action = TodoActions.updateTodoRequest({ id: 1, text: 'Updated text' });
      const result = todoReducer(initialState, action);

      expect(result.isActionLoading).toBe(true);
      expect(result.error).toBe('');
      expect(result.todoItems[0].text).toBe('Updated text');
      expect(result.todoItems[1].text).toBe('Other todo');
      expect(result.currentTodoItem).toEqual({ id: null, text: '' });
    });

    it('should not affect todos with different ids', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        todoItems: [
          { id: 1, text: 'Todo 1', completed: false },
          { id: 2, text: 'Todo 2', completed: false },
        ],
      };
      const action = TodoActions.updateTodoRequest({ id: 1, text: 'Updated' });
      const result = todoReducer(initialState, action);
      expect(result.todoItems[1].text).toBe('Todo 2');
    });
  });

  describe('updateTodoSuccess', () => {
    it('should set isActionLoading to false', () => {
      const state = { ...initialTodoState, isActionLoading: true };
      const action = TodoActions.updateTodoSuccess();
      const result = todoReducer(state, action);
      expect(result.isActionLoading).toBe(false);
    });
  });

  describe('updateTodoFail', () => {
    it('should set isActionLoading to false and set error', () => {
      const state = { ...initialTodoState, isActionLoading: true, error: '' };
      const action = TodoActions.updateTodoFail({ error: 'Failed to update' });
      const result = todoReducer(state, action);
      expect(result.isActionLoading).toBe(false);
      expect(result.error).toBe('Failed to update');
    });
  });

  describe('deleteTodoRequest', () => {
    it('should remove the todo, set isActionLoading, and reset currentTodoItem', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        isActionLoading: false,
        error: 'some error',
        todoItems: [
          { id: 1, text: 'Todo 1', completed: false },
          { id: 2, text: 'Todo 2', completed: true },
        ],
        currentTodoItem: { id: 1, text: 'Todo 1' },
      };
      const action = TodoActions.deleteTodoRequest({ id: 1 });
      const result = todoReducer(initialState, action);

      expect(result.isActionLoading).toBe(true);
      expect(result.error).toBe('');
      expect(result.todoItems.length).toBe(1);
      expect(result.todoItems[0].id).toBe(2);
      expect(result.currentTodoItem).toEqual({ id: null, text: '' });
    });

    it('should keep todos with different ids', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        todoItems: [
          { id: 1, text: 'Todo 1', completed: false },
          { id: 2, text: 'Todo 2', completed: false },
        ],
      };
      const action = TodoActions.deleteTodoRequest({ id: 1 });
      const result = todoReducer(initialState, action);
      expect(result.todoItems.length).toBe(1);
      expect(result.todoItems[0].id).toBe(2);
    });
  });

  describe('deleteTodoFail', () => {
    it('should set isActionLoading to false and set error', () => {
      const state = { ...initialTodoState, isActionLoading: true, error: '' };
      const action = TodoActions.deleteTodoFail({ error: 'Failed to delete' });
      const result = todoReducer(state, action);
      expect(result.isActionLoading).toBe(false);
      expect(result.error).toBe('Failed to delete');
    });
  });

  describe('createTodo', () => {
    it('should add a new todo with completed false and set isActionLoading to false', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        isActionLoading: true,
        todoItems: [{ id: 1, text: 'Existing', completed: true }],
      };
      const action = TodoActions.createTodo({ id: 2, text: 'New todo' });
      const result = todoReducer(initialState, action);

      expect(result.isActionLoading).toBe(false);
      expect(result.todoItems.length).toBe(2);
      expect(result.todoItems[1]).toEqual({ id: 2, text: 'New todo', completed: false });
    });
  });

  describe('editTodo', () => {
    it('should set currentTodoItem', () => {
      const action = TodoActions.editTodo({ id: 1, text: 'Editing this' });
      const result = todoReducer(initialTodoState, action);
      expect(result.currentTodoItem).toEqual({ id: 1, text: 'Editing this' });
    });
  });

  describe('updateTodo', () => {
    it('should update the todo, reset isActionLoading, and clear currentTodoItem', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        isActionLoading: true,
        todoItems: [
          { id: 1, text: 'Old', completed: false },
          { id: 2, text: 'Other', completed: true },
        ],
        currentTodoItem: { id: 1, text: 'Old' },
      };
      const action = TodoActions.updateTodo({ id: 1, text: 'New text' });
      const result = todoReducer(initialState, action);

      expect(result.isActionLoading).toBe(false);
      expect(result.todoItems[0].text).toBe('New text');
      expect(result.todoItems[1].text).toBe('Other');
      expect(result.currentTodoItem).toEqual({ id: null, text: '' });
    });
  });

  describe('toggleTodo', () => {
    it('should toggle the completed status of the matching todo', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        todoItems: [
          { id: 1, text: 'Todo 1', completed: false },
          { id: 2, text: 'Todo 2', completed: true },
        ],
      };
      const action = TodoActions.toggleTodo({ id: 1 });
      const result = todoReducer(initialState, action);

      expect(result.todoItems[0].completed).toBe(true);
      expect(result.todoItems[1].completed).toBe(true);
    });

    it('should toggle from true to false', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        todoItems: [{ id: 1, text: 'Todo 1', completed: true }],
      };
      const action = TodoActions.toggleTodo({ id: 1 });
      const result = todoReducer(initialState, action);
      expect(result.todoItems[0].completed).toBe(false);
    });

    it('should not affect todos with different ids', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        todoItems: [
          { id: 1, text: 'Todo 1', completed: false },
          { id: 2, text: 'Todo 2', completed: false },
        ],
      };
      const action = TodoActions.toggleTodo({ id: 1 });
      const result = todoReducer(initialState, action);
      expect(result.todoItems[1].completed).toBe(false);
    });
  });

  describe('deleteTodo', () => {
    it('should remove the todo, set isActionLoading to false, and reset currentTodoItem', () => {
      const initialState: TodoState = {
        ...initialTodoState,
        isActionLoading: true,
        todoItems: [
          { id: 1, text: 'Todo 1', completed: false },
          { id: 2, text: 'Todo 2', completed: true },
        ],
        currentTodoItem: { id: 1, text: 'Todo 1' },
      };
      const action = TodoActions.deleteTodo({ id: 1 });
      const result = todoReducer(initialState, action);

      expect(result.isActionLoading).toBe(false);
      expect(result.todoItems.length).toBe(1);
      expect(result.todoItems[0].id).toBe(2);
      expect(result.currentTodoItem).toEqual({ id: null, text: '' });
    });
  });
});
