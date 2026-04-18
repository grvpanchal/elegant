import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../state/rootReducer';
import TestProvider, { TestProvider as NamedTestProvider, createTestStore } from './TestProvider';

describe('TestProvider', () => {
  it('Renders children', () => {
    render(
      <TestProvider>
        <div>Test Child</div>
      </TestProvider>,
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('Renders with preloadedState', () => {
    render(
      <TestProvider preloadedState={{ config: { name: 'Custom App', lang: 'en', theme: 'dark' } }}>
        <div>Test</div>
      </TestProvider>,
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('Renders with custom store', () => {
    const customStore = configureStore({
      reducer: rootReducer,
      preloadedState: { config: { name: 'Store App', lang: 'en', theme: 'light' } },
    });
    render(
      <NamedTestProvider store={customStore}>
        <div>Store Test</div>
      </NamedTestProvider>,
    );
    expect(screen.getByText('Store Test')).toBeInTheDocument();
  });

  it('Uses preloadedState when no store is provided', () => {
    render(
      <NamedTestProvider preloadedState={{ config: { name: 'Preloaded App', lang: 'de', theme: 'dark' } }}>
        <div>Preloaded Test</div>
      </NamedTestProvider>,
    );
    expect(screen.getByText('Preloaded Test')).toBeInTheDocument();
  });

  it('Uses default empty preloadedState when neither store nor preloadedState provided', () => {
    render(
      <TestProvider>
        <div>Default State Test</div>
      </TestProvider>,
    );
    expect(screen.getByText('Default State Test')).toBeInTheDocument();
  });

  it('createTestStore with no arguments uses default preloadedState', () => {
    const store = createTestStore();
    expect(store.getState()).toHaveProperty('todo');
    expect(store.getState()).toHaveProperty('filters');
    expect(store.getState()).toHaveProperty('config');
  });
});
