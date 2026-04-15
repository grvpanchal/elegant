import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import ButtonComponent from './Button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<app-button [isLoading]="isLoading" [classes]="classes" [type]="type" (onClick)="onClick($event)">
    Click me
  </app-button>`,
})
class TestHostComponent {
  isLoading = false;
  classes = 'button primary';
  type = 'button';
  onClick = jasmine.createSpy('onClick');
}

describe('ButtonComponent', () => {
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

  it('should render a button with the provided classes when not loading', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.classList.contains('button')).toBe(true);
    expect(button.nativeElement.classList.contains('primary')).toBe(true);
  });

  it('should render button text content', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.textContent.trim()).toBe('Click me');
  });

  it('should emit onClick event when button is clicked', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', new Event('click'));
    expect(component.onClick).toHaveBeenCalled();
  });

  it('should have type="button" by default', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.getAttribute('type')).toBe('button');
  });

  it('should have custom type when provided', () => {
    component.type = 'submit';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.getAttribute('type')).toBe('submit');
  });

  it('should show loader and disable button when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBe(true);
    expect(button.nativeElement.classList.contains('loading-button')).toBe(true);
  });

  it('should not emit onClick when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', new Event('click'));
    expect(component.onClick).not.toHaveBeenCalled();
  });

  it('should render loader component when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const loader = fixture.debugElement.query(By.css('app-loader'));
    expect(loader).toBeTruthy();
  });

  it('should compute classes with loading-button when isLoading', () => {
    const buttonComponent = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;
    component.isLoading = true;
    fixture.detectChanges();
    expect(buttonComponent.computedClasses).toBe('button primary loading-button');
  });

  it('should compute classes without loading-button when not loading', () => {
    const buttonComponent = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;
    fixture.detectChanges();
    expect(buttonComponent.computedClasses).toBe('button primary');
  });
});
