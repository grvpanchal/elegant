import {
  getVisibleTodos,
} from './todo.selectors';
import { SHOW_ACTIVE, SHOW_ALL, SHOW_COMPLETED } from '../filters/filters.type';

describe('Todo Selectors', () => {
  const mockTodoState = {
    todoItems: [
      { id: '1', text: 'Todo 1', completed: false },
      { id: '2', text: 'Todo 2', completed: true },
      { id: '3', text: 'Todo 3', completed: false },
    ],
  };

  describe('getVisibleTodos with SHOW_ALL filter', () => {
    it('returns all todo items when filter is SHOW_ALL', () => {
      const result = getVisibleTodos(mockTodoState, SHOW_ALL);
      expect(result.todoItems.length).toBe(3);
      expect(result.todoItems[0].id).toBe('1');
      expect(result.todoItems[2].id).toBe('3');
    });

    it('preserves other todo state properties', () => {
      const result = getVisibleTodos(mockTodoState, SHOW_ALL);
      expect(result.todoItems.length).toBe(3);
    });
  });

  describe('getVisibleTodos with SHOW_COMPLETED filter', () => {
    it('returns only completed todo items when filter is SHOW_COMPLETED', () => {
      const result = getVisibleTodos(mockTodoState, SHOW_COMPLETED);
      expect(result.todoItems.length).toBe(1);
      expect(result.todoItems[0].id).toBe('2');
      expect(result.todoItems[0].completed).toBe(true);
    });

    it('returns empty array when no todos are completed', () => {
      const emptyCompletedState = { todoItems: [] };
      const result = getVisibleTodos(emptyCompletedState, SHOW_COMPLETED);
      expect(result.todoItems.length).toBe(0);
    });
  });

  describe('getVisibleTodos with SHOW_ACTIVE filter', () => {
    it('returns only active (non-completed) todo items when filter is SHOW_ACTIVE', () => {
      const result = getVisibleTodos(mockTodoState, SHOW_ACTIVE);
      expect(result.todoItems.length).toBe(2);
      expect(result.todoItems[0].id).toBe('1');
      expect(result.todoItems[1].id).toBe('3');
    });

    it('returns empty array when no todos are active', () => {
      const allCompletedState = { todoItems: [{ id: '1', text: 'Done', completed: true }] };
      const result = getVisibleTodos(allCompletedState, SHOW_ACTIVE);
      expect(result.todoItems.length).toBe(0);
    });
  });

  describe('getVisibleTodos with invalid filter', () => {
    it('throws an error for unknown filter type', () => {
      expect(() => getVisibleTodos(mockTodoState, 'INVALID_FILTER')).toThrow('Unknown filter: INVALID_FILTER');
    });
  });
});
