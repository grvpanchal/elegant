import React from 'react';
import { render } from '@testing-library/react';
import Skeleton from './Skeleton.component';

describe('<Skeleton />', () => {
  it('Renders successfully without error with default props', () => {
    const { container, rerender } = render(<Skeleton />);
    expect(container).toBeTruthy();
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toHaveClass('skeleton-text');
  });

  it('Renders with custom variant prop', () => {
    const { container } = render(<Skeleton variant="circle" />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toHaveClass('skeleton-circle');
  });

  it('Applies custom height style when provided', () => {
    const { container } = render(<Skeleton height="50px" />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton.style.height).toBe('50px');
  });

  it('Applies custom width style when provided', () => {
    const { container } = render(<Skeleton width="200px" />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton.style.width).toBe('200px');
  });

  it('Applies custom style prop', () => {
    const { container } = render(<Skeleton style={{ borderRadius: '8px' }} />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton.style.borderRadius).toBe('8px');
  });

  it('Combines custom height and width styles', () => {
    const { container } = render(<Skeleton height="100px" width="300px" />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton.style.height).toBe('100px');
    expect(skeleton.style.width).toBe('300px');
  });

  it('Renders with default text variant when no variant prop', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton.classList.contains('skeleton-text')).toBe(true);
  });
});
