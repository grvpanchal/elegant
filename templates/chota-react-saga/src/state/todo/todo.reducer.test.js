import todo from './todo.reducer';
import initialTodoState from './todo.initial';
import {
  CREATE_TODO,
  CREATE_TODO_SUCCESS,
  CREATE_TODO_ERROR,
  DELETE_TODO,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_ERROR,
  EDIT_TODO,
  READ_TODO,
  READ_TODO_SUCCESS,
  READ_TODO_ERROR,
  TOGGLE_TODO,
  TOGGLE_TODO_SUCCESS,
  TOGGLE_TODO_ERROR,
  UPDATE_TODO,
  UPDATE_TODO_SUCCESS,
  UPDATE_TODO_ERROR,
} from './todo.type';

describe('Todo Reducer', () => {
  it('returns the initial state when action type is not recognized', () => {
    const initialState = initialTodoState;
    const action = { type: 'UNKNOWN_ACTION' };

    const result = todo(initialState, action);
    expect(result).toBe(initialState);
  });

  it('returns initial state when no state is provided', () => {
    const action = { type: CREATE_TODO, payload: { id: '1', text: 'Test' } };
    const result = todo(undefined, action);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  describe('READ_TODO actions', () => {
    it('handles READ_TODO by setting loading states', () => {
      const action = { type: READ_TODO };
      const result = todo(initialTodoState, action);
      expect(result.isLoading).toBe(true);
      expect(result.isContentLoading).toBe(true);
    });

    it('handles READ_TODO_SUCCESS by setting data', () => {
      const payload = [{ id: 1, text: 'Test', completed: false }];
      const action = { type: READ_TODO_SUCCESS, payload };
      const result = todo(initialTodoState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isContentLoading).toBe(false);
      expect(result.todoItems).toEqual(payload);
    });

    it('handles READ_TODO_ERROR by setting error', () => {
      const action = { type: READ_TODO_ERROR, error: 'Failed to load' };
      const result = todo(initialTodoState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isContentLoading).toBe(false);
      expect(result.error).toBe('Failed to load');
    });
  });

  describe('CREATE_TODO actions', () => {
    it('handles CREATE_TODO by setting loading and current item', () => {
      const payload = { id: '1', text: 'New Todo', completed: false };
      const action = { type: CREATE_TODO, payload };
      const result = todo(initialTodoState, action);
      expect(result.isLoading).toBe(true);
      expect(result.isActionLoading).toBe(true);
      expect(result.currentTodoItem).toEqual(payload);
    });

    it('handles CREATE_TODO_SUCCESS by adding todo and resetting loading', () => {
      const payload = { id: 1, text: 'New Todo' };
      const action = { type: CREATE_TODO_SUCCESS, payload };
      const result = todo(initialTodoState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isActionLoading).toBe(false);
      expect(result.todoItems).toHaveLength(1);
      expect(result.todoItems[0]).toEqual({
        id: 1,
        text: 'New Todo',
        completed: false,
      });
      expect(result.currentTodoItem).toEqual(initialTodoState.currentTodoItem);
    });

    it('handles CREATE_TODO_SUCCESS with existing todos', () => {
      const stateWithTodo = {
        ...initialTodoState,
        todoItems: [{ id: 1, text: 'Existing', completed: false }],
      };
      const payload = { id: 2, text: 'New Todo' };
      const action = { type: CREATE_TODO_SUCCESS, payload };
      const result = todo(stateWithTodo, action);
      expect(result.todoItems).toHaveLength(2);
      expect(result.todoItems[1].text).toBe('New Todo');
    });

    it('handles CREATE_TODO_ERROR by setting error and resetting loading', () => {
      const action = { type: CREATE_TODO_ERROR, error: 'Failed to create' };
      const result = todo(initialTodoState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isActionLoading).toBe(false);
      expect(result.error).toBe('Failed to create');
      expect(result.currentTodoItem).toEqual(initialTodoState.currentTodoItem);
    });
  });

  describe('EDIT_TODO action', () => {
    it('updates the currentTodoItem with new values', () => {
      const action = { type: EDIT_TODO, payload: { id: '1', text: 'Editing Todo' } };
      const result = todo(initialTodoState, action);
      expect(result.currentTodoItem.id).toBe('1');
      expect(result.currentTodoItem.text).toBe('Editing Todo');
    });

    it('preserves other state properties when editing', () => {
      const action = { type: EDIT_TODO, payload: { id: '1', text: 'Editing Todo' } };
      const result = todo(initialTodoState, action);
      expect(result.isLoading).toBe(false);
      expect(result.todoItems.length).toBe(0);
    });
  });

  describe('UPDATE_TODO actions', () => {
    it('handles UPDATE_TODO by updating text and setting loading', () => {
      const stateWithTodo = {
        ...initialTodoState,
        todoItems: [{ id: '1', text: 'Old Text', completed: false }],
      };
      const action = { type: UPDATE_TODO, payload: { id: '1', text: 'New Text' } };
      const result = todo(stateWithTodo, action);
      expect(result.todoItems[0].text).toBe('New Text');
      expect(result.isActionLoading).toBe(true);
      expect(result.currentTodoItem).toEqual({ id: '1', text: 'New Text' });
    });

    it('handles UPDATE_TODO with non-matching todos', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'First', completed: false },
          { id: '2', text: 'Second', completed: true },
        ],
      };
      const action = { type: UPDATE_TODO, payload: { id: '1', text: 'Updated First' } };
      const result = todo(stateWithTodos, action);
      expect(result.todoItems[0].text).toBe('Updated First');
      expect(result.todoItems[1].text).toBe('Second');
    });

    it('handles UPDATE_TODO_SUCCESS by resetting loading and current item', () => {
      const state = {
        ...initialTodoState,
        isActionLoading: true,
        currentTodoItem: { id: '1', text: 'Editing' },
      };
      const action = { type: UPDATE_TODO_SUCCESS, payload: { id: '1', text: 'Updated' } };
      const result = todo(state, action);
      expect(result.isActionLoading).toBe(false);
      expect(result.currentTodoItem).toEqual(initialTodoState.currentTodoItem);
    });

    it('handles UPDATE_TODO_ERROR by setting error and resetting', () => {
      const state = {
        ...initialTodoState,
        isActionLoading: true,
        currentTodoItem: { id: '1', text: 'Editing' },
      };
      const action = { type: UPDATE_TODO_ERROR, error: 'Update failed' };
      const result = todo(state, action);
      expect(result.error).toBe('Update failed');
      expect(result.isActionLoading).toBe(false);
      expect(result.currentTodoItem).toEqual(initialTodoState.currentTodoItem);
    });
  });

  describe('TOGGLE_TODO actions', () => {
    it('handles TOGGLE_TODO by toggling completed status', () => {
      const stateWithTodo = {
        ...initialTodoState,
        todoItems: [{ id: '1', text: 'Test Todo', completed: false }],
      };
      const action = { type: TOGGLE_TODO, payload: { id: '1' } };
      const result = todo(stateWithTodo, action);
      expect(result.todoItems[0].completed).toBe(true);
      expect(result.previousStateTodoItems).toEqual(stateWithTodo.todoItems);
    });

    it('handles TOGGLE_TODO with multiple todos', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Todo 1', completed: false },
          { id: '2', text: 'Todo 2', completed: true },
        ],
      };
      const action = { type: TOGGLE_TODO, payload: { id: '1' } };
      const result = todo(stateWithTodos, action);
      expect(result.todoItems[0].completed).toBe(true);
      expect(result.todoItems[1].completed).toBe(true);
    });

    it('handles TOGGLE_TODO_SUCCESS by clearing previous state', () => {
      const state = {
        ...initialTodoState,
        previousStateTodoItems: [{ id: '1', text: 'Test', completed: false }],
        isLoading: true,
      };
      const action = { type: TOGGLE_TODO_SUCCESS };
      const result = todo(state, action);
      expect(result.previousStateTodoItems).toBeUndefined();
      expect(result.isLoading).toBe(false);
    });

    it('handles TOGGLE_TODO_ERROR by restoring previous state', () => {
      const previousItems = [{ id: '1', text: 'Test', completed: false }];
      const state = {
        ...initialTodoState,
        previousStateTodoItems: previousItems,
        isLoading: true,
      };
      const action = { type: TOGGLE_TODO_ERROR, payload: previousItems, error: 'Toggle failed' };
      const result = todo(state, action);
      expect(result.previousStateTodoItems).toBeUndefined();
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Toggle failed');
      expect(result.todoItems).toEqual(previousItems);
    });
  });

  describe('DELETE_TODO actions', () => {
    it('handles DELETE_TODO by removing todo item', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Todo to delete', completed: false },
          { id: '2', text: 'Keep this', completed: true },
        ],
      };
      const action = { type: DELETE_TODO, payload: { id: '1' } };
      const result = todo(stateWithTodos, action);
      expect(result.todoItems.length).toBe(1);
      expect(result.todoItems[0].id).toBe('2');
      expect(result.previousStateTodoItems).toEqual(stateWithTodos.todoItems);
      expect(result.currentTodoItem).toEqual(initialTodoState.currentTodoItem);
    });

    it('handles DELETE_TODO with non-matching id', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [{ id: '1', text: 'Keep this', completed: false }],
      };
      const action = { type: DELETE_TODO, payload: { id: '99' } };
      const result = todo(stateWithTodos, action);
      expect(result.todoItems.length).toBe(1);
    });

    it('handles DELETE_TODO_SUCCESS by clearing previous state', () => {
      const state = {
        ...initialTodoState,
        previousStateTodoItems: [{ id: '1', text: 'Test', completed: false }],
        isLoading: true,
      };
      const action = { type: DELETE_TODO_SUCCESS };
      const result = todo(state, action);
      expect(result.previousStateTodoItems).toBeUndefined();
      expect(result.isLoading).toBe(false);
    });

    it('handles DELETE_TODO_ERROR by restoring previous state', () => {
      const previousItems = [{ id: '1', text: 'Test', completed: false }];
      const state = {
        ...initialTodoState,
        previousStateTodoItems: previousItems,
        isLoading: true,
      };
      const action = { type: DELETE_TODO_ERROR, payload: previousItems, error: 'Delete failed' };
      const result = todo(state, action);
      expect(result.previousStateTodoItems).toBeUndefined();
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Delete failed');
      expect(result.todoItems).toEqual(previousItems);
    });
  });
});
