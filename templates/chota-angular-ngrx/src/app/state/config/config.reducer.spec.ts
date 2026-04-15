import { configReducer } from './config.reducer';
import { updateConfig } from './config.actions';
import initialConfigState from './config.initial';

describe('ConfigReducer', () => {
  it('should return the default state', () => {
    const action = { type: 'UNKNOWN' } as any;
    const state = configReducer(undefined, action);
    expect(state).toEqual(initialConfigState);
  });

  describe('updateConfig', () => {
    it('should update the theme', () => {
      const action = updateConfig({ payload: { theme: 'dark' } });
      const result = configReducer(initialConfigState, action);

      expect(result.theme).toBe('dark');
      expect(result.name).toBe('Todo App');
    });

    it('should update the name', () => {
      const action = updateConfig({ payload: { name: 'My Custom App' } });
      const result = configReducer(initialConfigState, action);

      expect(result.name).toBe('My Custom App');
      expect(result.theme).toBe('light');
    });

    it('should update both theme and name', () => {
      const action = updateConfig({ payload: { theme: 'dark', name: 'Night App' } });
      const result = configReducer(initialConfigState, action);

      expect(result.theme).toBe('dark');
      expect(result.name).toBe('Night App');
    });

    it('should handle empty payload', () => {
      const action = updateConfig({ payload: {} });
      const result = configReducer(initialConfigState, action);

      expect(result).toEqual(initialConfigState);
    });

    it('should toggle theme from light to dark', () => {
      const darkState = { ...initialConfigState, theme: 'dark' };
      const action = updateConfig({ payload: { theme: 'light' } });
      const result = configReducer(darkState, action);

      expect(result.theme).toBe('light');
    });
  });
});
