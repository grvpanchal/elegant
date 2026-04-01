import { Todo } from './todo.model';

export interface TodoState {
  isLoading: boolean;
  isActionLoading: boolean;
  isContentLoading: boolean;
  error: string;
  todoItems: Todo[];
  currentTodoItem: {
    id: number | null;
    text: string;
  };
}

const initialTodoState: TodoState = {
  isLoading: false,
  isActionLoading: false,
  isContentLoading: false,
  error: '',
  todoItems: [],
  currentTodoItem: {
    id: null,
    text: '',
  },
};

export default initialTodoState;
