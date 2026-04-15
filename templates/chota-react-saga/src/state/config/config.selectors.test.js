import { getConfig } from './config.selectors';

describe('config selectors', () => {
  const mockState = {
    config: { name: 'Todo App', lang: 'en', theme: 'light' },
  };

  it('should return the config state', () => {
    const result = getConfig(mockState);
    expect(result).toEqual({ name: 'Todo App', lang: 'en', theme: 'light' });
  });
});
