import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import TodoItemsComponent from './TodoItems.component';

@Component({
  standalone: true,
  imports: [TodoItemsComponent],
  template: `<app-todo-items
    [todos]="todos"
    [isDisabled]="isDisabled"
    (onToggleClick)="onToggleClick($event)"
    (onEditClick)="onEditClick($event)"
    (onDeleteClick)="onDeleteClick($event)"
  ></app-todo-items>`,
})
class TestHostComponent {
  todos = [
    { id: 1, text: 'Todo 1', completed: false },
    { id: 2, text: 'Todo 2', completed: true },
  ];
  isDisabled = false;
  onToggleClick = jasmine.createSpy('onToggleClick');
  onEditClick = jasmine.createSpy('onEditClick');
  onDeleteClick = jasmine.createSpy('onDeleteClick');
}

describe('TodoItemsComponent', () => {
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

  it('should render a list of todo items', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('app-todo-item'));
    expect(items.length).toBe(2);
  });

  it('should pass todo data to each todo item', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('app-todo-item'));
    expect(items[0].componentInstance.text).toBe('Todo 1');
    expect(items[1].componentInstance.text).toBe('Todo 2');
    expect(items[0].componentInstance.completed).toBe(false);
    expect(items[1].componentInstance.completed).toBe(true);
  });

  it('should emit onToggleClick with the todo when a todo item toggles', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('app-todo-item'));
    items[0].triggerEventHandler('onToggleClick', { target: { checked: true } });
    expect(component.onToggleClick).toHaveBeenCalledWith(component.todos[0]);
  });

  it('should emit onEditClick with the todo when a todo item is edited', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('app-todo-item'));
    items[1].triggerEventHandler('onEditClick', {});
    expect(component.onEditClick).toHaveBeenCalledWith(component.todos[1]);
  });

  it('should emit onDeleteClick with the todo id when a todo item is deleted', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('app-todo-item'));
    items[0].triggerEventHandler('onDeleteClick', {});
    expect(component.onDeleteClick).toHaveBeenCalledWith(1);
  });

  it('should show empty message when todos is empty', () => {
    component.todos = [];
    fixture.detectChanges();
    const emptyText = fixture.debugElement.query(By.css('.empty-text'));
    expect(emptyText).toBeTruthy();
    expect(emptyText.nativeElement.textContent.trim()).toBe('Nothing to display here. Carry on.');
  });

  it('should show empty message when todos is null', () => {
    component.todos = null as any;
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('app-todo-item'));
    expect(items.length).toBe(0);
    const emptyText = fixture.debugElement.query(By.css('.empty-text'));
    expect(emptyText).toBeTruthy();
  });

  it('should pass isDisabled to todo items', () => {
    component.isDisabled = true;
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('app-todo-item'));
    expect(items[0].componentInstance.isDisabled).toBe(true);
    expect(items[1].componentInstance.isDisabled).toBe(true);
  });
});
