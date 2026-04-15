import todo from './todo.reducer';
import initialTodoState from './todo.initial';
import { CREATE_TODO, DELETE_TODO, EDIT_TODO, TOGGLE_TODO, UPDATE_TODO } from './todo.type';

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

  describe('CREATE_TODO action', () => {
    it('adds a new todo item to the list', () => {
      const initialState = initialTodoState;
      
      const action = {
        type: CREATE_TODO,
        payload: { id: '1', text: 'New Todo' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems.length).toBe(1);
      expect(result.todoItems[0].id).toBe('1');
      expect(result.todoItems[0].text).toBe('New Todo');
      expect(result.todoItems[0].completed).toBe(false);
    });

    it('preserves existing todo items when adding a new one', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Existing Todo', completed: true },
        ],
      };
      
      const action = {
        type: CREATE_TODO,
        payload: { id: '2', text: 'New Todo' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems.length).toBe(2);
      expect(result.todoItems[0].id).toBe('1');
      expect(result.todoItems[1].text).toBe('New Todo');
    });
  });

  describe('EDIT_TODO action', () => {
    it('updates the currentTodoItem with new values', () => {
      const initialState = initialTodoState;
      
      const action = {
        type: EDIT_TODO,
        payload: { id: '1', text: 'Editing Todo' },
      };
      
      const result = todo(initialState, action);
      expect(result.currentTodoItem.id).toBe('1');
      expect(result.currentTodoItem.text).toBe('Editing Todo');
    });

    it('preserves other state properties when editing', () => {
      const initialState = initialTodoState;
      
      const action = {
        type: EDIT_TODO,
        payload: { id: '1', text: 'Editing Todo' },
      };
      
      const result = todo(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.todoItems.length).toBe(0);
    });
  });

  describe('UPDATE_TODO action', () => {
    it('updates the text of an existing todo item', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Old Text', completed: false },
        ],
      };
      
      const action = {
        type: UPDATE_TODO,
        payload: { id: '1', text: 'New Text' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems[0].text).toBe('New Text');
    });

    it('resets currentTodoItem after update', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [{ id: '1', text: 'Test', completed: false }],
        currentTodoItem: { id: '1', text: 'Editing' },
      };
      
      const action = {
        type: UPDATE_TODO,
        payload: { id: '1', text: 'Updated' },
      };
      
      const result = todo(initialState, action);
      expect(result.currentTodoItem.text).toBe('');
    });

    it('preserves completed status when updating text', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Old Text', completed: true },
        ],
      };
      
      const action = {
        type: UPDATE_TODO,
        payload: { id: '1', text: 'New Text' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems[0].completed).toBe(true);
    });

    it('preserves other todo items when updating one', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Todo 1', completed: false },
          { id: '2', text: 'Todo 2', completed: true },
        ],
      };
      
      const action = {
        type: UPDATE_TODO,
        payload: { id: '1', text: 'Updated Todo 1' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems[0].text).toBe('Updated Todo 1');
      expect(result.todoItems[1].text).toBe('Todo 2');
      expect(result.todoItems[1].completed).toBe(true);
    });
  });

  describe('TOGGLE_TODO action', () => {
    it('toggles the completed status of a todo item', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Test Todo', completed: false },
        ],
      };
      
      const action = {
        type: TOGGLE_TODO,
        payload: { id: '1' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems[0].completed).toBe(true);
    });

    it('toggles from true to false', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Test Todo', completed: true },
        ],
      };
      
      const action = {
        type: TOGGLE_TODO,
        payload: { id: '1' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems[0].completed).toBe(false);
    });

    it('only toggles the matching todo item', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Todo 1', completed: false },
          { id: '2', text: 'Todo 2', completed: true },
        ],
      };
      
      const action = {
        type: TOGGLE_TODO,
        payload: { id: '1' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems[0].completed).toBe(true);
      expect(result.todoItems[1].completed).toBe(true);
    });
  });

  describe('DELETE_TODO action', () => {
    it('removes a todo item from the list', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Todo to delete', completed: false },
          { id: '2', text: 'Keep this', completed: true },
        ],
      };
      
      const action = {
        type: DELETE_TODO,
        payload: { id: '1' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems.length).toBe(1);
      expect(result.todoItems[0].id).toBe('2');
    });

    it('resets currentTodoItem after delete', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [{ id: '1', text: 'Test' }],
        currentTodoItem: { id: '1', text: 'Editing' },
      };
      
      const action = {
        type: DELETE_TODO,
        payload: { id: '1' },
      };
      
      const result = todo(initialState, action);
      expect(result.currentTodoItem.text).toBe('');
    });

    it('handles deleting non-existent item gracefully', () => {
      const initialState = {
        ...initialTodoState,
        todoItems: [
          { id: '1', text: 'Keep this', completed: false },
        ],
      };
      
      const action = {
        type: DELETE_TODO,
        payload: { id: '99' },
      };
      
      const result = todo(initialState, action);
      expect(result.todoItems.length).toBe(1);
    });
  });
});
