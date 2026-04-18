import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Link from './Link.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Link />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Link isActive={false} onClick={() => {}}>Hello</Link>
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders with primary class when isActive is true', () => {
    render(
      <TestProvider>
        <Link isActive={true} onClick={() => {}}>Active Link</Link>
      </TestProvider>,
    );
    const link = screen.getByText('Active Link');
    expect(link).toHaveClass('primary');
    expect(link).not.toHaveClass('outline');
  });

  it('Renders with outline class when isActive is false', () => {
    render(
      <TestProvider>
        <Link isActive={false} onClick={() => {}}>Inactive Link</Link>
      </TestProvider>,
    );
    const link = screen.getByText('Inactive Link');
    expect(link).toHaveClass('outline');
    expect(link).not.toHaveClass('primary');
  });

  it('Calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <TestProvider>
        <Link isActive={false} onClick={onClick}>Click Me</Link>
      </TestProvider>,
    );
    fireEvent.click(screen.getByText('Click Me'));
    expect(onClick).toHaveBeenCalled();
  });

  it('Renders with role="button"', () => {
    render(
      <TestProvider>
        <Link isActive={false} onClick={() => {}}>Button Link</Link>
      </TestProvider>,
    );
    expect(screen.getByRole('button', { name: 'Button Link' })).toBeInTheDocument();
  });

  it('Renders children content', () => {
    render(
      <TestProvider>
        <Link isActive={false} onClick={() => {}}>Child Content</Link>
      </TestProvider>,
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
