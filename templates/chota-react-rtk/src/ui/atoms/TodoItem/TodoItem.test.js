import React from 'react';
import { render } from '@testing-library/react';
import TodoItem from './TodoItem.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<TodoItem />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <TodoItem />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});