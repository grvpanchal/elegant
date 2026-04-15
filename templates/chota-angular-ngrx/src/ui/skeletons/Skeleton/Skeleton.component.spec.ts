import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import SkeletonComponent from './Skeleton.component';

@Component({
  standalone: true,
  imports: [SkeletonComponent],
  template: `<app-skeleton
    [width]="width"
    [height]="height"
    [style]="style"
    [variant]="variant"
  ></app-skeleton>`,
})
class TestHostComponent {
  width = '100%';
  height = '1rem';
  style = {};
  variant = 'text';
}

describe('SkeletonComponent', () => {
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

  it('should render a div with skeleton classes', () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    expect(div).toBeTruthy();
    expect(div.nativeElement.classList.contains('skeleton')).toBe(true);
    expect(div.nativeElement.classList.contains('skeleton-text')).toBe(true);
  });

  it('should compute classes with variant', () => {
    const skeleton = fixture.debugElement.query(By.directive(SkeletonComponent)).componentInstance;
    fixture.detectChanges();
    expect(skeleton.classes).toBe('skeleton skeleton-text');
  });

  it('should compute classes with circle variant', () => {
    component.variant = 'circle';
    fixture.detectChanges();
    const skeleton = fixture.debugElement.query(By.directive(SkeletonComponent)).componentInstance;
    expect(skeleton.classes).toBe('skeleton skeleton-circle');
  });

  it('should compute styles with width and height', () => {
    const skeleton = fixture.debugElement.query(By.directive(SkeletonComponent)).componentInstance;
    fixture.detectChanges();
    expect(skeleton.styles).toEqual({ height: '1rem', width: '100%' });
  });

  it('should merge custom style with width and height', () => {
    component.style = { marginBottom: '10px' };
    fixture.detectChanges();
    const skeleton = fixture.debugElement.query(By.directive(SkeletonComponent)).componentInstance;
    expect(skeleton.styles).toEqual({ marginBottom: '10px', height: '1rem', width: '100%' });
  });

  it('should have default values', () => {
    const skeleton = fixture.debugElement.query(By.directive(SkeletonComponent)).componentInstance;
    fixture.detectChanges();
    expect(skeleton.width).toBe('100%');
    expect(skeleton.height).toBe('1rem');
    expect(skeleton.style).toEqual({});
    expect(skeleton.variant).toBe('text');
  });
});
