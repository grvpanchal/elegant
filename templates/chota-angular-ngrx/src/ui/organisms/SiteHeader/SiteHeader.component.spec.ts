import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import SiteHeaderComponent from './SiteHeader.component';

@Component({
  standalone: true,
  imports: [SiteHeaderComponent],
  template: `<app-site-header
    [headerData]="headerData"
    [events]="events"
  ></app-site-header>`,
})
class TestHostComponent {
  headerData = { brandName: 'Todo App', theme: 'light' };
  events = {
    onThemeChangeClick: jasmine.createSpy('onThemeChangeClick'),
  };
}

describe('SiteHeaderComponent', () => {
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

  it('should render the brand name', () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('.header'));
    expect(header).toBeTruthy();
    expect(header.nativeElement.textContent).toContain('Todo App');
  });

  it('should render theme toggle element', () => {
    fixture.detectChanges();
    const themeToggle = fixture.debugElement.query(By.css('.pointer'));
    expect(themeToggle).toBeTruthy();
  });

  it('should emit onThemeChangeClick when theme toggle is clicked', () => {
    fixture.detectChanges();
    const themeToggle = fixture.debugElement.query(By.css('.pointer'));
    themeToggle.triggerEventHandler('click', new Event('click'));
    expect(component.events.onThemeChangeClick).toHaveBeenCalled();
  });

  it('should have default headerData', () => {
    const siteHeader = fixture.debugElement.query(By.directive(SiteHeaderComponent)).componentInstance;
    fixture.detectChanges();
    expect(siteHeader.headerData).toEqual({ brandName: 'Todo App', theme: 'light' });
  });

  it('should have default events with no-op function', () => {
    const siteHeader = fixture.debugElement.query(By.directive(SiteHeaderComponent)).componentInstance;
    fixture.detectChanges();
    expect(siteHeader.events.onThemeChangeClick).toBeDefined();
    expect(() => siteHeader.events.onThemeChangeClick()).not.toThrow();
  });
});
