import configReducer from './config.reducer';
import { updateConfig } from './config.actions';
import { UPDATE_CONFIG } from './config.type';
import initialConfigState from './config.initial';

describe('config reducer', () => {
  it('should return the initial state', () => {
    expect(configReducer(undefined, { type: 'unknown' })).toEqual(initialConfigState);
  });

  it('should handle UPDATE_CONFIG', () => {
    const nextState = configReducer(initialConfigState, updateConfig({ theme: 'dark' }));
    expect(nextState.theme).toBe('dark');
    expect(nextState.name).toBe('Todo App');
    expect(nextState.lang).toBe('en');
  });

  it('should handle UPDATE_CONFIG with multiple fields', () => {
    const nextState = configReducer(initialConfigState, updateConfig({ name: 'My App', lang: 'fr' }));
    expect(nextState.name).toBe('My App');
    expect(nextState.lang).toBe('fr');
    expect(nextState.theme).toBe('light');
  });

  it('should return current state for unknown action', () => {
    const currentState = { name: 'Custom', lang: 'de', theme: 'dark' };
    expect(configReducer(currentState, { type: 'unknown' })).toEqual(currentState);
  });
});

describe('config actions', () => {
  it('should create an updateConfig action', () => {
    const payload = { theme: 'dark' };
    const action = updateConfig(payload);
    expect(action.type).toBe(UPDATE_CONFIG);
    expect(action.payload).toEqual(payload);
  });
});
