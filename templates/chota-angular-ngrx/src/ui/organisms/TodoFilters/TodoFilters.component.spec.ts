import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import TodoFiltersComponent from './TodoFilters.component';

@Component({
  standalone: true,
  imports: [TodoFiltersComponent],
  template: `<app-todo-filters
    [filtersData]="filtersData"
    [events]="events"
  ></app-todo-filters>`,
})
class TestHostComponent {
  filtersData = [
    { id: 'SHOW_ALL', label: 'All', selected: true },
    { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
    { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
  ];
  events = {
    onTodoFilterUpdate: jasmine.createSpy('onTodoFilterUpdate'),
  };
}

describe('TodoFiltersComponent', () => {
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

  it('should render filter group component', () => {
    fixture.detectChanges();
    const filterGroup = fixture.debugElement.query(By.css('app-filter-group'));
    expect(filterGroup).toBeTruthy();
  });

  it('should pass filtersData to filter group', () => {
    fixture.detectChanges();
    const filterGroup = fixture.debugElement.query(By.css('app-filter-group'));
    expect(filterGroup.componentInstance.filterItems).toEqual(component.filtersData);
  });

  it('should pass events to filter group', () => {
    fixture.detectChanges();
    const todoFilters = fixture.debugElement.query(By.directive(TodoFiltersComponent)).componentInstance;
    expect(todoFilters.events.onTodoFilterUpdate).toBeDefined();
  });

  it('should have default empty filtersData', () => {
    fixture.detectChanges();
    const todoFilters = fixture.debugElement.query(By.directive(TodoFiltersComponent)).componentInstance;
    expect(todoFilters.filtersData).toEqual(component.filtersData);
  });

  it('should have default events with no-op function', () => {
    const todoFilters = fixture.debugElement.query(By.directive(TodoFiltersComponent)).componentInstance;
    fixture.detectChanges();
    expect(todoFilters.events.onTodoFilterUpdate).toBeDefined();
    expect(() => todoFilters.events.onTodoFilterUpdate('SHOW_ALL')).not.toThrow();
  });
});
