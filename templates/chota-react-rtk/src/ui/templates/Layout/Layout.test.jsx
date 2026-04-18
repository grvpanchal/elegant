import React from 'react';
import { render, screen } from '@testing-library/react';
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
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('Renders with container and layout classes', () => {
    const { container } = render(
      <TestProvider>
        <Layout>
          <div>Test</div>
        </Layout>
      </TestProvider>,
    );
    const layoutDiv = container.querySelector('.container.layout');
    expect(layoutDiv).toBeInTheDocument();
  });

  it('Renders multiple children', () => {
    render(
      <TestProvider>
        <Layout>
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </Layout>
      </TestProvider>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });
});
