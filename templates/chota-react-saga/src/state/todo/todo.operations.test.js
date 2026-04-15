import { put, call, select, delay } from 'redux-saga/effects';
import {
  getTodos,
  addTodos,
  updateTodos,
  updateToggleTodos,
  deleteTodos,
  watchTodos,
  getTodoApi,
  addTodoApi,
  updateTodoApi,
  deleteTodoApi,
} from './todo.operations';
import {
  readTodoSuccess,
  readTodoError,
  createTodoSuccess,
  createTodoError,
  updateTodoSuccess,
  updateTodoError,
  toggleTodoSuccess,
  toggleTodoError,
  deleteTodoSuccess,
  deleteTodoError,
} from './todo.actions';
import { mapTodoData, toggleCheckedState } from './todo.helper';
import fetchApi from '../../utils/api';

jest.mock('../../utils/api');

describe('todo saga generators', () => {
  beforeEach(() => {
    fetchApi.mockClear();
    global.window.crypto = { randomUUID: () => 'test-uuid' };
  });

  describe('todo operations API wrappers', () => {
    beforeEach(() => {
      fetchApi.mockClear();
    });

    describe('getTodoApi', () => {
      it('should call fetchApi with /todos', () => {
        getTodoApi();
        expect(fetchApi).toHaveBeenCalledWith('/todos');
      });
    });

    describe('addTodoApi', () => {
      it('should call fetchApi with POST method', () => {
        const payload = { text: 'New todo' };
        addTodoApi(payload);
        expect(fetchApi).toHaveBeenCalledWith('/todos', { method: 'POST', body: payload });
      });
    });

    describe('updateTodoApi', () => {
      it('should call fetchApi with PUT method', () => {
        const payload = { id: 1, text: 'Updated' };
        updateTodoApi(payload);
        expect(fetchApi).toHaveBeenCalledWith('/todos', { method: 'PUT', body: payload });
      });
    });

    describe('deleteTodoApi', () => {
      it('should call fetchApi with DELETE method', () => {
        const payload = { id: 1 };
        deleteTodoApi(payload);
        expect(fetchApi).toHaveBeenCalledWith('/todos', { method: 'DELETE', body: payload });
      });
    });
  });

  describe('getTodos', () => {
    it('should handle successful todo fetch', () => {
      const mockTodos = [{ id: 1, text: 'Test', completed: false }];
      const generator = getTodos();

      expect(generator.next().value).toEqual(call(getTodoApi));
      
      const mockResponse = { json: () => mockTodos };
      const jsonResult = generator.next(mockResponse);
      expect(jsonResult.value).toEqual(mockTodos);
      
      const putResult = generator.next(mockTodos);
      const mappedData = mapTodoData(mockTodos);
      expect(putResult.value).toEqual(put(readTodoSuccess(mappedData)));
      
      expect(generator.next().done).toBe(true);
    });

    it('should handle fetch error', () => {
      const generator = getTodos();
      expect(generator.next().value).toEqual(call(getTodoApi));
      const error = new Error('Network error');
      expect(generator.throw(error).value).toEqual(put(readTodoError('Error: Network error')));
      expect(generator.next().done).toBe(true);
    });
  });

  describe('addTodos', () => {
    it('should handle successful todo creation', () => {
      const action = { payload: { text: 'New todo', completed: false } };
      const generator = addTodos(action);

      const firstYield = generator.next();
      expect(firstYield.value['@@redux-saga/IO']).toBe(true);
      expect(firstYield.value.payload).toBeDefined();
      expect(firstYield.value.payload.args[0]).toHaveProperty('id');
      expect(firstYield.value.payload.args[0].text).toBe('New todo');
      
      const putEffect = generator.next();
      expect(putEffect.value['@@redux-saga/IO']).toBe(true);
      expect(putEffect.value.payload.action.type).toBe('CREATE_TODO_SUCCESS');
      expect(putEffect.value.payload.action.payload.text).toBe('New todo');
      
      expect(generator.next().done).toBe(true);
    });

    it('should handle creation error', () => {
      const action = { payload: { text: 'New todo', completed: false } };
      const generator = addTodos(action);
      expect(generator.next().value.type).toBe('CALL');
      const error = new Error('Creation failed');
      expect(generator.throw(error).value).toEqual(put(createTodoError('Error: Creation failed')));
      expect(generator.next().done).toBe(true);
    });
  });

  describe('updateTodos', () => {
    it('should handle successful todo update', () => {
      const action = { payload: { id: 1, text: 'Updated' } };
      const generator = updateTodos(action);

      expect(generator.next().value).toEqual(call(updateTodoApi, action.payload));
      expect(generator.next().value).toEqual(put(updateTodoSuccess(action.payload)));
      expect(generator.next().done).toBe(true);
    });

    it('should handle update error', () => {
      const action = { payload: { id: 1, text: 'Updated' } };
      const generator = updateTodos(action);
      expect(generator.next().value).toEqual(call(updateTodoApi, action.payload));
      const error = new Error('Update failed');
      expect(generator.throw(error).value).toEqual(put(updateTodoError('Error: Update failed')));
      expect(generator.next().done).toBe(true);
    });
  });

  describe('updateToggleTodos', () => {
    it('should handle successful toggle', () => {
      const action = { payload: { id: 1, text: 'Test', completed: false } };
      const generator = updateToggleTodos(action);

      expect(generator.next().value).toEqual(call(updateTodoApi, toggleCheckedState(action.payload)));
      expect(generator.next().value).toEqual(put(toggleTodoSuccess()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle toggle error with rollback', () => {
      const action = { payload: { id: 1, text: 'Test', completed: false } };
      const generator = updateToggleTodos(action);
      expect(generator.next().value).toEqual(call(updateTodoApi, toggleCheckedState(action.payload)));
      const error = new Error('Toggle failed');
      expect(generator.throw(error).value).toEqual(delay(500));
      expect(generator.next().value.type).toBe('SELECT');
      const previousState = [{ id: 1, text: 'Test', completed: false }];
      expect(generator.next(previousState).value).toEqual(
        put(toggleTodoError(previousState, 'Error: Toggle failed'))
      );
      expect(generator.next().done).toBe(true);
    });
  });

  describe('deleteTodos', () => {
    it('should handle successful delete', () => {
      const action = { payload: { id: 1 } };
      const generator = deleteTodos(action);

      expect(generator.next().value).toEqual(call(deleteTodoApi, action.payload));
      expect(generator.next().value).toEqual(put(deleteTodoSuccess()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle delete error with rollback', () => {
      const action = { payload: { id: 1 } };
      const generator = deleteTodos(action);
      expect(generator.next().value).toEqual(call(deleteTodoApi, action.payload));
      const error = new Error('Delete failed');
      expect(generator.throw(error).value).toEqual(delay(500));
      expect(generator.next().value.type).toBe('SELECT');
      const previousState = [{ id: 1, text: 'Test', completed: false }];
      expect(generator.next(previousState).value).toEqual(
        put(deleteTodoError(previousState, 'Error: Delete failed'))
      );
      expect(generator.next().done).toBe(true);
    });
  });

  describe('watchTodos', () => {
    it('should watch all todo actions', () => {
      const generator = watchTodos();

      const effects = [];
      let result = generator.next();
      while (!result.done) {
        effects.push(result.value);
        result = generator.next();
      }

      expect(effects).toHaveLength(5);
    });
  });
});
