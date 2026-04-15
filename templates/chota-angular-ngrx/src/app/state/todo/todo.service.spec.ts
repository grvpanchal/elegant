import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://jsonplaceholder.typicode.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TodoService,
        { provide: 'API_URL', useValue: apiUrl },
      ],
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllTodos', () => {
    it('should fetch todos and transform them', (done) => {
      const mockResponse = [
        { id: 1, title: 'First todo', completed: false },
        { id: 2, title: 'Second todo', completed: true },
        { id: 3, title: 'Third todo', completed: false },
      ];

      service.getAllTodos().subscribe((todos: Todo[]) => {
        expect(todos.length).toBe(3);
        expect(todos[0]).toEqual({ id: 1, text: 'First todo', completed: false });
        expect(todos[1]).toEqual({ id: 2, text: 'Second todo', completed: true });
        expect(todos[2]).toEqual({ id: 3, text: 'Third todo', completed: false });
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/todos`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should limit results to 10 todos', (done) => {
      const mockResponse = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Todo ${i + 1}`,
        completed: false,
      }));

      service.getAllTodos().subscribe((todos: Todo[]) => {
        expect(todos.length).toBe(10);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/todos`);
      req.flush(mockResponse);
    });

    it('should handle empty response', (done) => {
      service.getAllTodos().subscribe((todos: Todo[]) => {
        expect(todos.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/todos`);
      req.flush([]);
    });
  });

  describe('createTodo', () => {
    it('should create a todo and transform the response', (done) => {
      const mockResponse = { id: 1, title: 'New todo', completed: false };

      service.createTodo('New todo').subscribe((todo: Todo) => {
        expect(todo.id).toBe(1);
        expect(todo.text).toBe('New todo');
        expect(todo.completed).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/todos`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ title: 'New todo', completed: false });
      req.flush(mockResponse);
    });

    it('should generate a random id when response has no id', (done) => {
      const mockResponse = { title: 'New todo', completed: false };

      spyOn(Math, 'random').and.returnValue(0.5);

      service.createTodo('New todo').subscribe((todo: Todo) => {
        expect(todo.id).toBe(6000);
        expect(todo.text).toBe('New todo');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/todos`);
      req.flush(mockResponse);
    });

    it('should use provided text when response has no title', (done) => {
      const mockResponse = { id: 1, completed: false };

      service.createTodo('Fallback text').subscribe((todo: Todo) => {
        expect(todo.text).toBe('Fallback text');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/todos`);
      req.flush(mockResponse);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo and transform the response', (done) => {
      const mockResponse = { id: 1, title: 'Updated title', completed: true };

      service.updateTodo(1, 'Updated title').subscribe((todo: Todo) => {
        expect(todo.id).toBe(1);
        expect(todo.text).toBe('Updated title');
        expect(todo.completed).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/todos/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ title: 'Updated title' });
      req.flush(mockResponse);
    });

    it('should use provided text when response has no title', (done) => {
      const mockResponse = { id: 1, completed: false };

      service.updateTodo(1, 'Fallback text').subscribe((todo: Todo) => {
        expect(todo.text).toBe('Fallback text');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/todos/1`);
      req.flush(mockResponse);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo by id', (done) => {
      service.deleteTodo(1).subscribe((response: void) => {
        expect(response).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/todos/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
