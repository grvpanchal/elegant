import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import TodoItemComponent from './TodoItem.component';

@Component({
  standalone: true,
  imports: [TodoItemComponent],
  template: `<app-todo-item
    [id]="id"
    [text]="text"
    [completed]="completed"
    [isDisabled]="isDisabled"
    (onToggleClick)="onToggleClick($event)"
    (onEditClick)="onEditClick($event)"
    (onDeleteClick)="onDeleteClick($event)"
  ></app-todo-item>`,
})
class TestHostComponent {
  id = 1;
  text = 'Test todo';
  completed = false;
  isDisabled = false;
  onToggleClick = jasmine.createSpy('onToggleClick');
  onEditClick = jasmine.createSpy('onEditClick');
  onDeleteClick = jasmine.createSpy('onDeleteClick');
}

describe('TodoItemComponent', () => {
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

  it('should render the todo text', () => {
    fixture.detectChanges();
    const li = fixture.debugElement.query(By.css('.todo-item'));
    expect(li.nativeElement.textContent).toContain('Test todo');
  });

  it('should not have line-through when not completed', () => {
    fixture.detectChanges();
    const li = fixture.debugElement.query(By.css('.todo-item'));
    expect(li.nativeElement.style.textDecoration).toBe('none');
  });

  it('should have line-through when completed', () => {
    component.completed = true;
    fixture.detectChanges();
    const li = fixture.debugElement.query(By.css('.todo-item'));
    expect(li.nativeElement.style.textDecoration).toBe('line-through');
  });

  it('should generate correct checkbox id', () => {
    const todoItem = fixture.debugElement.query(By.directive(TodoItemComponent)).componentInstance;
    fixture.detectChanges();
    expect(todoItem.checkboxId).toBe('checkbox1');
  });

  it('should generate checkbox id for zero id', () => {
    component.id = 0;
    fixture.detectChanges();
    const todoItem = fixture.debugElement.query(By.directive(TodoItemComponent)).componentInstance;
    expect(todoItem.checkboxId).toBe('checkbox0');
  });

  it('should emit onToggleClick when checkbox changes', () => {
    fixture.detectChanges();
    const todoItem = fixture.debugElement.query(By.directive(TodoItemComponent)).componentInstance;
    spyOn(todoItem.onToggleClick, 'emit');
    const input = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    input.triggerEventHandler('input', { target: { type: 'checkbox', value: '', checked: true } });
    expect(todoItem.onToggleClick.emit).toHaveBeenCalled();
  });

  it('should emit onEditClick when edit button is clicked', () => {
    fixture.detectChanges();
    const iconButtons = fixture.debugElement.queryAll(By.css('app-icon-button'));
    const editButton = iconButtons[0];
    editButton.triggerEventHandler('onClick', new Event('click'));
    expect(component.onEditClick).toHaveBeenCalled();
  });

  it('should emit onDeleteClick when delete button is clicked', () => {
    fixture.detectChanges();
    const iconButtons = fixture.debugElement.queryAll(By.css('app-icon-button'));
    const deleteButton = iconButtons[1];
    deleteButton.triggerEventHandler('onClick', new Event('click'));
    expect(component.onDeleteClick).toHaveBeenCalled();
  });

  it('should have default values', () => {
    fixture.detectChanges();
    const todoItem = fixture.debugElement.query(By.directive(TodoItemComponent)).componentInstance;
    expect(todoItem.id).toBe(1);
    expect(todoItem.text).toBe('Test todo');
    expect(todoItem.completed).toBe(false);
    expect(todoItem.isDisabled).toBe(false);
  });
});
