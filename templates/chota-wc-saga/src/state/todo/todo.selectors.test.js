import { expect } from '@open-wc/testing';
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

  it('returns all todos for SHOW_ALL', () => {
    const result = getVisibleTodos(mockTodoState, SHOW_ALL);
    expect(result.todoItems).to.have.lengthOf(3);
  });

  it('returns only completed todos for SHOW_COMPLETED', () => {
    const result = getVisibleTodos(mockTodoState, SHOW_COMPLETED);
    expect(result.todoItems).to.have.lengthOf(1);
    expect(result.todoItems[0].completed).to.equal(true);
  });

  it('returns only active todos for SHOW_ACTIVE', () => {
    const result = getVisibleTodos(mockTodoState, SHOW_ACTIVE);
    expect(result.todoItems).to.have.lengthOf(2);
    expect(result.todoItems.every(t => !t.completed)).to.equal(true);
  });

  it('throws error for unknown filter', () => {
    expect(() => getVisibleTodos(mockTodoState, 'UNKNOWN')).to.throw('Unknown filter: UNKNOWN');
  });

  it('returns spread todo state with filtered items', () => {
    const result = getVisibleTodos(mockTodoState, SHOW_ALL);
    expect(result.isLoading).to.equal(false);
    expect(result.error).to.equal('');
    expect(result.currentTodoItem).to.deep.equal(mockTodoState.currentTodoItem);
  });
});
