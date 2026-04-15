import React from 'react';
import { render, screen } from '@testing-library/react';
import TestProvider, { createTestStore } from './TestProvider';

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
        <div>Custom State</div>
      </TestProvider>,
    );
    expect(screen.getByText('Custom State')).toBeInTheDocument();
  });

  it('createTestStore creates a valid store', () => {
    const store = createTestStore();
    expect(store.getState()).toHaveProperty('todo');
    expect(store.getState()).toHaveProperty('filters');
    expect(store.getState()).toHaveProperty('config');
  });

  it('createTestStore with preloadedState', () => {
    const store = createTestStore({ config: { name: 'Preloaded', lang: 'fr', theme: 'dark' } });
    expect(store.getState().config.name).toBe('Preloaded');
  });
});
