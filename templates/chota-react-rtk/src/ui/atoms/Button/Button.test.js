import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Button />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Button>Hello</Button>
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders as loading button when isLoading is true', () => {
    render(
      <TestProvider>
        <Button isLoading={true} className="test-class">Submit</Button>
      </TestProvider>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('loading-button');
    expect(button).toHaveClass('test-class');
  });

  it('Renders as normal button when isLoading is false', () => {
    render(
      <TestProvider>
        <Button isLoading={false}>Submit</Button>
      </TestProvider>,
    );
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('loading-button');
    expect(button).toHaveTextContent('Submit');
  });

  it('Passes through additional props', () => {
    render(
      <TestProvider>
        <Button data-testid="custom-button" type="submit">Click</Button>
      </TestProvider>,
    );
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('Removes isLoading prop from transformed props', () => {
    const { container } = render(
      <TestProvider>
        <Button isLoading={true}>Loading</Button>
      </TestProvider>,
    );
    const button = container.querySelector('button');
    expect(button).not.toHaveAttribute('isLoading');
  });
});
