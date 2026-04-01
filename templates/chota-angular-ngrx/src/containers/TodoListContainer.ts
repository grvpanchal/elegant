import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AppState } from '../app/state/index';
import { getVisibleTodos, getTodoState } from '../app/state/todo/todo.selectors';
import { Todo } from '../app/state/todo/todo.model';
import {
  addTodoRequest,
  editTodo,
  updateTodoRequest,
  toggleTodo,
  deleteTodoRequest,
} from '../app/state/todo/todo.actions';
import TodoListComponent from '../ui/organisms/TodoList/TodoList.component';

@Component({
  selector: 'app-todo-list-container',
  standalone: true,
  imports: [TodoListComponent, AsyncPipe],
  template: `
    @if (todoData$ | async; as todoData) {
      <app-todo-list
        [todoData]="todoData"
        [events]="events"
      ></app-todo-list>
    }
  `,
})
export default class TodoListContainerComponent {
  todoData$ = this.store.select(getVisibleTodos);

  events = {
    onTodoCreate: (text: string) => {
      this.store.dispatch(addTodoRequest({ text }));
    },
    onTodoEdit: (todo: Todo) => {
      this.store.dispatch(editTodo({ id: todo.id, text: todo.text }));
    },
    onTodoUpdate: (text: string) => {
      this.store.select(getTodoState).pipe(take(1)).subscribe((state) => {
        const { id } = state.currentTodoItem;
        if (id !== null) {
          this.store.dispatch(updateTodoRequest({ id, text }));
        }
      });
    },
    onTodoToggleUpdate: (todo: Todo) => {
      this.store.dispatch(toggleTodo({ id: todo.id }));
    },
    onTodoDelete: (id: number) => {
      this.store.dispatch(deleteTodoRequest({ id }));
    },
  };

  constructor(private store: Store<AppState>) {}
}
