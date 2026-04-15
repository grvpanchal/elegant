import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from './TodoList.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<TodoList />', () => {
  const defaultTodoData = {
    isLoading: false,
    isActionLoading: false,
    isContentLoading: false,
    error: '',
    todoItems: [
      { id: 1, text: 'Todo 1', completed: false },
    ],
    currentTodoItem: { text: '', id: '' },
  };

  const defaultEvents = {
    onTodoCreate: jest.fn(),
    onTodoEdit: jest.fn(),
    onTodoUpdate: jest.fn(),
    onTodoToggleUpdate: jest.fn(),
    onTodoDelete: jest.fn(),
  };

  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <TodoList todoData={defaultTodoData} events={defaultEvents} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders todo items', () => {
    render(
      <TestProvider>
        <TodoList todoData={defaultTodoData} events={defaultEvents} />
      </TestProvider>,
    );
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
  });

  it('Renders Alert when there is an error', () => {
    const todoDataWithError = { ...defaultTodoData, error: 'Something went wrong' };
    render(
      <TestProvider>
        <TodoList todoData={todoDataWithError} events={defaultEvents} />
      </TestProvider>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('Does not render Alert when there is no error', () => {
    render(
      <TestProvider>
        <TodoList todoData={defaultTodoData} events={defaultEvents} />
      </TestProvider>,
    );
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('Renders Skeleton when isContentLoading is true', () => {
    const loadingTodoData = { ...defaultTodoData, isContentLoading: true };
    render(
      <TestProvider>
        <TodoList todoData={loadingTodoData} events={defaultEvents} />
      </TestProvider>,
    );
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('Renders TodoItems when isContentLoading is false', () => {
    render(
      <TestProvider>
        <TodoList todoData={defaultTodoData} events={defaultEvents} />
      </TestProvider>,
    );
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(0);
  });

  it('Shows "Add" button label when currentTodoItem.text is empty', () => {
    render(
      <TestProvider>
        <TodoList todoData={defaultTodoData} events={defaultEvents} />
      </TestProvider>,
    );
    const submitButton = screen.getByRole('button', { name: 'Add' });
    expect(submitButton).toHaveTextContent('Add');
  });

  it('Shows "Save" button label when currentTodoItem.text has value', () => {
    const todoDataWithEdit = {
      ...defaultTodoData,
      currentTodoItem: { text: 'Editing this', id: 1 },
    };
    render(
      <TestProvider>
        <TodoList todoData={todoDataWithEdit} events={defaultEvents} />
      </TestProvider>,
    );
    const submitButton = screen.getByRole('button', { name: 'Save' });
    expect(submitButton).toHaveTextContent('Save');
  });

  it('Passes isActionLoading as isDisabled to TodoItems', () => {
    const loadingActionData = { ...defaultTodoData, isActionLoading: true };
    render(
      <TestProvider>
        <TodoList todoData={loadingActionData} events={defaultEvents} />
      </TestProvider>,
    );
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
  });

  it('Renders empty todos message when todoItems is empty', () => {
    const emptyTodoData = { ...defaultTodoData, todoItems: [] };
    render(
      <TestProvider>
        <TodoList todoData={emptyTodoData} events={defaultEvents} />
      </TestProvider>,
    );
    expect(screen.getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Handles undefined todoItems gracefully', () => {
    const undefinedTodoData = { ...defaultTodoData, todoItems: undefined };
    render(
      <TestProvider>
        <TodoList todoData={undefinedTodoData} events={defaultEvents} />
      </TestProvider>,
    );
    expect(screen.getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });
});
