import { createAppStore } from '../index';
import fetchApi from '../../utils/api';
import { getTodoApi, addTodoApi, updateTodoApi, deleteTodoApi } from './todo.slice';

vi.mock('../../utils/api');

describe('todo slice', () => {
  let store;

  beforeEach(() => {
    fetchApi.mockReset();
    vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid' });
    store = createAppStore();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const todo = () => store.getState().todo;

  describe('api wrappers', () => {
    it('getTodoApi calls fetchApi with /todos', () => {
      getTodoApi();
      expect(fetchApi).toHaveBeenCalledWith('/todos');
    });
    it('addTodoApi calls fetchApi with POST', () => {
      addTodoApi({ text: 'x' });
      expect(fetchApi).toHaveBeenCalledWith('/todos', { method: 'POST', body: { text: 'x' } });
    });
    it('updateTodoApi calls fetchApi with PUT', () => {
      updateTodoApi({ id: 1 });
      expect(fetchApi).toHaveBeenCalledWith('/todos', { method: 'PUT', body: { id: 1 } });
    });
    it('deleteTodoApi calls fetchApi with DELETE', () => {
      deleteTodoApi({ id: 1 });
      expect(fetchApi).toHaveBeenCalledWith('/todos', { method: 'DELETE', body: { id: 1 } });
    });
  });

  describe('readTodo', () => {
    it('loads and maps todos on success', async () => {
      const items = [{ id: 1, text: 'A', completed: false }];
      fetchApi.mockResolvedValueOnce({ json: async () => items });
      await store.getState().readTodo();
      expect(todo().todoItems).toEqual(items);
      expect(todo().isContentLoading).toBe(false);
      expect(todo().isLoading).toBe(false);
    });

    it('sets error on failure', async () => {
      fetchApi.mockRejectedValueOnce('boom');
      await store.getState().readTodo();
      expect(todo().error).toBe('boom');
      expect(todo().isContentLoading).toBe(false);
    });
  });

  describe('createTodo', () => {
    it('adds an item with a generated id on success', async () => {
      fetchApi.mockResolvedValueOnce(undefined);
      await store.getState().createTodo('New');
      expect(todo().todoItems).toContainEqual({ id: 'test-uuid', text: 'New', completed: false });
      expect(todo().isActionLoading).toBe(false);
      expect(todo().currentTodoItem).toEqual({ text: '', id: '' });
    });

    it('sets error on failure', async () => {
      fetchApi.mockRejectedValueOnce('fail');
      await store.getState().createTodo('New');
      expect(todo().error).toBe('fail');
      expect(todo().isActionLoading).toBe(false);
      expect(todo().currentTodoItem).toEqual({ text: '', id: '' });
    });
  });

  describe('editTodo', () => {
    it('sets currentTodoItem', () => {
      store.getState().editTodo({ id: 2, text: 'Edit' });
      expect(todo().currentTodoItem).toEqual({ id: 2, text: 'Edit' });
    });
  });

  describe('updateTodo', () => {
    it('updates the matching item text on success', async () => {
      fetchApi.mockResolvedValueOnce(undefined);
      store = createAppStore({ todo: { todoItems: [{ id: 1, text: 'Old', completed: false }] } });
      await store.getState().updateTodo({ id: 1, text: 'New' });
      expect(store.getState().todo.todoItems[0].text).toBe('New');
      expect(store.getState().todo.isActionLoading).toBe(false);
      expect(store.getState().todo.currentTodoItem).toEqual({ text: '', id: '' });
    });

    it('sets error on failure', async () => {
      fetchApi.mockRejectedValueOnce('nope');
      store = createAppStore({ todo: { todoItems: [{ id: 1, text: 'Old', completed: false }] } });
      await store.getState().updateTodo({ id: 1, text: 'New' });
      expect(store.getState().todo.error).toBe('nope');
      expect(store.getState().todo.isActionLoading).toBe(false);
    });
  });

  describe('toggleTodo', () => {
    it('flips completed and clears the snapshot on success', async () => {
      fetchApi.mockResolvedValueOnce(undefined);
      store = createAppStore({ todo: { todoItems: [{ id: 1, text: 'A', completed: false }] } });
      await store.getState().toggleTodo({ id: 1, text: 'A', completed: false });
      expect(store.getState().todo.todoItems[0].completed).toBe(true);
      expect(store.getState().todo.previousStateTodoItems).toBeUndefined();
    });

    it('rolls back to the previous items on failure', async () => {
      vi.useFakeTimers();
      fetchApi.mockRejectedValueOnce('toggle-fail');
      const items = [{ id: 1, text: 'A', completed: false }];
      store = createAppStore({ todo: { todoItems: items } });
      const pending = store.getState().toggleTodo({ id: 1, text: 'A', completed: false });
      await vi.runAllTimersAsync();
      await pending;
      expect(store.getState().todo.todoItems).toEqual(items);
      expect(store.getState().todo.error).toBe('toggle-fail');
      vi.useRealTimers();
    });
  });

  describe('deleteTodo', () => {
    it('removes the item and clears the snapshot on success', async () => {
      fetchApi.mockResolvedValueOnce(undefined);
      store = createAppStore({
        todo: {
          todoItems: [
            { id: 1, text: 'A', completed: false },
            { id: 2, text: 'B', completed: false },
          ],
        },
      });
      await store.getState().deleteTodo(1);
      expect(store.getState().todo.todoItems).toEqual([{ id: 2, text: 'B', completed: false }]);
      expect(store.getState().todo.previousStateTodoItems).toBeUndefined();
    });

    it('rolls back to the previous items on failure', async () => {
      vi.useFakeTimers();
      fetchApi.mockRejectedValueOnce('delete-fail');
      const items = [{ id: 1, text: 'A', completed: false }];
      store = createAppStore({ todo: { todoItems: items } });
      const pending = store.getState().deleteTodo(1);
      await vi.runAllTimersAsync();
      await pending;
      expect(store.getState().todo.todoItems).toEqual(items);
      expect(store.getState().todo.error).toBe('delete-fail');
      vi.useRealTimers();
    });
  });
});
