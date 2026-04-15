import { expect } from '@open-wc/testing';
import configReducer from './config.reducer';
import initialConfigState from './config.initial';
import { updateConfig } from './config.actions';
import { UPDATE_CONFIG } from './config.type';

describe('config reducer', () => {
  it('returns initial state for unknown action', () => {
    expect(configReducer(undefined, { type: 'UNKNOWN' })).to.deep.equal(initialConfigState);
  });

  it('handles UPDATE_CONFIG', () => {
    const state = configReducer(initialConfigState, updateConfig({ theme: 'dark' }));
    expect(state.theme).to.equal('dark');
    expect(state.name).to.equal('Todo App');
    expect(state.lang).to.equal('en');
  });

  it('handles UPDATE_CONFIG with multiple fields', () => {
    const state = configReducer(initialConfigState, updateConfig({ name: 'My App', lang: 'fr' }));
    expect(state.name).to.equal('My App');
    expect(state.lang).to.equal('fr');
    expect(state.theme).to.equal('light');
  });
});

describe('config actions', () => {
  it('updateConfig returns correct action', () => {
    const action = updateConfig({ theme: 'dark' });
    expect(action.type).to.equal(UPDATE_CONFIG);
    expect(action.payload).to.deep.equal({ theme: 'dark' });
  });
});
