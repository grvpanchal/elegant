import {
  CREATE_TODO,
  EDIT_TODO,
  UPDATE_TODO,
  TOGGLE_TODO,
  DELETE_TODO,
} from './todo.type';

describe('Todo Action Types', () => {
  it('exports CREATE_TODO constant', () => {
    expect(CREATE_TODO).toBe('CREATE_TODO');
  });

  it('exports EDIT_TODO constant', () => {
    expect(EDIT_TODO).toBe('EDIT_TODO');
  });

  it('exports UPDATE_TODO constant', () => {
    expect(UPDATE_TODO).toBe('UPDATE_TODO');
  });

  it('exports TOGGLE_TODO constant', () => {
    expect(TOGGLE_TODO).toBe('TOGGLE_TODO');
  });

  it('exports DELETE_TODO constant', () => {
    expect(DELETE_TODO).toBe('DELETE_TODO');
  });
});
