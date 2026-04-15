globalThis.process = {
  env: { NODE_ENV: 'development' },
  version: '',
  nextTick: (fn) => setTimeout(fn, 0),
};

globalThis.__dirname = import.meta.dirname;