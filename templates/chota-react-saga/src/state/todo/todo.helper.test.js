import { mapTodoData, toggleCheckedState } from './todo.helper';

describe('todo helper', () => {
  describe('mapTodoData', () => {
    it('should return the todoData as-is', () => {
      const todoData = [
        { id: 1, text: 'Test', completed: false },
        { id: 2, text: 'Test 2', completed: true },
      ];
      const result = mapTodoData(todoData);
      expect(result).toEqual(todoData);
    });

    it('should return empty array when given empty array', () => {
      const result = mapTodoData([]);
      expect(result).toEqual([]);
    });

    it('should return null when given null', () => {
      const result = mapTodoData(null);
      expect(result).toBeNull();
    });
  });

  describe('toggleCheckedState', () => {
    it('should toggle completed from false to true', () => {
      const payload = { id: 1, text: 'Test', completed: false };
      const result = toggleCheckedState(payload);
      expect(result.completed).toBe(true);
      expect(result.id).toBe(1);
      expect(result.text).toBe('Test');
    });

    it('should toggle completed from true to false', () => {
      const payload = { id: 1, text: 'Test', completed: true };
      const result = toggleCheckedState(payload);
      expect(result.completed).toBe(false);
    });

    it('should not mutate the original payload', () => {
      const payload = { id: 1, text: 'Test', completed: false };
      toggleCheckedState(payload);
      expect(payload.completed).toBe(false);
    });
  });
});
