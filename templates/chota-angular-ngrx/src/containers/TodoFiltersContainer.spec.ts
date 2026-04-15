import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { MemoizedSelector } from '@ngrx/store';
import TodoFiltersContainerComponent from './TodoFiltersContainer';
import { getFilters } from '../app/state/filters/filters.selectors';
import { setVisibilityFilter } from '../app/state/filters/filters.actions';
import { AppState } from '../app/state';

describe('TodoFiltersContainerComponent', () => {
  let component: TodoFiltersContainerComponent;
  let fixture: ComponentFixture<TodoFiltersContainerComponent>;
  let store: MockStore<AppState>;

  const initialMockState: AppState = {
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [],
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
      imports: [TodoFiltersContainerComponent],
      providers: [provideMockStore({ initialState: initialMockState })],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFiltersContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should select filters from store', (done) => {
    fixture.detectChanges();
    component.filtersData$.subscribe((data) => {
      expect(data.length).toBe(3);
      expect(data[0].id).toBe('SHOW_ALL');
      done();
    });
  });

  it('should render TodoFiltersComponent when data is available', () => {
    fixture.detectChanges();
    const todoFilters = fixture.debugElement.query(By.css('app-todo-filters'));
    expect(todoFilters).toBeTruthy();
  });

  it('should pass filtersData to TodoFiltersComponent', () => {
    fixture.detectChanges();
    const todoFilters = fixture.debugElement.query(By.css('app-todo-filters'));
    expect(todoFilters.componentInstance.filtersData).toEqual(initialMockState.filters);
  });

  it('should dispatch setVisibilityFilter on onTodoFilterUpdate', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onTodoFilterUpdate('SHOW_ACTIVE');
    expect(store.dispatch).toHaveBeenCalledWith(setVisibilityFilter({ filter: 'SHOW_ACTIVE' }));
  });

  it('should dispatch setVisibilityFilter with SHOW_COMPLETED', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onTodoFilterUpdate('SHOW_COMPLETED');
    expect(store.dispatch).toHaveBeenCalledWith(setVisibilityFilter({ filter: 'SHOW_COMPLETED' }));
  });
});
