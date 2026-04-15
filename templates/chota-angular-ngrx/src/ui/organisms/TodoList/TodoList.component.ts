import { Component, Input } from '@angular/core';
import AlertComponent from '../../atoms/Alert/Alert.component';
import AddTodoFormComponent from '../../molecules/AddTodoForm/AddTodoForm.component';
import TodoItemsComponent from '../../molecules/TodoItems/TodoItems.component';
import SkeletonComponent from '../../skeletons/Skeleton/Skeleton.component';
import { TodoState } from '../../../app/state/todo/todo.initial';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [AlertComponent, AddTodoFormComponent, TodoItemsComponent, SkeletonComponent],
  templateUrl: './TodoList.component.html',
  styleUrls: ['./TodoList.style.css'],
})
export default class TodoListComponent {
  @Input() todoData: TodoState = {
    isLoading: false,
    isActionLoading: false,
    isContentLoading: false,
    error: '',
    todoItems: [],
    currentTodoItem: { id: null, text: '' },
  };

  @Input() events: {
    onTodoCreate: (text: string) => void;
    onTodoEdit: (todo: any) => void;
    onTodoUpdate: (text: string) => void;
    onTodoToggleUpdate: (todo: any) => void;
    onTodoDelete: (id: number) => void;
  } = {
    onTodoCreate: () => {},
    onTodoEdit: () => {},
    onTodoUpdate: () => {},
    onTodoToggleUpdate: () => {},
    onTodoDelete: () => {},
  };

  /* istanbul ignore next */
  get buttonInfo() {
    return {
      label: this.todoData?.currentTodoItem?.text ? 'Save' : 'Add',
      variant: 'primary',
    };
  }
}

