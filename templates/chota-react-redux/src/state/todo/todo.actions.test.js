import { createTodo, editTodo, updateTodo, deleteTodo, toggleTodo } from './todo.actions';
import { CREATE_TODO, EDIT_TODO, UPDATE_TODO, DELETE_TODO, TOGGLE_TODO } from './todo.type';

describe('todo actions', () => {
  it('should create a createTodo action', () => {
    const action = createTodo('Learn Redux');
    expect(action.type).toBe(CREATE_TODO);
    expect(action.payload).toHaveProperty('id');
    expect(action.payload.text).toBe('Learn Redux');
  });

  it('should create incrementing ids for createTodo actions', () => {
    const action1 = createTodo('First');
    const action2 = createTodo('Second');
    expect(action2.payload.id).toBe(action1.payload.id + 1);
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

  it('should create a deleteTodo action', () => {
    const action = deleteTodo(1);
    expect(action.type).toBe(DELETE_TODO);
    expect(action.payload).toEqual({ id: 1 });
  });

  it('should create a toggleTodo action', () => {
    const payload = { id: 1 };
    const action = toggleTodo(payload);
    expect(action.type).toBe(TOGGLE_TODO);
    expect(action.payload).toEqual(payload);
  });
});
