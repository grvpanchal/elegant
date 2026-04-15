import config from './config.reducer';
import initialConfigState from './config.initial';
import { UPDATE_CONFIG } from './config.type';

describe('Config Reducer', () => {
  it('returns the initial state when action type is not recognized', () => {
    const initialState = initialConfigState;
    const action = { type: 'UNKNOWN_ACTION' };
    
    const result = config(initialState, action);
    expect(result).toBe(initialState);
  });

  it('returns initial state when no state is provided', () => {
    const action = { type: UPDATE_CONFIG, payload: { theme: 'dark' } };
    const result = config(undefined, action);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  describe('UPDATE_CONFIG action', () => {
    it('updates the theme property', () => {
      const initialState = initialConfigState;
      
      const action = {
        type: UPDATE_CONFIG,
        payload: { theme: 'dark' },
      };
      
      const result = config(initialState, action);
      expect(result.theme).toBe('dark');
    });

    it('updates the name property', () => {
      const initialState = initialConfigState;
      
      const action = {
        type: UPDATE_CONFIG,
        payload: { name: 'Custom App' },
      };
      
      const result = config(initialState, action);
      expect(result.name).toBe('Custom App');
    });

    it('updates the lang property', () => {
      const initialState = initialConfigState;
      
      const action = {
        type: UPDATE_CONFIG,
        payload: { lang: 'es' },
      };
      
      const result = config(initialState, action);
      expect(result.lang).toBe('es');
    });

    it('updates multiple properties at once', () => {
      const initialState = initialConfigState;
      
      const action = {
        type: UPDATE_CONFIG,
        payload: { theme: 'dark', lang: 'fr' },
      };
      
      const result = config(initialState, action);
      expect(result.theme).toBe('dark');
      expect(result.lang).toBe('fr');
    });

    it('preserves other properties when updating one', () => {
      const initialState = initialConfigState;
      
      const action = {
        type: UPDATE_CONFIG,
        payload: { theme: 'dark' },
      };
      
      const result = config(initialState, action);
      expect(result.name).toBe(initialState.name);
      expect(result.lang).toBe(initialState.lang);
    });
  });
});
