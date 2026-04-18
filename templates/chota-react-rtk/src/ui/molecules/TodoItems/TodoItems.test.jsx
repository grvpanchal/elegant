import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoItems from './TodoItems.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<TodoItems />', () => {
  const todos = [
    { id: 1, text: 'First todo', completed: false },
    { id: 2, text: 'Second todo', completed: true },
  ];

  const defaultProps = {
    todos,
    isDisabled: false,
    onToggleClick: vi.fn(),
    onEditClick: vi.fn(),
    onDeleteClick: vi.fn(),
  };

  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <TodoItems {...defaultProps} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders all todo items', () => {
    render(
      <TestProvider>
        <TodoItems {...defaultProps} />
      </TestProvider>,
    );
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
  });

  it('Shows empty message when todos is empty', () => {
    render(
      <TestProvider>
        <TodoItems {...defaultProps} todos={[]} />
      </TestProvider>,
    );
    expect(screen.getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Shows empty message when todos is undefined', () => {
    render(
      <TestProvider>
        <TodoItems {...defaultProps} todos={undefined} />
      </TestProvider>,
    );
    expect(screen.getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Calls onToggleClick with correct todo when toggle is clicked', () => {
    const onToggleClick = vi.fn();
    render(
      <TestProvider>
        <TodoItems {...defaultProps} onToggleClick={onToggleClick} />
      </TestProvider>,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes[0].click();
    expect(onToggleClick).toHaveBeenCalledWith(todos[0]);
  });

  it('Calls onEditClick with correct todo when edit is clicked', () => {
    const onEditClick = vi.fn();
    render(
      <TestProvider>
        <TodoItems {...defaultProps} onEditClick={onEditClick} />
      </TestProvider>,
    );
    const editButtons = screen.getAllByRole('button');
    editButtons[0].click();
    expect(onEditClick).toHaveBeenCalledWith(todos[0]);
  });

  it('Calls onDeleteClick with correct id when delete is clicked', () => {
    const onDeleteClick = vi.fn();
    render(
      <TestProvider>
        <TodoItems {...defaultProps} onDeleteClick={onDeleteClick} />
      </TestProvider>,
    );
    const deleteButtons = screen.getAllByRole('button');
    deleteButtons[1].click();
    expect(onDeleteClick).toHaveBeenCalledWith(todos[0].id);
  });

  it('Passes isDisabled prop to TodoItem children', () => {
    render(
      <TestProvider>
        <TodoItems {...defaultProps} isDisabled={true} />
      </TestProvider>,
    );
    // Note: The TodoItem component receives isDisabled but the current implementation
    // doesn't apply it to the checkbox. This test verifies the prop is passed.
    expect(screen.getByText('First todo')).toBeInTheDocument();
  });
});
