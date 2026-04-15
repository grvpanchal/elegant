import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import HomePageComponent from './HomePage.component';
import { loadTodosRequest } from '../app/state/todo/todo.actions';
import { AppState } from '../app/state';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  const initialMockState: AppState = {
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [],
      currentTodoItem: { id: null, text: '' },
    },
    filters: [],
    config: { name: 'Todo App', theme: 'light' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideMockStore({ initialState: initialMockState })],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTodosRequest on init', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(loadTodosRequest());
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should render layout component', () => {
    fixture.detectChanges();
    const layout = fixture.debugElement.query(By.css('app-layout'));
    expect(layout).toBeTruthy();
  });

  it('should render site header container', () => {
    fixture.detectChanges();
    const headerContainer = fixture.debugElement.query(By.css('app-site-header-container'));
    expect(headerContainer).toBeTruthy();
  });

  it('should render todo list container', () => {
    fixture.detectChanges();
    const todoListContainer = fixture.debugElement.query(By.css('app-todo-list-container'));
    expect(todoListContainer).toBeTruthy();
  });

  it('should render todo filters container', () => {
    fixture.detectChanges();
    const todoFiltersContainer = fixture.debugElement.query(By.css('app-todo-filters-container'));
    expect(todoFiltersContainer).toBeTruthy();
  });
});
