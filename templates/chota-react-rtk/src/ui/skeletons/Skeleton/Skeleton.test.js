import React from 'react';
import { render, screen } from '@testing-library/react';
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

  it('Renders with default variant "text"', () => {
    render(
      <TestProvider>
        <Skeleton />
      </TestProvider>,
    );
    const skeleton = document.querySelector('.skeleton');
    expect(skeleton).toHaveClass('skeleton-text');
  });

  it('Renders with custom variant', () => {
    render(
      <TestProvider>
        <Skeleton variant="circle" />
      </TestProvider>,
    );
    const skeleton = document.querySelector('.skeleton');
    expect(skeleton).toHaveClass('skeleton-circle');
  });

  it('Renders with height prop', () => {
    render(
      <TestProvider>
        <Skeleton height="24px" />
      </TestProvider>,
    );
    const skeleton = document.querySelector('.skeleton');
    expect(skeleton).toHaveStyle('height: 24px');
  });

  it('Renders with width prop', () => {
    render(
      <TestProvider>
        <Skeleton width="100px" />
      </TestProvider>,
    );
    const skeleton = document.querySelector('.skeleton');
    expect(skeleton).toHaveStyle('width: 100px');
  });

  it('Renders with custom style prop', () => {
    render(
      <TestProvider>
        <Skeleton style={{ backgroundColor: 'red' }} />
      </TestProvider>,
    );
    const skeleton = document.querySelector('.skeleton');
    expect(skeleton).toHaveStyle('background-color: red');
  });

  it('Merges style prop with height and width', () => {
    render(
      <TestProvider>
        <Skeleton height="50px" width="50px" style={{ margin: '10px' }} />
      </TestProvider>,
    );
    const skeleton = document.querySelector('.skeleton');
    expect(skeleton).toHaveStyle('height: 50px');
    expect(skeleton).toHaveStyle('width: 50px');
    expect(skeleton).toHaveStyle('margin: 10px');
  });
});
