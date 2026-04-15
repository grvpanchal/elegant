import { getConfig } from './config.selectors';

describe('config selectors', () => {
  it('should return the config state', () => {
    const state = {
      config: { name: 'Test App', lang: 'en', theme: 'light' },
    };
    expect(getConfig(state)).toEqual({ name: 'Test App', lang: 'en', theme: 'light' });
  });
});
