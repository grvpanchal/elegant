import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from './TodoItem.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<TodoItem />', () => {
  const defaultProps = {
    id: 1,
    text: 'Test todo',
    completed: false,
    onToggleClick: jest.fn(),
    onEditClick: jest.fn(),
    onDeleteClick: jest.fn(),
  };

  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <TodoItem {...defaultProps} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Displays the todo text', () => {
    render(
      <TestProvider>
        <TodoItem {...defaultProps} />
      </TestProvider>,
    );
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('Applies line-through when completed', () => {
    render(
      <TestProvider>
        <TodoItem {...defaultProps} completed={true} />
      </TestProvider>,
    );
    const li = screen.getByText('Test todo').closest('li');
    expect(li).toHaveStyle('text-decoration: line-through');
  });

  it('Does not apply line-through when not completed', () => {
    render(
      <TestProvider>
        <TodoItem {...defaultProps} completed={false} />
      </TestProvider>,
    );
    const li = screen.getByText('Test todo').closest('li');
    expect(li).toHaveStyle('text-decoration: none');
  });

  it('Calls onToggleClick when checkbox is clicked', () => {
    const onToggleClick = jest.fn();
    render(
      <TestProvider>
        <TodoItem {...defaultProps} onToggleClick={onToggleClick} />
      </TestProvider>,
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onToggleClick).toHaveBeenCalled();
  });

  it('Calls onEditClick when edit button is clicked', () => {
    const onEditClick = jest.fn();
    render(
      <TestProvider>
        <TodoItem {...defaultProps} onEditClick={onEditClick} />
      </TestProvider>,
    );
    const editButtons = screen.getAllByRole('button');
    fireEvent.click(editButtons[0]);
    expect(onEditClick).toHaveBeenCalled();
  });

  it('Calls onDeleteClick when delete button is clicked', () => {
    const onDeleteClick = jest.fn();
    render(
      <TestProvider>
        <TodoItem {...defaultProps} onDeleteClick={onDeleteClick} />
      </TestProvider>,
    );
    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[1]);
    expect(onDeleteClick).toHaveBeenCalled();
  });

  it('Renders with correct checkbox id', () => {
    render(
      <TestProvider>
        <TodoItem {...defaultProps} id={5} />
      </TestProvider>,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'checkbox5');
  });
});
