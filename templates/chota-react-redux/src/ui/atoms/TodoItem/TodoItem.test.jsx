import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TodoItem from './TodoItem.component';

describe('<TodoItem />', () => {
  const mockOnToggleClick = vi.fn();
  const mockOnEditClick = vi.fn();
  const mockOnDeleteClick = vi.fn();

  const defaultProps = {
    onToggleClick: mockOnToggleClick,
    completed: false,
    text: 'Test Todo',
    id: '1',
    onEditClick: mockOnEditClick,
    onDeleteClick: mockOnDeleteClick,
  };

  it('Renders successfully without error', () => {
    const { container } = render(<TodoItem {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it('Displays the todo text correctly', () => {
    const { getByText } = render(<TodoItem {...defaultProps} />);
    expect(getByText('Test Todo')).toBeInTheDocument();
  });

  it('Applies line-through style when completed is true', () => {
    const { container } = render(<TodoItem {...defaultProps} completed={true} />);
    const li = container.querySelector('.todo-item');
    expect(li).toHaveStyle('text-decoration: line-through');
  });

  it('Does not apply line-through style when completed is false', () => {
    const { container } = render(<TodoItem {...defaultProps} completed={false} />);
    const li = container.querySelector('.todo-item');
    expect(li).not.toHaveStyle('text-decoration: line-through');
  });

  it('Calls onToggleClick when checkbox is clicked', () => {
    const { getByRole } = render(<TodoItem {...defaultProps} />);
    fireEvent.click(getByRole('checkbox'));
    expect(mockOnToggleClick).toHaveBeenCalledTimes(1);
  });

  it('Renders edit icon button with correct alt text', () => {
    const { container } = render(<TodoItem {...defaultProps} />);
    const editButton = container.querySelector('[alt="edit"]');
    expect(editButton).toBeInTheDocument();
  });

  it('Renders delete icon button with correct alt text', () => {
    const { container } = render(<TodoItem {...defaultProps} />);
    const deleteButton = container.querySelector('[alt="remove"]');
    expect(deleteButton).toBeInTheDocument();
  });

  it('Calls onEditClick when edit button is clicked', () => {
    const { container } = render(<TodoItem {...defaultProps} />);
    const editButton = container.querySelector('[alt="edit"]');
    fireEvent.click(editButton);
    expect(mockOnEditClick).toHaveBeenCalledTimes(1);
  });

  it('Calls onDeleteClick when delete button is clicked', () => {
    const { container } = render(<TodoItem {...defaultProps} />);
    const deleteButton = container.querySelector('[alt="remove"]');
    fireEvent.click(deleteButton);
    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });

  it('Passes correct id to checkbox input', () => {
    const { getByRole } = render(<TodoItem {...defaultProps} />);
    const checkbox = getByRole('checkbox');
    expect(checkbox.id).toBe('checkbox1');
  });
});
