import rootReducer from './rootReducer';
import initialTodoState from './todo/todo.initial';
import initialFiltersState from './filters/filters.initial';
import initialConfigState from './config/config.initial';

describe('Root Reducer', () => {
  it('returns combined state with all slices on undefined input', () => {
    const action = { type: '@@INIT' };
    const result = rootReducer(undefined, action);
    
    expect(result).toBeDefined();
    expect(result.todo).toBeDefined();
    expect(result.filters).toBeDefined();
    expect(result.config).toBeDefined();
  });

  it('combines todo slice correctly', () => {
    const initialState = { todo: initialTodoState };
    const action = { type: 'UNKNOWN' };
    
    const result = rootReducer(initialState, action);
    expect(result.todo).toBe(initialTodoState);
  });

  it('combines filters slice correctly', () => {
    const initialState = { filters: initialFiltersState };
    const action = { type: 'UNKNOWN' };
    
    const result = rootReducer(initialState, action);
    expect(result.filters).toBe(initialFiltersState);
  });

  it('combines config slice correctly', () => {
    const initialState = { config: initialConfigState };
    const action = { type: 'UNKNOWN' };
    
    const result = rootReducer(initialState, action);
    expect(result.config).toBe(initialConfigState);
  });

  it('maintains separate state for each slice', () => {
    const initialState = {
      todo: initialTodoState,
      filters: initialFiltersState,
      config: initialConfigState,
    };
    
    const action = { type: '@@INIT' };
    const result = rootReducer(initialState, action);
    
    expect(result.todo).not.toBe(result.filters);
    expect(result.config).not.toBe(result.todo);
  });
});
