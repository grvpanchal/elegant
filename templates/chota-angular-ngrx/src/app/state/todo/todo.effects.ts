import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';
import { TodoService } from './todo.service';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  loadTodosRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodosRequest),
      switchMap(() =>
        this.todoService.getAllTodos().pipe(
          mergeMap((todos) => [
            TodoActions.loadTodos({ todos }),
            TodoActions.loadTodosSuccess(),
          ]),
          catchError((error) =>
            of(TodoActions.loadTodosFail({ error: error.message || 'Failed to load todos' }))
          )
        )
      )
    )
  );

  addTodoRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodoRequest),
      switchMap(({ text }) =>
        this.todoService.createTodo(text).pipe(
          mergeMap((todo) => [
            TodoActions.createTodo({ id: todo.id, text: todo.text }),
            TodoActions.addTodoSuccess(),
          ]),
          catchError((error) =>
            of(TodoActions.addTodoFail({ error: error.message || 'Failed to add todo' }))
          )
        )
      )
    )
  );

  updateTodoRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodoRequest),
      switchMap(({ id, text }) =>
        this.todoService.updateTodo(id, text).pipe(
          mergeMap((todo) => [
            TodoActions.updateTodo({ id: todo.id, text: todo.text }),
            TodoActions.updateTodoSuccess(),
          ]),
          catchError((error) =>
            of(TodoActions.updateTodoFail({ error: error.message || 'Failed to update todo' }))
          )
        )
      )
    )
  );

  deleteTodoRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodoRequest),
      switchMap(({ id }) =>
        this.todoService.deleteTodo(id).pipe(
          mergeMap(() => [TodoActions.deleteTodo({ id })]),
          catchError((error) =>
            of(TodoActions.deleteTodoFail({ error: error.message || 'Failed to delete todo' }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private todoService: TodoService) {}
}
