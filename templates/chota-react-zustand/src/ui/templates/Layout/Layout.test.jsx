import React from 'react';
import { render } from '@testing-library/react';
import Layout from './Layout.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Layout />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Layout />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders children', () => {
    render(
      <TestProvider>
        <Layout>
          <div>Child Content</div>
        </Layout>
      </TestProvider>,
    );
    expect(document.body).toHaveTextContent('Child Content');
  });

  it('Renders with container and layout classes', () => {
    const { container } = render(
      <TestProvider>
        <Layout />
      </TestProvider>,
    );
    expect(container.querySelector('.container.layout')).toBeInTheDocument();
  });
});
