const getConfig = (state) => state.config;

export const getTheme = (state) => getConfig(state).theme;

export const getAppName = (state) => getConfig(state).name;

export const getLanguage = (state) => getConfig(state).lang;
