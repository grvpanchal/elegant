import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { getTheme } from '../../../app/state/config/config.selectors';
import IconButtonComponent from './IconButton.component';

@Component({
  standalone: true,
  imports: [IconButtonComponent],
  template: `<app-icon-button
    [variant]="variant"
    [alt]="alt"
    [color]="color"
    [size]="size"
    [iconName]="iconName"
    (onClick)="onClick($event)"
  ></app-icon-button>`,
})
class TestHostComponent {
  variant = 'clear';
  alt = 'close';
  color = '';
  size = '16';
  iconName = 'x';
  onClick = jasmine.createSpy('onClick');
}

describe('IconButtonComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideMockStore({
          selectors: [{ selector: getTheme, value: 'light' }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render a button with icon-button classes', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.classList.contains('button')).toBe(true);
    expect(button.nativeElement.classList.contains('icon-only')).toBe(true);
  });

  it('should include variant in button classes', () => {
    component.variant = 'clear';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
    expect(button.classes).toBe('button icon-only clear');
  });

  it('should generate correct src with default theme color for light theme', () => {
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
    expect(iconButton.src).toContain('color=000000');
  });

  it('should generate correct src with dark theme color', () => {
    const store = TestBed.inject(MockStore);
    store.overrideSelector(getTheme, 'dark');
    store.refreshState();
    fixture.detectChanges();

    const iconButton = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
    expect(iconButton.themeColor).toBe('ffffff');
  });

  it('should use provided color over theme color', () => {
    component.color = 'ff0000';
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
    expect(iconButton.src).toContain('color=ff0000');
  });

  it('should use provided icon name in src', () => {
    component.iconName = 'edit';
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
    expect(iconButton.src).toContain('edit.svg');
  });

  it('should use provided size in src', () => {
    component.size = '24';
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
    expect(iconButton.src).toContain('size=24');
  });

  it('should emit onClick event', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', new Event('click'));
    expect(component.onClick).toHaveBeenCalled();
  });

  it('should have default values', () => {
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
    expect(iconButton.alt).toBe('close');
    expect(iconButton.color).toBe('');
    expect(iconButton.size).toBe('16');
    expect(iconButton.iconName).toBe('x');
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
    spyOn(iconButton.sub, 'unsubscribe').and.callThrough();
    fixture.destroy();
    expect(iconButton.sub.unsubscribe).toHaveBeenCalled();
  });
});
