import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(
    @Inject('API_URL') private apiUrl: string,
    private http: HttpClient
  ) {}

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`).pipe(
      map((todos) =>
        todos.slice(0, 10).map((t) => ({
          id: t.id,
          text: t.title,
          completed: t.completed,
        }))
      )
    );
  }

  createTodo(text: string): Observable<Todo> {
    return this.http
      .post<any>(`${this.apiUrl}/todos`, { title: text, completed: false })
      .pipe(
        map((t) => ({
          id: t.id || Math.floor(Math.random() * 10000) + 1000,
          text: t.title || text,
          completed: false,
        }))
      );
  }

  updateTodo(id: number, text: string): Observable<Todo> {
    return this.http
      .patch<any>(`${this.apiUrl}/todos/${id}`, { title: text })
      .pipe(map((t) => ({ id: t.id, text: t.title || text, completed: t.completed })));
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todos/${id}`);
  }
}
