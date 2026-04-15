import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import TodoListComponent from './TodoList.component';
import { TodoState } from '../../../app/state/todo/todo.initial';

@Component({
  standalone: true,
  imports: [TodoListComponent],
  template: `<app-todo-list
    [todoData]="todoData"
    [events]="events"
  ></app-todo-list>`,
})
class TestHostComponent {
  todoData: TodoState = {
    isLoading: false,
    isActionLoading: false,
    isContentLoading: false,
    error: '',
    todoItems: [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true },
    ],
    currentTodoItem: { id: null, text: '' },
  };
  events = {
    onTodoCreate: jasmine.createSpy('onTodoCreate'),
    onTodoEdit: jasmine.createSpy('onTodoEdit'),
    onTodoUpdate: jasmine.createSpy('onTodoUpdate'),
    onTodoToggleUpdate: jasmine.createSpy('onTodoToggleUpdate'),
    onTodoDelete: jasmine.createSpy('onTodoDelete'),
  };
}

describe('TodoListComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render alert when there is an error', () => {
    component.todoData = {
      ...component.todoData,
      error: 'Something went wrong',
    };
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.css('app-alert'));
    expect(alert).toBeTruthy();
  });

  it('should not render alert when there is no error', () => {
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.css('app-alert'));
    expect(alert).toBeFalsy();
  });

  it('should render add todo form', () => {
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('app-add-todo-form'));
    expect(form).toBeTruthy();
  });

  it('should render todo items', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.query(By.css('app-todo-items'));
    expect(items).toBeTruthy();
  });

  it('should render skeleton when loading', () => {
    component.todoData = {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: true,
      error: '',
      todoItems: [],
      currentTodoItem: { id: null, text: '' },
    };
    fixture.detectChanges();
    const skeleton = fixture.debugElement.query(By.css('app-skeleton'));
    expect(skeleton).toBeTruthy();
  });

  it('should compute buttonInfo with "Add" label when no currentTodoItem text', () => {
    fixture.detectChanges();
    const todoList = fixture.debugElement.query(By.directive(TodoListComponent)).componentInstance;
    expect(todoList.buttonInfo).toEqual({ label: 'Add', variant: 'primary' });
  });

  it('should compute buttonInfo with "Save" label when currentTodoItem has text', () => {
    component.todoData = {
      ...component.todoData,
      currentTodoItem: { id: 1, text: 'Editing' },
    };
    fixture.detectChanges();
    const todoList = fixture.debugElement.query(By.directive(TodoListComponent)).componentInstance;
    expect(todoList.buttonInfo).toEqual({ label: 'Save', variant: 'primary' });
  });

  it('should pass events to child components', () => {
    fixture.detectChanges();
    const todoList = fixture.debugElement.query(By.directive(TodoListComponent)).componentInstance;
    expect(todoList.events.onTodoCreate).toBeDefined();
    expect(todoList.events.onTodoEdit).toBeDefined();
    expect(todoList.events.onTodoUpdate).toBeDefined();
    expect(todoList.events.onTodoToggleUpdate).toBeDefined();
    expect(todoList.events.onTodoDelete).toBeDefined();
  });
});
