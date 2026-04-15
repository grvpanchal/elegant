import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import AddTodoFormComponent from './AddTodoForm.component';

@Component({
  standalone: true,
  imports: [AddTodoFormComponent],
  template: `<app-add-todo-form
    [buttonInfo]="buttonInfo"
    [placeholder]="placeholder"
    [isLoading]="isLoading"
    [todoValue]="todoValue"
    (onTodoAdd)="onTodoAdd($event)"
    (onTodoUpdate)="onTodoUpdate($event)"
  ></app-add-todo-form>`,
})
class TestHostComponent {
  buttonInfo = { variant: 'primary', label: 'Add' };
  placeholder = 'Add your task';
  isLoading = false;
  todoValue = '';
  onTodoAdd = jasmine.createSpy('onTodoAdd');
  onTodoUpdate = jasmine.createSpy('onTodoUpdate');
}

describe('AddTodoFormComponent', () => {
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

  it('should render a form element', () => {
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));
    expect(form).toBeTruthy();
  });

  it('should render input and button', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('app-input'));
    const button = fixture.debugElement.query(By.css('app-button'));
    expect(input).toBeTruthy();
    expect(button).toBeTruthy();
  });

  it('should display the button label', () => {
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));
    expect(form.nativeElement.textContent).toContain('Add');
  });

  it('should emit onTodoAdd when form is submitted with text', () => {
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    addForm.inputValue = 'New todo';
    addForm.onSubmit(new Event('submit'));
    expect(component.onTodoAdd).toHaveBeenCalledWith('New todo');
  });

  it('should not emit when input is empty', () => {
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    addForm.inputValue = '';
    addForm.onSubmit(new Event('submit'));
    expect(component.onTodoAdd).not.toHaveBeenCalled();
    expect(component.onTodoUpdate).not.toHaveBeenCalled();
  });

  it('should not emit when input is whitespace only', () => {
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    addForm.inputValue = '   ';
    addForm.onSubmit(new Event('submit'));
    expect(component.onTodoAdd).not.toHaveBeenCalled();
    expect(component.onTodoUpdate).not.toHaveBeenCalled();
  });

  it('should emit onTodoUpdate when todoValue is set (edit mode)', () => {
    component.todoValue = 'Existing todo';
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    addForm.inputValue = 'Updated text';
    addForm.onSubmit(new Event('submit'));
    expect(component.onTodoUpdate).toHaveBeenCalledWith('Updated text');
    expect(component.onTodoAdd).not.toHaveBeenCalled();
  });

  it('should clear inputValue after submit', () => {
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    addForm.inputValue = 'Test';
    addForm.onSubmit(new Event('submit'));
    expect(addForm.inputValue).toBe('');
  });

  it('should update inputValue when todoValue changes via ngOnChanges', () => {
    component.todoValue = 'Edit this';
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    expect(addForm.inputValue).toBe('Edit this');
  });

  it('should set inputValue to empty string when todoValue changes to empty', () => {
    component.todoValue = 'something';
    fixture.detectChanges();
    component.todoValue = '';
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    expect(addForm.inputValue).toBe('');
  });

  it('should compute buttonClasses from buttonInfo', () => {
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    expect(addForm.buttonClasses).toBe('button primary');
  });

  it('should handle handleChange', () => {
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    addForm.handleChange('typed value');
    expect(addForm.inputValue).toBe('typed value');
  });

  it('should prevent default on submit', () => {
    fixture.detectChanges();
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') } as any;
    addForm.inputValue = 'Test';
    addForm.onSubmit(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should have default values', () => {
    const addForm = fixture.debugElement.query(By.directive(AddTodoFormComponent)).componentInstance;
    fixture.detectChanges();
    expect(addForm.buttonInfo).toEqual({ variant: 'primary', label: 'Add' });
    expect(addForm.placeholder).toBe('Add your task');
    expect(addForm.isLoading).toBe(false);
    expect(addForm.todoValue).toBe('');
  });
});
