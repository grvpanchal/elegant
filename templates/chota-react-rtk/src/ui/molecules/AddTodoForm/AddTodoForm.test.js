import React from 'react';
import { render } from '@testing-library/react';
import AddTodoForm from './AddTodoForm.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<AddTodoForm />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <AddTodoForm />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});