import useStore, { createAppStore } from './index';

describe('store', () => {
  it('singleton exposes namespaced state and actions', () => {
    const state = useStore.getState();
    expect(state.todo).toBeDefined();
    expect(state.filters).toBeDefined();
    expect(state.config).toBeDefined();
    expect(typeof state.readTodo).toBe('function');
    expect(typeof state.setVisibilityFilter).toBe('function');
    expect(typeof state.updateConfig).toBe('function');
  });

  it('createAppStore shallow-merges preloaded namespaces', () => {
    const store = createAppStore({ config: { theme: 'dark' }, todo: { error: 'x' } });
    expect(store.getState().config.theme).toBe('dark');
    expect(store.getState().config.name).toBe('Todo App');
    expect(store.getState().todo.error).toBe('x');
    expect(typeof store.getState().readTodo).toBe('function');
  });

  it('createAppStore replaces preloaded filters wholesale', () => {
    const filters = [{ id: 'SHOW_ALL', label: 'All', selected: false }];
    const store = createAppStore({ filters });
    expect(store.getState().filters).toEqual(filters);
  });
});
