import { getVisibleTodos } from './todo.selectors';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../filters/filters.type';

describe('todo selectors', () => {
  const mockTodoState = {
    isLoading: false,
    isActionLoading: false,
    isContentLoading: false,
    error: '',
    todoItems: [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true },
      { id: 3, text: 'Todo 3', completed: false },
    ],
    currentTodoItem: { text: '', id: '' },
  };

  it('should return all todos for SHOW_ALL filter', () => {
    const result = getVisibleTodos(mockTodoState, SHOW_ALL);
    expect(result.todoItems).toHaveLength(3);
  });

  it('should return only completed todos for SHOW_COMPLETED filter', () => {
    const result = getVisibleTodos(mockTodoState, SHOW_COMPLETED);
    expect(result.todoItems).toHaveLength(1);
    expect(result.todoItems[0].completed).toBe(true);
  });

  it('should return only active todos for SHOW_ACTIVE filter', () => {
    const result = getVisibleTodos(mockTodoState, SHOW_ACTIVE);
    expect(result.todoItems).toHaveLength(2);
    expect(result.todoItems.every(t => !t.completed)).toBe(true);
  });

  it('should throw error for unknown filter', () => {
    expect(() => getVisibleTodos(mockTodoState, 'UNKNOWN_FILTER')).toThrow('Unknown filter: UNKNOWN_FILTER');
  });

  it('should return spread todo state with filtered items', () => {
    const result = getVisibleTodos(mockTodoState, SHOW_ALL);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('');
    expect(result.currentTodoItem).toEqual(mockTodoState.currentTodoItem);
  });
});
