import { expect } from '@open-wc/testing';
import fetchApi, { getTodo, addTodo, updateTodo, removeTodo, modifyTodo } from './api';

describe('api', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('todo', '[]');
  });

  afterEach(() => {
  });

  describe('fetchApi', () => {
    it('calls getTodo for GET /todos', () => {
      const result = fetchApi('/todos', { method: 'GET' });
      expect(result).to.be.instanceOf(Promise);
    });

    it('calls addTodo for POST /todos', () => {
      const result = fetchApi('/todos', { method: 'POST', body: { text: 'Test' } });
      expect(result).to.be.instanceOf(Promise);
    });

    it('calls updateTodo for PUT /todos', () => {
      const result = fetchApi('/todos', { method: 'PUT', body: { id: 1, text: 'Updated' } });
      expect(result).to.be.instanceOf(Promise);
    });

    it('calls removeTodo for DELETE /todos', () => {
      const result = fetchApi('/todos', { method: 'DELETE', body: { id: 1 } });
      expect(result).to.be.instanceOf(Promise);
    });

    it('returns undefined for unknown paths', () => {
      const result = fetchApi('/unknown', { method: 'GET' });
      expect(result).to.equal(undefined);
    });

    it('uses default parameters', () => {
      const result = fetchApi();
      expect(result).to.equal(undefined);
    });
  });

  describe('getTodo', () => {
    it('returns todo items from localStorage', async () => {
      const todoItems = [{ id: 1, text: 'Test', completed: false }];
      localStorage.setItem('todo', JSON.stringify(todoItems));
      const result = await getTodo();
      const json = await result.json();
      expect(json).to.deep.equal(todoItems);
    });

    it('throws error when mockError is true', async () => {
      try {
        await getTodo(true);
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e).to.equal('Unable to get Items');
      }
    });
  });

  describe('addTodo', () => {
    it('adds a todo item to localStorage', async () => {
      const todoItem = { id: 1, text: 'New Todo', completed: false };
      const result = await addTodo(todoItem);
      expect(result).to.deep.equal(todoItem);
      const stored = JSON.parse(localStorage.getItem('todo'));
      expect(stored).to.have.lengthOf(1);
      expect(stored[0]).to.deep.equal(todoItem);
    });

    it('throws error when mockError is true', async () => {
      const todoItem = { id: 1, text: 'New Todo' };
      try {
        await addTodo(todoItem, true);
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e).to.equal('unable to modify Item');
      }
    });
  });

  describe('updateTodo', () => {
    it('updates a todo item in localStorage', async () => {
      const initialTodos = [{ id: 1, text: 'Old', completed: false }];
      localStorage.setItem('todo', JSON.stringify(initialTodos));
      const todoItem = { id: 1, text: 'Updated', completed: false };
      const result = await updateTodo(todoItem);
      expect(result).to.deep.equal(todoItem);
      const stored = JSON.parse(localStorage.getItem('todo'));
      expect(stored[0].text).to.equal('Updated');
    });

    it('preserves other todos when updating one', async () => {
      const initialTodos = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ];
      localStorage.setItem('todo', JSON.stringify(initialTodos));
      const todoItem = { id: 1, text: 'Updated', completed: false };
      await updateTodo(todoItem);
      const stored = JSON.parse(localStorage.getItem('todo'));
      expect(stored[0].text).to.equal('Updated');
      expect(stored[1].text).to.equal('Todo 2');
      expect(stored[1].completed).to.equal(true);
    });

    it('throws error when mockError is true', async () => {
      const todoItem = { id: 1, text: 'Updated' };
      try {
        await updateTodo(todoItem, true);
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e).to.equal('unable to modify Item');
      }
    });
  });

  describe('removeTodo', () => {
    it('removes a todo item from localStorage', async () => {
      const initialTodos = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ];
      localStorage.setItem('todo', JSON.stringify(initialTodos));
      const todoItem = { id: 1 };
      const result = await removeTodo(todoItem);
      expect(result).to.deep.equal(todoItem);
      const stored = JSON.parse(localStorage.getItem('todo'));
      expect(stored).to.have.lengthOf(1);
      expect(stored[0].id).to.equal(2);
    });

    it('throws error when mockError is true', async () => {
      const todoItem = { id: 1 };
      try {
        await removeTodo(todoItem, true);
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e).to.equal('unable to modify Item');
      }
    });
  });

  describe('modifyTodo', () => {
    it('calls modifyAction and saves result', async () => {
      const initialTodos = [{ id: 1, text: 'Test', completed: false }];
      localStorage.setItem('todo', JSON.stringify(initialTodos));
      const modifyAction = (list) => JSON.stringify([{ ...list[0], text: 'Modified' }]);
      const result = await modifyTodo(modifyAction, { todoItem: { id: 1 } });
      expect(result).to.deep.equal({ id: 1 });
      const stored = JSON.parse(localStorage.getItem('todo'));
      expect(stored[0].text).to.equal('Modified');
    });

    it('throws error when mockError is true', async () => {
      const modifyAction = (list) => JSON.stringify(list);
      try {
        await modifyTodo(modifyAction, { todoItem: { id: 1 }, mockError: true });
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e).to.equal('unable to modify Item');
      }
    });
  });
});
