describe('rootReducer', () => {
  let rootReducer;
  let createTodo;
  let setVisibilityFilter;
  let updateConfig;
  let SHOW_ALL;

  beforeEach(() => {
    jest.resetModules();
    rootReducer = require('./rootReducer').default;
    createTodo = require('./todo/todo.actions').createTodo;
    setVisibilityFilter = require('./filters/filters.action').setVisibilityFilter;
    updateConfig = require('./config/config.actions').updateConfig;
    SHOW_ALL = require('./filters/filters.type').SHOW_ALL;
  });

  it('should combine all reducers', () => {
    const state = rootReducer(undefined, { type: 'INIT' });
    expect(state).toHaveProperty('todo');
    expect(state).toHaveProperty('filters');
    expect(state).toHaveProperty('config');
  });

  it('should delegate actions to correct reducers', () => {
    const state = rootReducer(undefined, createTodo('Test'));
    expect(state.todo.todoItems).toHaveLength(1);
    expect(state.filters).toBeDefined();
    expect(state.config).toBeDefined();
  });

  it('should use combineReducers internally', () => {
    expect(rootReducer).toBeDefined();
    expect(typeof rootReducer).toBe('function');
  });

  it('should return combined state with correct initial values', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.todo.todoItems).toEqual([]);
    expect(state.filters).toHaveLength(3);
    expect(state.config.name).toBe('Todo App');
  });

  it('should handle actions across all reducers', () => {
    let state = rootReducer(undefined, { type: '@@INIT' });
    state = rootReducer(state, createTodo('Test'));
    state = rootReducer(state, setVisibilityFilter(SHOW_ALL));
    state = rootReducer(state, updateConfig({ theme: 'dark' }));

    expect(state.todo.todoItems).toHaveLength(1);
    expect(state.filters.find(f => f.id === SHOW_ALL).selected).toBe(true);
    expect(state.config.theme).toBe('dark');
  });
});
