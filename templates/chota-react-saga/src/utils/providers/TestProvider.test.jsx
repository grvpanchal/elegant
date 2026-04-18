import React from 'react';
import { render, screen } from '@testing-library/react';
import TestProvider, { createTestStore } from './TestProvider';

vi.mock('../../utils/api', () => ({
  __esModule: true,
  default: vi.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })),
}));

describe('TestProvider', () => {
  it('Renders children', () => {
    render(
      <TestProvider>
        <div>Test Child</div>
      </TestProvider>,
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('Renders with nested children', () => {
    render(
      <TestProvider>
        <div>
          <span>Level 1</span>
          <span>Level 2</span>
        </div>
      </TestProvider>,
    );
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();
  });

  it('createTestStore creates a valid store with default preloadedState', () => {
    const store = createTestStore();
    expect(store.getState()).toHaveProperty('todo');
    expect(store.getState()).toHaveProperty('filters');
    expect(store.getState()).toHaveProperty('config');
  });
});
