import React from 'react';
import { render } from '@testing-library/react';
import Link from './Link.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Link />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Link>Hello</Link>
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});