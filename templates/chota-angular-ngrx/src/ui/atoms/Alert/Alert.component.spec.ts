import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import AlertComponent from './Alert.component';

@Component({
  standalone: true,
  imports: [AlertComponent],
  template: `<app-alert
    [show]="show"
    [variant]="variant"
    [message]="message"
    (onCloseClick)="onCloseClick($event)"
  ></app-alert>`,
})
class TestHostComponent {
  show = false;
  variant = 'info';
  message = 'Test alert';
  onCloseClick = jasmine.createSpy('onCloseClick');
}

describe('AlertComponent', () => {
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

  it('should not show alert when show is false', () => {
    fixture.detectChanges();
    const alertDiv = fixture.debugElement.query(By.css('.alert'));
    expect(alertDiv).toBeFalsy();
  });

  it('should show alert when show is true', () => {
    component.show = true;
    fixture.detectChanges();
    const alertDiv = fixture.debugElement.query(By.css('.alert'));
    expect(alertDiv).toBeTruthy();
  });

  it('should display the message', () => {
    component.show = true;
    fixture.detectChanges();
    const messageEl = fixture.debugElement.query(By.css('.message span'));
    expect(messageEl.nativeElement.textContent).toBe('Test alert');
  });

  it('should have primary classes for info variant', () => {
    component.show = true;
    component.variant = 'info';
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.directive(AlertComponent)).componentInstance;
    expect(alert.classes).toBe('bg-primary text-white alert');
  });

  it('should have error classes for error variant', () => {
    component.show = true;
    component.variant = 'error';
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.directive(AlertComponent)).componentInstance;
    expect(alert.classes).toBe('bg-error text-white alert');
  });

  it('should use info icon for info variant', () => {
    component.show = true;
    component.variant = 'info';
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.directive(AlertComponent)).componentInstance;
    expect(alert.src).toContain('info.svg');
  });

  it('should use alert-triangle icon for error variant', () => {
    component.show = true;
    component.variant = 'error';
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.directive(AlertComponent)).componentInstance;
    expect(alert.src).toContain('alert-triangle.svg');
  });

  it('should hide alert and emit onCloseClick when close button is clicked', () => {
    component.show = true;
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.css('app-icon-button'));
    iconButton.triggerEventHandler('onClick', new Event('click'));
    const alert = fixture.debugElement.query(By.directive(AlertComponent)).componentInstance;
    expect(alert.showAlert).toBe(false);
    expect(component.onCloseClick).toHaveBeenCalled();
  });

  it('should update showAlert via ngOnChanges when show input changes', () => {
    component.show = true;
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.directive(AlertComponent)).componentInstance;
    expect(alert.showAlert).toBe(true);

    component.show = false;
    fixture.detectChanges();
    expect(alert.showAlert).toBe(false);
  });

  it('should have default values', () => {
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.directive(AlertComponent)).componentInstance;
    expect(alert.show).toBe(false);
    expect(alert.message).toBe('Test alert');
  });
});
