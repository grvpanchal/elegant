import { expect } from '@open-wc/testing';
import { call, put, select, delay } from 'redux-saga/effects';
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

describe('todo operations API wrappers', () => {
  it('getTodoApi returns a promise', () => {
    const result = getTodoApi();
    expect(result).to.be.instanceOf(Promise);
  });

  it('addTodoApi returns a promise', () => {
    const result = addTodoApi({ text: 'Test' });
    expect(result).to.be.instanceOf(Promise);
  });

  it('updateTodoApi returns a promise', () => {
    const result = updateTodoApi({ id: 1, text: 'Updated' });
    expect(result).to.be.instanceOf(Promise);
  });

  it('deleteTodoApi returns a promise', () => {
    const result = deleteTodoApi({ id: 1 });
    expect(result).to.be.instanceOf(Promise);
  });
});

describe('todo saga generators', () => {
  describe('getTodos', () => {
    it('handles successful fetch', () => {
      const generator = getTodos();
      expect(generator.next().value).to.deep.equal(call(getTodoApi));
      
      const mockResponse = { json: () => [{ id: 1, text: 'Test' }] };
      const step2 = generator.next(mockResponse);
      expect(step2.value).to.deep.equal(call([mockResponse, 'json']));
      
      const step3 = generator.next([{ id: 1, text: 'Test' }]);
      const mappedData = mapTodoData([{ id: 1, text: 'Test' }]);
      expect(step3.value).to.deep.equal(put(readTodoSuccess(mappedData)));
      
      expect(generator.next().done).to.equal(true);
    });

    it('handles fetch error', () => {
      const generator = getTodos();
      generator.next();
      const error = new Error('Network error');
      expect(generator.throw(error).value).to.deep.equal(put(readTodoError('Error: Network error')));
      expect(generator.next().done).to.equal(true);
    });
  });

  describe('addTodos', () => {
    it('handles successful creation', () => {
      const action = { payload: { text: 'New todo', completed: false } };
      const generator = addTodos(action);
      
      const step1 = generator.next();
      expect(step1.value.type).to.equal('CALL');
      
      const step2 = generator.next();
      expect(step2.value.type).to.equal('PUT');
      expect(step2.value.payload.action.type).to.equal('CREATE_TODO_SUCCESS');
      
      expect(generator.next().done).to.equal(true);
    });

    it('handles creation error', () => {
      const action = { payload: { text: 'New todo', completed: false } };
      const generator = addTodos(action);
      generator.next();
      const error = new Error('Creation failed');
      expect(generator.throw(error).value).to.deep.equal(put(createTodoError('Error: Creation failed')));
      expect(generator.next().done).to.equal(true);
    });
  });

  describe('updateTodos', () => {
    it('handles successful update', () => {
      const action = { payload: { id: 1, text: 'Updated' } };
      const generator = updateTodos(action);
      expect(generator.next().value).to.deep.equal(call(updateTodoApi, action.payload));
      expect(generator.next().value).to.deep.equal(put(updateTodoSuccess(action.payload)));
      expect(generator.next().done).to.equal(true);
    });

    it('handles update error', () => {
      const action = { payload: { id: 1, text: 'Updated' } };
      const generator = updateTodos(action);
      generator.next();
      const error = new Error('Update failed');
      expect(generator.throw(error).value).to.deep.equal(put(updateTodoError('Error: Update failed')));
      expect(generator.next().done).to.equal(true);
    });
  });

  describe('updateToggleTodos', () => {
    it('handles successful toggle', () => {
      const action = { payload: { id: 1, text: 'Test', completed: false } };
      const generator = updateToggleTodos(action);
      expect(generator.next().value).to.deep.equal(call(updateTodoApi, toggleCheckedState(action.payload)));
      expect(generator.next().value).to.deep.equal(put(toggleTodoSuccess()));
      expect(generator.next().done).to.equal(true);
    });

    it('handles toggle error with rollback', () => {
      const action = { payload: { id: 1, text: 'Test', completed: false } };
      const generator = updateToggleTodos(action);
      generator.next();
      const error = new Error('Toggle failed');
      expect(generator.throw(error).value).to.deep.equal(delay(500));
      expect(generator.next().value.type).to.equal('SELECT');
      const previousState = [{ id: 1, text: 'Test', completed: false }];
      expect(generator.next(previousState).value).to.deep.equal(
        put(toggleTodoError(previousState, 'Error: Toggle failed'))
      );
      expect(generator.next().done).to.equal(true);
    });
  });

  describe('deleteTodos', () => {
    it('handles successful delete', () => {
      const action = { payload: { id: 1 } };
      const generator = deleteTodos(action);
      expect(generator.next().value).to.deep.equal(call(deleteTodoApi, action.payload));
      expect(generator.next().value).to.deep.equal(put(deleteTodoSuccess()));
      expect(generator.next().done).to.equal(true);
    });

    it('handles delete error with rollback', () => {
      const action = { payload: { id: 1 } };
      const generator = deleteTodos(action);
      generator.next();
      const error = new Error('Delete failed');
      expect(generator.throw(error).value).to.deep.equal(delay(500));
      expect(generator.next().value.type).to.equal('SELECT');
      const previousState = [{ id: 1, text: 'Test', completed: false }];
      expect(generator.next(previousState).value).to.deep.equal(
        put(deleteTodoError(previousState, 'Error: Delete failed'))
      );
      expect(generator.next().done).to.equal(true);
    });
  });

  describe('watchTodos', () => {
    it('watches all todo actions', () => {
      const generator = watchTodos();
      const effects = [];
      let result = generator.next();
      while (!result.done) {
        effects.push(result.value);
        result = generator.next();
      }
      expect(effects).to.have.lengthOf(5);
    });
  });
});
