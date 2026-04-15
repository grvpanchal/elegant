import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import InputComponent from './Input.component';

@Component({
  standalone: true,
  imports: [InputComponent],
  template: `<app-input
    [value]="value"
    [placeholder]="placeholder"
    [disabled]="disabled"
    [id]="id"
    [name]="name"
    [type]="type"
    [checked]="checked"
    (onChange)="onChange($event)"
  ></app-input>`,
})
class TestHostComponent {
  value = '';
  placeholder = 'Enter text';
  disabled = false;
  id = 'test-input';
  name = 'test';
  type = 'text';
  checked = false;
  onChange = jasmine.createSpy('onChange');
}

describe('InputComponent', () => {
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

  it('should render an input element', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });

  it('should render a label with the name', () => {
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('test');
  });

  it('should bind the placeholder', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.placeholder).toBe('Enter text');
  });

  it('should bind the id', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.id).toBe('test-input');
  });

  it('should bind the disabled state', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBe(true);
  });

  it('should emit onChange on input event for text input', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'hello';
    input.triggerEventHandler('input', { target: { type: 'text', value: 'hello', checked: false } });
    expect(component.onChange).toHaveBeenCalledWith('hello');
  });

  it('should emit checked value as string for checkbox input', () => {
    component.type = 'checkbox';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('input', { target: { type: 'checkbox', value: '', checked: true } });
    expect(component.onChange).toHaveBeenCalledWith('true');
  });

  it('should emit unchecked value as string for checkbox input', () => {
    component.type = 'checkbox';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('input', { target: { type: 'checkbox', value: '', checked: false } });
    expect(component.onChange).toHaveBeenCalledWith('false');
  });

  it('should have default empty values', () => {
    fixture.detectChanges();
    const inputComponent = fixture.debugElement.query(By.directive(InputComponent)).componentInstance;
    expect(inputComponent.value).toBe('');
    expect(inputComponent.placeholder).toBe('Enter text');
    expect(inputComponent.disabled).toBe(false);
    expect(inputComponent.id).toBe('test-input');
    expect(inputComponent.name).toBe('test');
    expect(inputComponent.type).toBe('text');
    expect(inputComponent.checked).toBe(false);
  });
});
