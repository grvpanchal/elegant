import React from 'react';
import { render } from '@testing-library/react';
import Image from './Image.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Image />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Image />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});