import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import * as TodoActions from './todo.actions';
import { TodoEffects } from './todo.effects';
import { TodoService } from './todo.service';

describe('TodoEffects', () => {
  let actions$: Observable<any>;
  let effects: TodoEffects;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoEffects,
        provideMockActions(() => actions$),
        {
          provide: TodoService,
          useValue: {
            getAllTodos: jasmine.createSpy('getAllTodos'),
            createTodo: jasmine.createSpy('createTodo'),
            updateTodo: jasmine.createSpy('updateTodo'),
            deleteTodo: jasmine.createSpy('deleteTodo'),
          },
        },
      ],
    });

    effects = TestBed.inject(TodoEffects);
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  describe('loadTodosRequest$', () => {
    it('should return loadTodos and loadTodosSuccess on success', () => {
      const todos = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ];

      actions$ = hot('-a', { a: TodoActions.loadTodosRequest() });
      const response = cold('-a|', { a: todos });
      todoService.getAllTodos.and.returnValue(response);

      const expected = cold('--(bc)', {
        b: TodoActions.loadTodos({ todos }),
        c: TodoActions.loadTodosSuccess(),
      });

      expect(effects.loadTodosRequest$).toBeObservable(expected);
    });

    it('should return loadTodosFail on error', () => {
      const error = { message: 'Failed to load todos' };

      actions$ = hot('-a', { a: TodoActions.loadTodosRequest() });
      const response = cold('-#', {}, error);
      todoService.getAllTodos.and.returnValue(response);

      const expected = cold('--b', {
        b: TodoActions.loadTodosFail({ error: 'Failed to load todos' }),
      });

      expect(effects.loadTodosRequest$).toBeObservable(expected);
    });

    it('should use default error message when error has no message', () => {
      actions$ = hot('-a', { a: TodoActions.loadTodosRequest() });
      const response = cold('-#', {}, {});
      todoService.getAllTodos.and.returnValue(response);

      const expected = cold('--b', {
        b: TodoActions.loadTodosFail({ error: 'Failed to load todos' }),
      });

      expect(effects.loadTodosRequest$).toBeObservable(expected);
    });
  });

  describe('addTodoRequest$', () => {
    it('should return createTodo and addTodoSuccess on success', () => {
      const text = 'New todo';
      const createdTodo = { id: 1, text: 'New todo', completed: false };

      actions$ = hot('-a', { a: TodoActions.addTodoRequest({ text }) });
      const response = cold('-a|', { a: createdTodo });
      todoService.createTodo.and.returnValue(response);

      const expected = cold('--(bc)', {
        b: TodoActions.createTodo({ id: 1, text: 'New todo' }),
        c: TodoActions.addTodoSuccess(),
      });

      expect(effects.addTodoRequest$).toBeObservable(expected);
    });

    it('should return addTodoFail on error', () => {
      const text = 'New todo';

      actions$ = hot('-a', { a: TodoActions.addTodoRequest({ text }) });
      const response = cold('-#', {}, { message: 'Failed to add' });
      todoService.createTodo.and.returnValue(response);

      const expected = cold('--b', {
        b: TodoActions.addTodoFail({ error: 'Failed to add' }),
      });

      expect(effects.addTodoRequest$).toBeObservable(expected);
    });

    it('should use default error message when error has no message', () => {
      actions$ = hot('-a', { a: TodoActions.addTodoRequest({ text: 'Test' }) });
      const response = cold('-#', {}, {});
      todoService.createTodo.and.returnValue(response);

      const expected = cold('--b', {
        b: TodoActions.addTodoFail({ error: 'Failed to add todo' }),
      });

      expect(effects.addTodoRequest$).toBeObservable(expected);
    });
  });

  describe('updateTodoRequest$', () => {
    it('should return updateTodo and updateTodoSuccess on success', () => {
      const id = 1;
      const text = 'Updated text';
      const updatedTodo = { id: 1, text: 'Updated text', completed: false };

      actions$ = hot('-a', { a: TodoActions.updateTodoRequest({ id, text }) });
      const response = cold('-a|', { a: updatedTodo });
      todoService.updateTodo.and.returnValue(response);

      const expected = cold('--(bc)', {
        b: TodoActions.updateTodo({ id: 1, text: 'Updated text' }),
        c: TodoActions.updateTodoSuccess(),
      });

      expect(effects.updateTodoRequest$).toBeObservable(expected);
    });

    it('should return updateTodoFail on error', () => {
      actions$ = hot('-a', {
        a: TodoActions.updateTodoRequest({ id: 1, text: 'Updated' }),
      });
      const response = cold('-#', {}, { message: 'Failed to update' });
      todoService.updateTodo.and.returnValue(response);

      const expected = cold('--b', {
        b: TodoActions.updateTodoFail({ error: 'Failed to update' }),
      });

      expect(effects.updateTodoRequest$).toBeObservable(expected);
    });

    it('should use default error message when error has no message', () => {
      actions$ = hot('-a', {
        a: TodoActions.updateTodoRequest({ id: 1, text: 'Updated' }),
      });
      const response = cold('-#', {}, {});
      todoService.updateTodo.and.returnValue(response);

      const expected = cold('--b', {
        b: TodoActions.updateTodoFail({ error: 'Failed to update todo' }),
      });

      expect(effects.updateTodoRequest$).toBeObservable(expected);
    });
  });

  describe('deleteTodoRequest$', () => {
    it('should return deleteTodo on success', () => {
      const id = 5;

      actions$ = hot('-a', { a: TodoActions.deleteTodoRequest({ id }) });
      const response = cold('-a|', { a: undefined });
      todoService.deleteTodo.and.returnValue(response);

      const expected = cold('--b', {
        b: TodoActions.deleteTodo({ id: 5 }),
      });

      expect(effects.deleteTodoRequest$).toBeObservable(expected);
    });

    it('should return deleteTodoFail on error', () => {
      actions$ = hot('-a', { a: TodoActions.deleteTodoRequest({ id: 5 }) });
      const response = cold('-#', {}, { message: 'Failed to delete' });
      todoService.deleteTodo.and.returnValue(response);

      const expected = cold('--b', {
        b: TodoActions.deleteTodoFail({ error: 'Failed to delete' }),
      });

      expect(effects.deleteTodoRequest$).toBeObservable(expected);
    });

    it('should use default error message when error has no message', () => {
      actions$ = hot('-a', { a: TodoActions.deleteTodoRequest({ id: 5 }) });
      const response = cold('-#', {}, {});
      todoService.deleteTodo.and.returnValue(response);

      const expected = cold('--b', {
        b: TodoActions.deleteTodoFail({ error: 'Failed to delete todo' }),
      });

      expect(effects.deleteTodoRequest$).toBeObservable(expected);
    });
  });
});
