import { expect } from '@open-wc/testing';
import todoReducer from './todo.reducer';
import initialTodoState from './todo.initial';
import {
  createTodo,
  createTodoSuccess,
  createTodoError,
  readTodo,
  readTodoSuccess,
  readTodoError,
  editTodo,
  updateTodo,
  updateTodoSuccess,
  updateTodoError,
  toggleTodo,
  toggleTodoSuccess,
  toggleTodoError,
  deleteTodo,
  deleteTodoSuccess,
  deleteTodoError,
} from './todo.actions';
import {
  CREATE_TODO,
  CREATE_TODO_SUCCESS,
  CREATE_TODO_ERROR,
  READ_TODO,
  READ_TODO_SUCCESS,
  READ_TODO_ERROR,
  EDIT_TODO,
  UPDATE_TODO,
  UPDATE_TODO_SUCCESS,
  UPDATE_TODO_ERROR,
  TOGGLE_TODO,
  TOGGLE_TODO_SUCCESS,
  TOGGLE_TODO_ERROR,
  DELETE_TODO,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_ERROR,
} from './todo.type';

describe('todo reducer', () => {
  it('returns initial state for unknown action', () => {
    expect(todoReducer(undefined, { type: 'UNKNOWN' })).to.deep.equal(initialTodoState);
  });

  describe('READ_TODO', () => {
    it('sets loading states', () => {
      const state = todoReducer(initialTodoState, readTodo());
      expect(state.isLoading).to.equal(true);
      expect(state.isContentLoading).to.equal(true);
    });
  });

  describe('READ_TODO_SUCCESS', () => {
    it('sets todoItems and resets loading', () => {
      const loadingState = { ...initialTodoState, isLoading: true, isContentLoading: true };
      const todos = [{ id: 1, text: 'Test', completed: false }];
      const state = todoReducer(loadingState, readTodoSuccess(todos));
      expect(state.isLoading).to.equal(false);
      expect(state.isContentLoading).to.equal(false);
      expect(state.todoItems).to.deep.equal(todos);
    });
  });

  describe('READ_TODO_ERROR', () => {
    it('sets error and resets loading', () => {
      const loadingState = { ...initialTodoState, isLoading: true, isContentLoading: true };
      const state = todoReducer(loadingState, readTodoError('Failed'));
      expect(state.isLoading).to.equal(false);
      expect(state.isContentLoading).to.equal(false);
      expect(state.error).to.equal('Failed');
    });
  });

  describe('CREATE_TODO', () => {
    it('sets loading and currentTodoItem', () => {
      const state = todoReducer(initialTodoState, createTodo('New todo'));
      expect(state.isLoading).to.equal(true);
      expect(state.isActionLoading).to.equal(true);
      expect(state.currentTodoItem.text).to.equal('New todo');
      expect(state.currentTodoItem.completed).to.equal(false);
    });
  });

  describe('CREATE_TODO_SUCCESS', () => {
    it('adds todo and resets loading', () => {
      const state = todoReducer(initialTodoState, createTodoSuccess({ id: 1, text: 'New', completed: false }));
      expect(state.isLoading).to.equal(false);
      expect(state.isActionLoading).to.equal(false);
      expect(state.todoItems).to.have.lengthOf(1);
      expect(state.todoItems[0].text).to.equal('New');
      expect(state.currentTodoItem).to.deep.equal(initialTodoState.currentTodoItem);
    });
  });

  describe('CREATE_TODO_ERROR', () => {
    it('sets error and resets loading', () => {
      const state = todoReducer(initialTodoState, createTodoError('Error'));
      expect(state.isLoading).to.equal(false);
      expect(state.isActionLoading).to.equal(false);
      expect(state.error).to.equal('Error');
    });
  });

  describe('EDIT_TODO', () => {
    it('sets currentTodoItem', () => {
      const state = todoReducer(initialTodoState, editTodo({ id: 1, text: 'Editing' }));
      expect(state.currentTodoItem).to.deep.equal({ id: 1, text: 'Editing' });
    });
  });

  describe('UPDATE_TODO', () => {
    it('updates todo text and sets loading', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [{ id: 1, text: 'Old', completed: false }],
      };
      const state = todoReducer(stateWithTodos, updateTodo({ id: 1, text: 'New' }));
      expect(state.isActionLoading).to.equal(true);
      expect(state.todoItems[0].text).to.equal('New');
      expect(state.currentTodoItem.text).to.equal('New');
    });

    it('preserves other todos', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [
          { id: 1, text: 'First', completed: false },
          { id: 2, text: 'Second', completed: true },
        ],
      };
      const state = todoReducer(stateWithTodos, updateTodo({ id: 1, text: 'Updated' }));
      expect(state.todoItems[0].text).to.equal('Updated');
      expect(state.todoItems[1].text).to.equal('Second');
    });
  });

  describe('UPDATE_TODO_SUCCESS', () => {
    it('resets loading and currentTodoItem', () => {
      const state = {
        ...initialTodoState,
        isActionLoading: true,
        currentTodoItem: { id: 1, text: 'Editing' },
      };
      const result = todoReducer(state, updateTodoSuccess({ id: 1, text: 'Updated' }));
      expect(result.isActionLoading).to.equal(false);
      expect(result.currentTodoItem).to.deep.equal(initialTodoState.currentTodoItem);
    });
  });

  describe('UPDATE_TODO_ERROR', () => {
    it('sets error and resets', () => {
      const state = {
        ...initialTodoState,
        isActionLoading: true,
        previousStateTodoItems: [{ id: 1 }],
        currentTodoItem: { id: 1, text: 'Editing' },
      };
      const result = todoReducer(state, updateTodoError('Failed'));
      expect(result.error).to.equal('Failed');
      expect(result.isActionLoading).to.equal(false);
      expect(result.currentTodoItem).to.deep.equal(initialTodoState.currentTodoItem);
    });
  });

  describe('TOGGLE_TODO', () => {
    it('toggles completed status', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [{ id: 1, text: 'Test', completed: false }],
      };
      const state = todoReducer(stateWithTodos, toggleTodo({ id: 1 }));
      expect(state.todoItems[0].completed).to.equal(true);
      expect(state.previousStateTodoItems).to.deep.equal([{ id: 1, text: 'Test', completed: false }]);
    });

    it('preserves other todos', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [
          { id: 1, text: 'First', completed: false },
          { id: 2, text: 'Second', completed: true },
        ],
      };
      const state = todoReducer(stateWithTodos, toggleTodo({ id: 1 }));
      expect(state.todoItems[0].completed).to.equal(true);
      expect(state.todoItems[1].completed).to.equal(true);
    });
  });

  describe('TOGGLE_TODO_SUCCESS', () => {
    it('clears previous state and resets loading', () => {
      const state = {
        ...initialTodoState,
        previousStateTodoItems: [{ id: 1 }],
        isLoading: true,
      };
      const result = todoReducer(state, toggleTodoSuccess());
      expect(result.previousStateTodoItems).to.equal(undefined);
      expect(result.isLoading).to.equal(false);
    });
  });

  describe('TOGGLE_TODO_ERROR', () => {
    it('restores previous state and sets error', () => {
      const state = {
        ...initialTodoState,
        todoItems: [{ id: 2 }],
        previousStateTodoItems: [{ id: 1 }],
        isLoading: true,
      };
      const result = todoReducer(state, toggleTodoError([{ id: 1 }], 'Failed'));
      expect(result.todoItems).to.deep.equal([{ id: 1 }]);
      expect(result.previousStateTodoItems).to.equal(undefined);
      expect(result.isLoading).to.equal(false);
      expect(result.error).to.equal('Failed');
    });
  });

  describe('DELETE_TODO', () => {
    it('removes todo and saves previous state', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [{ id: 1, text: 'Test', completed: false }],
      };
      const state = todoReducer(stateWithTodos, deleteTodo(1));
      expect(state.todoItems).to.have.lengthOf(0);
      expect(state.previousStateTodoItems).to.deep.equal([{ id: 1, text: 'Test', completed: false }]);
      expect(state.currentTodoItem).to.deep.equal(initialTodoState.currentTodoItem);
    });

    it('preserves other todos', () => {
      const stateWithTodos = {
        ...initialTodoState,
        todoItems: [
          { id: 1, text: 'First', completed: false },
          { id: 2, text: 'Second', completed: true },
        ],
      };
      const state = todoReducer(stateWithTodos, deleteTodo(1));
      expect(state.todoItems).to.have.lengthOf(1);
      expect(state.todoItems[0].id).to.equal(2);
    });
  });

  describe('DELETE_TODO_SUCCESS', () => {
    it('clears previous state and resets loading', () => {
      const state = {
        ...initialTodoState,
        previousStateTodoItems: [{ id: 1 }],
        isLoading: true,
      };
      const result = todoReducer(state, deleteTodoSuccess());
      expect(result.previousStateTodoItems).to.equal(undefined);
      expect(result.isLoading).to.equal(false);
    });
  });

  describe('DELETE_TODO_ERROR', () => {
    it('restores previous state and sets error', () => {
      const state = {
        ...initialTodoState,
        todoItems: [{ id: 2 }],
        previousStateTodoItems: [{ id: 1 }],
        isLoading: true,
      };
      const result = todoReducer(state, deleteTodoError([{ id: 1 }], 'Failed'));
      expect(result.todoItems).to.deep.equal([{ id: 1 }]);
      expect(result.previousStateTodoItems).to.equal(undefined);
      expect(result.isLoading).to.equal(false);
      expect(result.error).to.equal('Failed');
    });
  });
});

describe('todo actions', () => {
  it('createTodo returns correct action', () => {
    const action = createTodo('Test');
    expect(action.type).to.equal(CREATE_TODO);
    expect(action.payload).to.deep.equal({ text: 'Test', completed: false });
  });

  it('createTodoSuccess returns correct action', () => {
    const action = createTodoSuccess({ id: 1 });
    expect(action.type).to.equal(CREATE_TODO_SUCCESS);
    expect(action.payload).to.deep.equal({ id: 1 });
  });

  it('createTodoError returns correct action', () => {
    const action = createTodoError('Error');
    expect(action.type).to.equal(CREATE_TODO_ERROR);
    expect(action.error).to.equal('Error');
  });

  it('readTodo returns correct action', () => {
    const action = readTodo();
    expect(action.type).to.equal(READ_TODO);
  });

  it('readTodoSuccess returns correct action', () => {
    const action = readTodoSuccess([{ id: 1 }]);
    expect(action.type).to.equal(READ_TODO_SUCCESS);
    expect(action.payload).to.deep.equal([{ id: 1 }]);
  });

  it('readTodoError returns correct action', () => {
    const action = readTodoError('Failed');
    expect(action.type).to.equal(READ_TODO_ERROR);
    expect(action.error).to.equal('Failed');
  });

  it('editTodo returns correct action', () => {
    const action = editTodo({ id: 1, text: 'Edit' });
    expect(action.type).to.equal(EDIT_TODO);
    expect(action.payload).to.deep.equal({ id: 1, text: 'Edit' });
  });

  it('updateTodo returns correct action', () => {
    const action = updateTodo({ id: 1, text: 'Update' });
    expect(action.type).to.equal(UPDATE_TODO);
    expect(action.payload).to.deep.equal({ id: 1, text: 'Update' });
  });

  it('updateTodoSuccess returns correct action', () => {
    const action = updateTodoSuccess({ id: 1 });
    expect(action.type).to.equal(UPDATE_TODO_SUCCESS);
    expect(action.payload).to.deep.equal({ id: 1 });
  });

  it('updateTodoError returns correct action', () => {
    const action = updateTodoError('Failed');
    expect(action.type).to.equal(UPDATE_TODO_ERROR);
    expect(action.error).to.equal('Failed');
  });

  it('toggleTodo returns correct action', () => {
    const action = toggleTodo({ id: 1 });
    expect(action.type).to.equal(TOGGLE_TODO);
    expect(action.payload).to.deep.equal({ id: 1 });
  });

  it('toggleTodoSuccess returns correct action', () => {
    const action = toggleTodoSuccess();
    expect(action.type).to.equal(TOGGLE_TODO_SUCCESS);
  });

  it('toggleTodoError returns correct action', () => {
    const action = toggleTodoError([{ id: 1 }], 'Failed');
    expect(action.type).to.equal(TOGGLE_TODO_ERROR);
    expect(action.payload).to.deep.equal([{ id: 1 }]);
    expect(action.error).to.equal('Failed');
  });

  it('deleteTodo returns correct action', () => {
    const action = deleteTodo(1);
    expect(action.type).to.equal(DELETE_TODO);
    expect(action.payload).to.deep.equal({ id: 1 });
  });

  it('deleteTodoSuccess returns correct action', () => {
    const action = deleteTodoSuccess();
    expect(action.type).to.equal(DELETE_TODO_SUCCESS);
  });

  it('deleteTodoError returns correct action', () => {
    const action = deleteTodoError([{ id: 1 }], 'Failed');
    expect(action.type).to.equal(DELETE_TODO_ERROR);
    expect(action.payload).to.deep.equal([{ id: 1 }]);
    expect(action.error).to.equal('Failed');
  });
});
