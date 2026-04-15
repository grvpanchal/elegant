import * as TodoActions from './todo.actions';

describe('Todo Actions', () => {
  describe('createTodo', () => {
    it('should create an action with id and text', () => {
      const action = TodoActions.createTodo({ id: 1, text: 'Test todo' });
      expect(action.type).toBe('[Todo] CreateTodo');
      expect(action.id).toBe(1);
      expect(action.text).toBe('Test todo');
    });
  });

  describe('editTodo', () => {
    it('should create an action with id and text', () => {
      const action = TodoActions.editTodo({ id: 2, text: 'Editing' });
      expect(action.type).toBe('[Todo] EditTodo');
      expect(action.id).toBe(2);
      expect(action.text).toBe('Editing');
    });
  });

  describe('updateTodo', () => {
    it('should create an action with id and text', () => {
      const action = TodoActions.updateTodo({ id: 3, text: 'Updated' });
      expect(action.type).toBe('[Todo] UpdateTodo');
      expect(action.id).toBe(3);
      expect(action.text).toBe('Updated');
    });
  });

  describe('toggleTodo', () => {
    it('should create an action with id', () => {
      const action = TodoActions.toggleTodo({ id: 1 });
      expect(action.type).toBe('[Todo] ToggleTodo');
      expect(action.id).toBe(1);
    });
  });

  describe('deleteTodo', () => {
    it('should create an action with id', () => {
      const action = TodoActions.deleteTodo({ id: 5 });
      expect(action.type).toBe('[Todo] DeleteTodo');
      expect(action.id).toBe(5);
    });
  });

  describe('loadTodos', () => {
    it('should create an action with todos array', () => {
      const todos = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ];
      const action = TodoActions.loadTodos({ todos });
      expect(action.type).toBe('[Todo] LoadTodos');
      expect(action.todos).toEqual(todos);
    });
  });

  describe('loadTodosRequest', () => {
    it('should create an action with no props', () => {
      const action = TodoActions.loadTodosRequest();
      expect(action.type).toBe('[Todo] LoadTodosRequest');
    });
  });

  describe('loadTodosSuccess', () => {
    it('should create an action with no props', () => {
      const action = TodoActions.loadTodosSuccess();
      expect(action.type).toBe('[Todo] LoadTodosSuccess');
    });
  });

  describe('loadTodosFail', () => {
    it('should create an action with error', () => {
      const action = TodoActions.loadTodosFail({ error: 'Network error' });
      expect(action.type).toBe('[Todo] LoadTodosFail');
      expect(action.error).toBe('Network error');
    });
  });

  describe('addTodoRequest', () => {
    it('should create an action with text', () => {
      const action = TodoActions.addTodoRequest({ text: 'New task' });
      expect(action.type).toBe('[Todo] AddTodoRequest');
      expect(action.text).toBe('New task');
    });
  });

  describe('addTodoSuccess', () => {
    it('should create an action with no props', () => {
      const action = TodoActions.addTodoSuccess();
      expect(action.type).toBe('[Todo] AddTodoSuccess');
    });
  });

  describe('addTodoFail', () => {
    it('should create an action with error', () => {
      const action = TodoActions.addTodoFail({ error: 'Server error' });
      expect(action.type).toBe('[Todo] AddTodoFail');
      expect(action.error).toBe('Server error');
    });
  });

  describe('updateTodoRequest', () => {
    it('should create an action with id and text', () => {
      const action = TodoActions.updateTodoRequest({ id: 10, text: 'Changed' });
      expect(action.type).toBe('[Todo] UpdateTodoRequest');
      expect(action.id).toBe(10);
      expect(action.text).toBe('Changed');
    });
  });

  describe('updateTodoSuccess', () => {
    it('should create an action with no props', () => {
      const action = TodoActions.updateTodoSuccess();
      expect(action.type).toBe('[Todo] UpdateTodoSuccess');
    });
  });

  describe('updateTodoFail', () => {
    it('should create an action with error', () => {
      const action = TodoActions.updateTodoFail({ error: 'Update failed' });
      expect(action.type).toBe('[Todo] UpdateTodoFail');
      expect(action.error).toBe('Update failed');
    });
  });

  describe('deleteTodoRequest', () => {
    it('should create an action with id', () => {
      const action = TodoActions.deleteTodoRequest({ id: 7 });
      expect(action.type).toBe('[Todo] DeleteTodoRequest');
      expect(action.id).toBe(7);
    });
  });

  describe('deleteTodoFail', () => {
    it('should create an action with error', () => {
      const action = TodoActions.deleteTodoFail({ error: 'Delete failed' });
      expect(action.type).toBe('[Todo] DeleteTodoFail');
      expect(action.error).toBe('Delete failed');
    });
  });
});
