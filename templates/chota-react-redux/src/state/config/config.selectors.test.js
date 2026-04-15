import {
  getTheme,
  getAppName,
  getLanguage,
} from './config.selectors';

describe('Config Selectors', () => {
  const mockState = {
    config: {
      name: 'Todo App',
      lang: 'en',
      theme: 'dark',
    },
  };

  describe('getTheme', () => {
    it('returns the current theme from state', () => {
      const result = getTheme(mockState);
      expect(result).toBe('dark');
    });

    it('handles different theme values', () => {
      const lightState = { config: { name: 'App', lang: 'en', theme: 'light' } };
      const result = getTheme(lightState);
      expect(result).toBe('light');
    });
  });

  describe('getAppName', () => {
    it('returns the app name from state', () => {
      const result = getAppName(mockState);
      expect(result).toBe('Todo App');
    });

    it('handles different app names', () => {
      const customState = { config: { name: 'My Custom App', lang: 'en', theme: 'light' } };
      const result = getAppName(customState);
      expect(result).toBe('My Custom App');
    });
  });

  describe('getLanguage', () => {
    it('returns the language from state', () => {
      const result = getLanguage(mockState);
      expect(result).toBe('en');
    });

    it('handles different language values', () => {
      const spanishState = { config: { name: 'App', lang: 'es', theme: 'light' } };
      const result = getLanguage(spanishState);
      expect(result).toBe('es');
    });
  });
});
