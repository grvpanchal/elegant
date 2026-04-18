import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddTodoForm from './AddTodoForm.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<AddTodoForm />', () => {
  const defaultProps = {
    buttonInfo: { label: 'Add', variant: 'primary' },
    placeholder: 'Add your task',
    isLoading: false,
    onTodoAdd: vi.fn(),
    onTodoUpdate: vi.fn(),
    todoValue: '',
  };

  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <AddTodoForm {...defaultProps} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders with default props', () => {
    const { container } = render(
      <TestProvider>
        <AddTodoForm />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
    expect(screen.getByRole('button')).toHaveTextContent('Add');
  });

  it('Calls onTodoAdd when form is submitted with text', () => {
    const onTodoAdd = vi.fn();
    render(
      <TestProvider>
        <AddTodoForm {...defaultProps} onTodoAdd={onTodoAdd} />
      </TestProvider>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.submit(input.closest('form'));
    expect(onTodoAdd).toHaveBeenCalledWith('New todo');
  });

  it('Does not call onTodoAdd when form is submitted with empty text', () => {
    const onTodoAdd = vi.fn();
    render(
      <TestProvider>
        <AddTodoForm {...defaultProps} onTodoAdd={onTodoAdd} />
      </TestProvider>,
    );
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form);
    expect(onTodoAdd).not.toHaveBeenCalled();
  });

  it('Does not call onTodoAdd when form is submitted with whitespace only', () => {
    const onTodoAdd = vi.fn();
    render(
      <TestProvider>
        <AddTodoForm {...defaultProps} onTodoAdd={onTodoAdd} />
      </TestProvider>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form'));
    expect(onTodoAdd).not.toHaveBeenCalled();
  });

  it('Calls onTodoUpdate when todoValue is provided', () => {
    const onTodoUpdate = vi.fn();
    render(
      <TestProvider>
        <AddTodoForm {...defaultProps} onTodoUpdate={onTodoUpdate} todoValue="Existing todo" />
      </TestProvider>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated text' } });
    fireEvent.submit(input.closest('form'));
    expect(onTodoUpdate).toHaveBeenCalledWith('Updated text');
  });

  it('Clears input after submission', () => {
    render(
      <TestProvider>
        <AddTodoForm {...defaultProps} />
      </TestProvider>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.submit(input.closest('form'));
    expect(input.value).toBe('');
  });

  it('Disables input when isLoading is true', () => {
    render(
      <TestProvider>
        <AddTodoForm {...defaultProps} isLoading={true} />
      </TestProvider>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('Updates input value when todoValue prop changes', () => {
    const { rerender } = render(
      <TestProvider>
        <AddTodoForm {...defaultProps} todoValue="Initial" />
      </TestProvider>,
    );
    expect(screen.getByRole('textbox').value).toBe('Initial');

    rerender(
      <TestProvider>
        <AddTodoForm {...defaultProps} todoValue="Updated" />
      </TestProvider>,
    );
    expect(screen.getByRole('textbox').value).toBe('Updated');
  });

  it('Displays button label correctly', () => {
    render(
      <TestProvider>
        <AddTodoForm {...defaultProps} buttonInfo={{ label: 'Save', variant: 'primary' }} />
      </TestProvider>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Save');
  });
});
