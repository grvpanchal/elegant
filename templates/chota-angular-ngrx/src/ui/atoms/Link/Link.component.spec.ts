import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import LinkComponent from './Link.component';

@Component({
  standalone: true,
  imports: [LinkComponent],
  template: `<app-link [isActive]="isActive" (onClick)="onClick($event)">
    Filter text
  </app-link>`,
})
class TestHostComponent {
  isActive = false;
  onClick = jasmine.createSpy('onClick');
}

describe('LinkComponent', () => {
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

  it('should render an anchor element', () => {
    fixture.detectChanges();
    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor).toBeTruthy();
  });

  it('should render content', () => {
    fixture.detectChanges();
    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor.nativeElement.textContent.trim()).toBe('Filter text');
  });

  it('should have outline class when not active', () => {
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.directive(LinkComponent)).componentInstance;
    expect(link.classes).toBe('button outline');
  });

  it('should have primary class when active', () => {
    component.isActive = true;
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.directive(LinkComponent)).componentInstance;
    expect(link.classes).toBe('button primary');
  });

  it('should emit onClick when clicked', () => {
    fixture.detectChanges();
    const anchor = fixture.debugElement.query(By.css('a'));
    anchor.triggerEventHandler('click', new Event('click'));
    expect(component.onClick).toHaveBeenCalled();
  });

  it('should have default isActive as false', () => {
    const link = fixture.debugElement.query(By.directive(LinkComponent)).componentInstance;
    fixture.detectChanges();
    expect(link.isActive).toBe(false);
  });
});
