import { createRootSlice } from './rootStore';

describe('createRootSlice', () => {
  const slice = createRootSlice(() => {}, () => ({}), {});

  it('namespaces each domain', () => {
    expect(slice).toHaveProperty('todo');
    expect(slice).toHaveProperty('filters');
    expect(slice).toHaveProperty('config');
  });

  it('exposes the actions from every slice', () => {
    expect(typeof slice.readTodo).toBe('function');
    expect(typeof slice.createTodo).toBe('function');
    expect(typeof slice.setVisibilityFilter).toBe('function');
    expect(typeof slice.updateConfig).toBe('function');
  });

  it('keeps the domain state separate', () => {
    expect(Array.isArray(slice.filters)).toBe(true);
    expect(slice.todo.todoItems).toEqual([]);
    expect(slice.config.name).toBe('Todo App');
  });
});
