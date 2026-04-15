import { updateConfig } from './config.actions';
import { UPDATE_CONFIG } from './config.type';

describe('config actions', () => {
  it('should create an updateConfig action', () => {
    const payload = { theme: 'dark' };
    const action = updateConfig(payload);
    expect(action.type).toBe(UPDATE_CONFIG);
    expect(action.payload).toEqual(payload);
  });

  it('should create an updateConfig action with multiple properties', () => {
    const payload = { theme: 'dark', lang: 'fr' };
    const action = updateConfig(payload);
    expect(action.type).toBe(UPDATE_CONFIG);
    expect(action.payload).toEqual(payload);
  });
});
