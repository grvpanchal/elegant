import React from 'react';
import { render } from '@testing-library/react';
import Loader from './Loader.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Loader />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Loader>Hello</Loader>
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});