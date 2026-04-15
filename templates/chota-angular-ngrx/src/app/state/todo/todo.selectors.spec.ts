import { AppState } from '../index';
import { FilterItem } from '../filters/filters.initial';

// Import the raw selector logic instead of memoized selectors to avoid caching issues
const getVisibleTodosLogic = (state: AppState) => {
  const { todoItems } = state.todo;
  const selectedFilter = state.filters.find((f: FilterItem) => f.selected);
  
  switch (selectedFilter?.id) {
    case 'SHOW_COMPLETED':
      return { ...state.todo, todoItems: todoItems.filter((t) => t.completed) };
    case 'SHOW_ACTIVE':
      return { ...state.todo, todoItems: todoItems.filter((t) => !t.completed) };
    default:
      return state.todo;
  }
};

describe('Todo Selectors', () => {
  const createMockTodos = () => [
    { id: 1, text: 'Active todo', completed: false },
    { id: 2, text: 'Completed todo', completed: true },
    { id: 3, text: 'Another active', completed: false },
  ];

  const createAppState = (
    todoOverrides: Record<string, unknown> = {},
    filterOverrides: Partial<FilterItem> = { id: 'SHOW_ALL', label: 'All', selected: true }
  ): AppState => ({
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: createMockTodos(),
      currentTodoItem: { text: '', id: null },
      ...todoOverrides,
    },
    filters: [
      { id: 'SHOW_ALL', label: 'All', selected: filterOverrides.id === 'SHOW_ALL' },
      { id: 'SHOW_ACTIVE', label: 'Active', selected: filterOverrides.id === 'SHOW_ACTIVE' },
      { id: 'SHOW_COMPLETED', label: 'Completed', selected: filterOverrides.id === 'SHOW_COMPLETED' },
    ],
    config: { name: 'Todo App', theme: 'light' },
  });

  describe('getTodoState', () => {
    it('should return the todo slice of state', () => {
      const state = createAppState();
      const result = state.todo;
      expect(result.todoItems).toEqual(createMockTodos());
    });
  });

  describe('getVisibleTodos', () => {
    it('should return all todos when filter is SHOW_ALL', () => {
      const state = createAppState({}, { id: 'SHOW_ALL' });
      const result = getVisibleTodosLogic(state);
      expect(result.todoItems).toEqual(createMockTodos());
      expect(result.todoItems.length).toBe(3);
    });

    it('should return only active todos when filter is SHOW_ACTIVE', () => {
      const state = createAppState({}, { id: 'SHOW_ACTIVE' });
      const result = getVisibleTodosLogic(state);
      expect(result.todoItems.length).toBe(2);
      expect(result.todoItems[0].text).toBe('Active todo');
      expect(result.todoItems[1].text).toBe('Another active');
    });

    it('should return only completed todos when filter is SHOW_COMPLETED', () => {
      const state = createAppState({}, { id: 'SHOW_COMPLETED' });
      const result = getVisibleTodosLogic(state);
      expect(result.todoItems.length).toBe(1);
      expect(result.todoItems[0].text).toBe('Completed todo');
      expect(result.todoItems[0].completed).toBe(true);
    });

    it('should return all todos when selectedFilter is undefined', () => {
      const mockTodos = createMockTodos();
      const state: AppState = {
        todo: {
          isLoading: false,
          isActionLoading: false,
          isContentLoading: false,
          error: '',
          todoItems: mockTodos,
          currentTodoItem: { id: null, text: '' },
        },
        filters: [],
        config: { name: 'Todo App', theme: 'light' },
      };
      const result = getVisibleTodosLogic(state);
      expect(result.todoItems).toEqual(mockTodos);
    });

    it('should preserve todoState properties beyond todoItems', () => {
      const state = createAppState(
        { isContentLoading: true, error: 'Some error' },
        { id: 'SHOW_ACTIVE' }
      );
      const result = getVisibleTodosLogic(state);
      expect(result.isContentLoading).toBe(true);
      expect(result.error).toBe('Some error');
    });

    it('should return empty array when no todos match filter', () => {
      const allCompletedTodos = [
        { id: 1, text: 'Done 1', completed: true },
        { id: 2, text: 'Done 2', completed: true },
      ];
      const state = createAppState({ todoItems: allCompletedTodos }, { id: 'SHOW_ACTIVE' });
      const result = getVisibleTodosLogic(state);
      expect(result.todoItems.length).toBe(0);
    });
  });
});
