import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import LoaderComponent from './Loader.component';

@Component({
  standalone: true,
  imports: [LoaderComponent],
  template: `<app-loader
    [size]="size"
    [width]="width"
    [color]="color"
  ></app-loader>`,
})
class TestHostComponent {
  size = '48px';
  width = '5px';
  color = '#fff';
}

describe('LoaderComponent', () => {
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

  it('should render a span with loader class', () => {
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('span.loader'));
    expect(span).toBeTruthy();
  });

  it('should apply the correct styles', () => {
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('span.loader'));
    const styles = span.nativeElement.getAttribute('style');
    expect(styles).toContain('height:48px');
    expect(styles).toContain('width:48px');
    expect(styles).toContain('border:5px solid #fff');
    expect(styles).toContain('border-bottom-color:transparent');
  });

  it('should compute correct styles with custom values', () => {
    component.size = '24px';
    component.width = '3px';
    component.color = 'red';
    fixture.detectChanges();
    const loader = fixture.debugElement.query(By.directive(LoaderComponent)).componentInstance;
    expect(loader.styles).toBe('height:24px;width:24px;border:3px solid red;border-bottom-color:transparent;');
  });

  it('should have default values', () => {
    const loader = fixture.debugElement.query(By.directive(LoaderComponent)).componentInstance;
    fixture.detectChanges();
    expect(loader.size).toBe('48px');
    expect(loader.width).toBe('5px');
    expect(loader.color).toBe('#fff');
  });
});
