import React from 'react';
import { render } from '@testing-library/react';
import Input from './Input.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Input />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Input />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});