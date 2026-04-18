import React from 'react';
import { render } from '@testing-library/react';
import Button from './Button.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Button />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Button>Hello</Button>
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});
