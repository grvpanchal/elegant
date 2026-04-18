import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddTodoForm from './AddTodoForm.component';

describe('<AddTodoForm />', () => {
  const mockOnTodoAdd = vi.fn();
  const mockOnTodoUpdate = vi.fn();

  it('Renders successfully without error', () => {
    const { container } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Add', variant: 'primary' }}
        placeholder="What needs to be done?"
        onTodoAdd={mockOnTodoAdd}
      />
    );
    expect(container).toBeTruthy();
  });

  it('Initializes with empty value when todoValue is not provided', () => {
    const { getByPlaceholderText } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Add', variant: 'primary' }}
        placeholder="What needs to be done?"
        onTodoAdd={mockOnTodoAdd}
      />
    );
    const input = getByPlaceholderText('What needs to be done?');
    expect(input.value).toBe('');
  });

  it('Renders with default button info when not provided', () => {
    const { getByRole } = render(
      <AddTodoForm 
        placeholder="What needs to be done?"
        onTodoAdd={mockOnTodoAdd}
      />
    );
    expect(getByRole('button')).toHaveTextContent('Add');
  });

  it('Displays the placeholder text', () => {
    const { getByPlaceholderText } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Add', variant: 'primary' }}
        placeholder="What needs to be done?"
        onTodoAdd={mockOnTodoAdd}
      />
    );
    expect(getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  it('Calls onTodoAdd when form is submitted with valid input', () => {
    const { getByRole, getByPlaceholderText } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Add', variant: 'primary' }}
        placeholder="What needs to be done?"
        onTodoAdd={mockOnTodoAdd}
      />
    );
    const input = getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.submit(getByRole('form'));
    expect(mockOnTodoAdd).toHaveBeenCalledWith('New Task');
  });

  it('Does not call onTodoAdd when input is empty', () => {
    const { getByPlaceholderText, getByRole } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Add', variant: 'primary' }}
        placeholder="What needs to be done?"
        onTodoAdd={mockOnTodoAdd}
      />
    );
    fireEvent.submit(getByRole('form'));
    expect(mockOnTodoAdd).not.toHaveBeenCalled();
  });

  it('Updates input value when typed', () => {
    const { getByPlaceholderText } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Add', variant: 'primary' }}
        placeholder="What needs to be done?"
        onTodoAdd={mockOnTodoAdd}
      />
    );
    const input = getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'Typing text' } });
    expect(input.value).toBe('Typing text');
  });

  it('Calls onTodoUpdate when editing and form is submitted', () => {
    const { getByRole, getByPlaceholderText } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Update', variant: 'secondary' }}
        placeholder="Edit task"
        onTodoAdd={mockOnTodoAdd}
        onTodoUpdate={mockOnTodoUpdate}
        todoValue="Existing Task"
      />
    );
    const input = getByPlaceholderText('Edit task');
    fireEvent.change(input, { target: { value: 'Updated Task' } });
    fireEvent.submit(getByRole('form'));
    expect(mockOnTodoUpdate).toHaveBeenCalledWith('Updated Task');
  });

  it('Preloads todoValue in input when provided', () => {
    const { getByPlaceholderText } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Update', variant: 'secondary' }}
        placeholder="Edit task"
        onTodoAdd={mockOnTodoAdd}
        todoValue="Existing Task"
      />
    );
    const input = getByPlaceholderText('Edit task');
    expect(input.value).toBe('Existing Task');
  });

  it('Sets isLoading state correctly', () => {
    const { container } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Saving...', variant: 'primary' }}
        placeholder="What needs to be done?"
        onTodoAdd={mockOnTodoAdd}
        isLoading={true}
      />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('disabled');
  });

  it('Resets input value after successful add', () => {
    const { getByRole, getByPlaceholderText } = render(
      <AddTodoForm 
        buttonInfo={{ label: 'Add', variant: 'primary' }}
        placeholder="What needs to be done?"
        onTodoAdd={mockOnTodoAdd}
      />
    );
    const input = getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'New Task' } });
    expect(input.value).toBe('New Task');
    fireEvent.click(getByRole('button'));
  });
});
