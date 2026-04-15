import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { MemoizedSelector } from '@ngrx/store';
import TodoListContainerComponent from './TodoListContainer';
import { getVisibleTodos } from '../app/state/todo/todo.selectors';
import {
  addTodoRequest,
  editTodo,
  updateTodoRequest,
  toggleTodo,
  deleteTodoRequest,
} from '../app/state/todo/todo.actions';
import { AppState } from '../app/state';

describe('TodoListContainerComponent', () => {
  let component: TodoListContainerComponent;
  let fixture: ComponentFixture<TodoListContainerComponent>;
  let store: MockStore<AppState>;
  let mockVisibleTodosSelector: MemoizedSelector<AppState, any>;

  const initialMockState: AppState = {
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [
        { id: 1, text: 'Test todo', completed: false },
      ],
      currentTodoItem: { id: null, text: '' },
    },
    filters: [
      { id: 'SHOW_ALL', label: 'All', selected: true },
      { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
      { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
    ],
    config: { name: 'Todo App', theme: 'light' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListContainerComponent],
      providers: [provideMockStore({ initialState: initialMockState })],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    mockVisibleTodosSelector = store.overrideSelector(getVisibleTodos, initialMockState.todo);
    store.refreshState();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should select visibleTodos from store', (done) => {
    fixture.detectChanges();
    component.todoData$.subscribe((data) => {
      expect(data.todoItems.length).toBe(1);
      expect(data.todoItems[0].text).toBe('Test todo');
      done();
    });
  });

  it('should render TodoListComponent when data is available', () => {
    fixture.detectChanges();
    const todoList = fixture.debugElement.query(By.css('app-todo-list'));
    expect(todoList).toBeTruthy();
  });

  it('should dispatch addTodoRequest on onTodoCreate', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onTodoCreate('New task');
    expect(store.dispatch).toHaveBeenCalledWith(addTodoRequest({ text: 'New task' }));
  });

  it('should dispatch editTodo on onTodoEdit', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onTodoEdit({ id: 1, text: 'Edited', completed: false });
    expect(store.dispatch).toHaveBeenCalledWith(editTodo({ id: 1, text: 'Edited' }));
  });

  it('should not dispatch updateTodoRequest when currentTodoItem id is null', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onTodoUpdate('Updated text');
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch toggleTodo on onTodoToggleUpdate', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onTodoToggleUpdate({ id: 1, text: 'Test', completed: false });
    expect(store.dispatch).toHaveBeenCalledWith(toggleTodo({ id: 1 }));
  });

  it('should dispatch deleteTodoRequest on onTodoDelete', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onTodoDelete(1);
    expect(store.dispatch).toHaveBeenCalledWith(deleteTodoRequest({ id: 1 }));
  });

  it('should have events object with all handlers', () => {
    fixture.detectChanges();
    expect(component.events.onTodoCreate).toBeDefined();
    expect(component.events.onTodoEdit).toBeDefined();
    expect(component.events.onTodoUpdate).toBeDefined();
    expect(component.events.onTodoToggleUpdate).toBeDefined();
    expect(component.events.onTodoDelete).toBeDefined();
  });
});

describe('TodoListContainerComponent (with editing todo)', () => {
  let component: TodoListContainerComponent;
  let fixture: ComponentFixture<TodoListContainerComponent>;
  let store: MockStore<AppState>;

  const editingMockState: AppState = {
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [
        { id: 1, text: 'Test todo', completed: false },
      ],
      currentTodoItem: { id: 1, text: 'Editing' },
    },
    filters: [
      { id: 'SHOW_ALL', label: 'All', selected: true },
      { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
      { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
    ],
    config: { name: 'Todo App', theme: 'light' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListContainerComponent],
      providers: [provideMockStore({ initialState: editingMockState })],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should dispatch updateTodoRequest on onTodoUpdate when currentTodoItem has id', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onTodoUpdate('Updated text');
    expect(store.dispatch).toHaveBeenCalledWith(updateTodoRequest({ id: 1, text: 'Updated text' }));
  });
});
