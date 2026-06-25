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

  it('Renders children content', () => {
    render(
      <TestProvider>
        <Link>Test Link</Link>
      </TestProvider>,
    );
    expect(document.body).toHaveTextContent('Test Link');
  });

  it('Renders with isActive prop', () => {
    render(
      <TestProvider>
        <Link isActive={true}>Active Link</Link>
      </TestProvider>,
    );
    expect(document.body).toHaveTextContent('Active Link');
  });

  it('Renders without isActive prop', () => {
    render(
      <TestProvider>
        <Link isActive={false}>Inactive Link</Link>
      </TestProvider>,
    );
    expect(document.body).toHaveTextContent('Inactive Link');
  });
});
