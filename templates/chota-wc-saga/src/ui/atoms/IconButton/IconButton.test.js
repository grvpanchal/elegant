import React from 'react';
import { render } from '@testing-library/react';
import IconButton from './IconButton.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<IconButton />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <IconButton />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});