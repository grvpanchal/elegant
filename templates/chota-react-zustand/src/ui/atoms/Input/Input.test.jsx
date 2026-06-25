import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './Input.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Input />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Input />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Generates a random id when not provided', () => {
    render(
      <TestProvider>
        <Input />
      </TestProvider>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id');
  });

  it('Uses provided id when given', () => {
    render(
      <TestProvider>
        <Input id="custom-id" />
      </TestProvider>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('Renders with label', () => {
    render(
      <TestProvider>
        <Input name="Test Label" />
      </TestProvider>,
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('Renders with default label when no name provided', () => {
    render(
      <TestProvider>
        <Input id="test-id" />
      </TestProvider>,
    );
    expect(screen.getByText('Some Label')).toBeInTheDocument();
  });

  it('Passes through additional props', () => {
    render(
      <TestProvider>
        <Input id="test-id" placeholder="Enter text" type="text" />
      </TestProvider>,
    );
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('Renders label with htmlFor matching input id', () => {
    render(
      <TestProvider>
        <Input id="my-input" name="My Input" />
      </TestProvider>,
    );
    const label = screen.getByText('My Input');
    expect(label).toHaveAttribute('for', 'my-input');
  });
});
