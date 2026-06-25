import { createAppStore } from '../index';

describe('config slice', () => {
  it('starts from the initial config', () => {
    const store = createAppStore();
    expect(store.getState().config.name).toBe('Todo App');
    expect(store.getState().config.theme).toBe('light');
  });

  it('updateConfig merges the payload and preserves other keys', () => {
    const store = createAppStore();
    store.getState().updateConfig({ theme: 'dark' });
    expect(store.getState().config.theme).toBe('dark');
    expect(store.getState().config.name).toBe('Todo App');
  });

  it('updateConfig can update multiple keys at once', () => {
    const store = createAppStore();
    store.getState().updateConfig({ theme: 'dark', lang: 'fr' });
    expect(store.getState().config.theme).toBe('dark');
    expect(store.getState().config.lang).toBe('fr');
  });
});
