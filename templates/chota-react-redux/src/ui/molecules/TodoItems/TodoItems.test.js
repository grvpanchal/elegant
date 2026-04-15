import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TodoItems from './TodoItems.component';

describe('<TodoItems />', () => {
  const mockOnToggleClick = jest.fn();
  const mockOnEditClick = jest.fn();
  const mockOnDeleteClick = jest.fn();

  const mockTodos = [
    { id: '1', text: 'Todo 1', completed: false },
    { id: '2', text: 'Todo 2', completed: true },
  ];

  it('Renders successfully without error with todos', () => {
    const { container } = render(
      <TodoItems 
        todos={mockTodos}
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    expect(container).toBeTruthy();
  });

  it('Displays all todo items when provided', () => {
    const { getByText } = render(
      <TodoItems 
        todos={mockTodos}
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    expect(getByText('Todo 1')).toBeInTheDocument();
    expect(getByText('Todo 2')).toBeInTheDocument();
  });

  it('Displays empty message when todos array is empty', () => {
    const { getByText } = render(
      <TodoItems 
        todos={[]}
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    expect(getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Displays empty message when todos is null', () => {
    const { getByText } = render(
      <TodoItems 
        todos={null}
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    expect(getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Displays empty message when todos is undefined', () => {
    const { getByText } = render(
      <TodoItems 
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    expect(getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Calls onToggleClick for each todo when toggled', () => {
    const { container } = render(
      <TodoItems 
        todos={mockTodos}
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    fireEvent.click(checkboxes[0]);
    expect(mockOnToggleClick).toHaveBeenCalledTimes(1);
  });

  it('Calls onEditClick for each todo when edit is clicked', () => {
    const { container } = render(
      <TodoItems 
        todos={mockTodos}
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    const editButtons = container.querySelectorAll('[alt="edit"]');
    fireEvent.click(editButtons[0]);
    expect(mockOnEditClick).toHaveBeenCalledTimes(1);
  });

  it('Calls onDeleteClick for each todo when delete is clicked', () => {
    const { container } = render(
      <TodoItems 
        todos={mockTodos}
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    const deleteButtons = container.querySelectorAll('[alt="remove"]');
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });

  it('Applies line-through style to completed todos', () => {
    const { container } = render(
      <TodoItems 
        todos={mockTodos}
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    const todoItems = container.querySelectorAll('.todo-item');
    expect(todoItems[1]).toHaveStyle('text-decoration: line-through');
  });

  it('Does not apply line-through style to non-completed todos', () => {
    const { container } = render(
      <TodoItems 
        todos={mockTodos}
        onToggleClick={mockOnToggleClick}
        onEditClick={mockOnEditClick}
        onDeleteClick={mockOnDeleteClick}
      />
    );
    const labels = container.querySelectorAll('label');
    expect(labels[0]).not.toHaveStyle('text-decoration: line-through');
  });
});
