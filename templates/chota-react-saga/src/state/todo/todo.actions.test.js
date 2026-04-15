import {
  createTodo,
  createTodoSuccess,
  createTodoError,
  readTodo,
  readTodoSuccess,
  readTodoError,
  editTodo,
  updateTodo,
  updateTodoSuccess,
  updateTodoError,
  toggleTodo,
  toggleTodoSuccess,
  toggleTodoError,
  deleteTodo,
  deleteTodoSuccess,
  deleteTodoError,
} from './todo.actions';
import {
  CREATE_TODO,
  CREATE_TODO_SUCCESS,
  CREATE_TODO_ERROR,
  READ_TODO,
  READ_TODO_SUCCESS,
  READ_TODO_ERROR,
  EDIT_TODO,
  UPDATE_TODO,
  UPDATE_TODO_SUCCESS,
  UPDATE_TODO_ERROR,
  TOGGLE_TODO,
  TOGGLE_TODO_SUCCESS,
  TOGGLE_TODO_ERROR,
  DELETE_TODO,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_ERROR,
} from './todo.type';

describe('todo actions', () => {
  it('should create a createTodo action', () => {
    const action = createTodo('Learn Redux');
    expect(action.type).toBe(CREATE_TODO);
    expect(action.payload).toEqual({ text: 'Learn Redux', completed: false });
  });

  it('should create a createTodoSuccess action', () => {
    const payload = { id: 1, text: 'Test' };
    const action = createTodoSuccess(payload);
    expect(action.type).toBe(CREATE_TODO_SUCCESS);
    expect(action.payload).toEqual(payload);
  });

  it('should create a createTodoError action', () => {
    const error = 'Failed to create';
    const action = createTodoError(error);
    expect(action.type).toBe(CREATE_TODO_ERROR);
    expect(action.error).toBe(error);
  });

  it('should create a readTodo action', () => {
    const payload = {};
    const action = readTodo(payload);
    expect(action.type).toBe(READ_TODO);
    expect(action.payload).toEqual(payload);
  });

  it('should create a readTodoSuccess action', () => {
    const payload = [{ id: 1, text: 'Test' }];
    const action = readTodoSuccess(payload);
    expect(action.type).toBe(READ_TODO_SUCCESS);
    expect(action.payload).toEqual(payload);
  });

  it('should create a readTodoError action', () => {
    const error = 'Failed to read';
    const action = readTodoError(error);
    expect(action.type).toBe(READ_TODO_ERROR);
    expect(action.error).toBe(error);
  });

  it('should create an editTodo action', () => {
    const payload = { id: 1, text: 'Edit' };
    const action = editTodo(payload);
    expect(action.type).toBe(EDIT_TODO);
    expect(action.payload).toEqual(payload);
  });

  it('should create an updateTodo action', () => {
    const payload = { id: 1, text: 'Updated' };
    const action = updateTodo(payload);
    expect(action.type).toBe(UPDATE_TODO);
    expect(action.payload).toEqual(payload);
  });

  it('should create an updateTodoSuccess action', () => {
    const payload = { id: 1, text: 'Updated' };
    const action = updateTodoSuccess(payload);
    expect(action.type).toBe(UPDATE_TODO_SUCCESS);
    expect(action.payload).toEqual(payload);
  });

  it('should create an updateTodoError action', () => {
    const error = 'Update failed';
    const action = updateTodoError(error);
    expect(action.type).toBe(UPDATE_TODO_ERROR);
    expect(action.error).toBe(error);
  });

  it('should create a toggleTodo action', () => {
    const payload = { id: 1 };
    const action = toggleTodo(payload);
    expect(action.type).toBe(TOGGLE_TODO);
    expect(action.payload).toEqual(payload);
  });

  it('should create a toggleTodoSuccess action', () => {
    const action = toggleTodoSuccess();
    expect(action.type).toBe(TOGGLE_TODO_SUCCESS);
  });

  it('should create a toggleTodoError action', () => {
    const payload = [{ id: 1, text: 'Test' }];
    const error = 'Toggle failed';
    const action = toggleTodoError(payload, error);
    expect(action.type).toBe(TOGGLE_TODO_ERROR);
    expect(action.payload).toEqual(payload);
    expect(action.error).toBe(error);
  });

  it('should create a deleteTodo action', () => {
    const action = deleteTodo(1);
    expect(action.type).toBe(DELETE_TODO);
    expect(action.payload).toEqual({ id: 1 });
  });

  it('should create a deleteTodoSuccess action', () => {
    const action = deleteTodoSuccess();
    expect(action.type).toBe(DELETE_TODO_SUCCESS);
  });

  it('should create a deleteTodoError action', () => {
    const payload = [{ id: 1, text: 'Test' }];
    const error = 'Delete failed';
    const action = deleteTodoError(payload, error);
    expect(action.type).toBe(DELETE_TODO_ERROR);
    expect(action.payload).toEqual(payload);
    expect(action.error).toBe(error);
  });
});
