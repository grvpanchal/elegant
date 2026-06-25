import React from 'react';
import { render } from '@testing-library/react';
import Skeleton from './Skeleton.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Skeleton />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Skeleton />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders with skeleton and skeleton-text class by default', () => {
    const { container } = render(
      <TestProvider>
        <Skeleton />
      </TestProvider>,
    );
    expect(container.querySelector('.skeleton.skeleton-text')).toBeInTheDocument();
  });

  it('Renders with custom variant', () => {
    const { container } = render(
      <TestProvider>
        <Skeleton variant="card" />
      </TestProvider>,
    );
    expect(container.querySelector('.skeleton.skeleton-card')).toBeInTheDocument();
  });

  it('Renders with custom height', () => {
    const { container } = render(
      <TestProvider>
        <Skeleton height="48px" />
      </TestProvider>,
    );
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toHaveStyle('height: 48px');
  });

  it('Renders with custom width', () => {
    const { container } = render(
      <TestProvider>
        <Skeleton width="200px" />
      </TestProvider>,
    );
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toHaveStyle('width: 200px');
  });

  it('Renders with both height and width', () => {
    const { container } = render(
      <TestProvider>
        <Skeleton height="32px" width="100%" />
      </TestProvider>,
    );
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toHaveStyle('height: 32px');
    expect(skeleton).toHaveStyle('width: 100%');
  });
});
