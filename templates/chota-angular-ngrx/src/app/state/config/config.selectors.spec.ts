import { getConfigState, getTheme, getBrandName } from './config.selectors';
import { AppState } from '../index';

describe('Config Selectors', () => {
  const createAppState = (config = { name: 'Todo App', theme: 'light' }): AppState => ({
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [],
      currentTodoItem: { id: null, text: '' },
    },
    filters: [],
    config,
  });

  beforeEach(() => {
    getTheme.release();
    getBrandName.release();
  });

  describe('getConfigState', () => {
    it('should return the config slice of state', () => {
      const state = createAppState({ name: 'Test App', theme: 'dark' });
      const result = getConfigState(state);
      expect(result).toEqual({ name: 'Test App', theme: 'dark' });
    });
  });

  describe('getTheme', () => {
    it('should return the theme from config state', () => {
      const state = createAppState({ name: 'Todo App', theme: 'light' });
      const config = getConfigState(state);
      expect(config.theme).toBe('light');
    });

    it('should return dark theme when configured', () => {
      const state = createAppState({ name: 'Todo App', theme: 'dark' });
      const config = getConfigState(state);
      expect(config.theme).toBe('dark');
    });
  });

  describe('getBrandName', () => {
    it('should return the name from config state', () => {
      const state = createAppState({ name: 'Todo App', theme: 'light' });
      const config = getConfigState(state);
      expect(config.name).toBe('Todo App');
    });

    it('should return custom brand name', () => {
      const state = createAppState({ name: 'My Custom Brand', theme: 'dark' });
      const config = getConfigState(state);
      expect(config.name).toBe('My Custom Brand');
    });
  });
});
