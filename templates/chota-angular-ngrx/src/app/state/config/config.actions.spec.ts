import * as ConfigActions from './config.actions';

describe('Config Actions', () => {
  describe('updateConfig', () => {
    it('should create an action with theme payload', () => {
      const action = ConfigActions.updateConfig({ payload: { theme: 'dark' } });
      expect(action.type).toBe('[Config] UpdateConfig');
      expect(action.payload).toEqual({ theme: 'dark' });
    });

    it('should create an action with name payload', () => {
      const action = ConfigActions.updateConfig({ payload: { name: 'New Name' } });
      expect(action.type).toBe('[Config] UpdateConfig');
      expect(action.payload).toEqual({ name: 'New Name' });
    });

    it('should create an action with both theme and name payload', () => {
      const action = ConfigActions.updateConfig({
        payload: { theme: 'dark', name: 'Dark App' },
      });
      expect(action.type).toBe('[Config] UpdateConfig');
      expect(action.payload).toEqual({ theme: 'dark', name: 'Dark App' });
    });

    it('should create an action with empty payload', () => {
      const action = ConfigActions.updateConfig({ payload: {} });
      expect(action.type).toBe('[Config] UpdateConfig');
      expect(action.payload).toEqual({});
    });
  });
});
