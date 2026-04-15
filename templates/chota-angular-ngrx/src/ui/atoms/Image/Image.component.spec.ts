import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import ImageComponent from './Image.component';

@Component({
  standalone: true,
  imports: [ImageComponent],
  template: `<app-image [alt]="alt" [src]="src"></app-image>`,
})
class TestHostComponent {
  alt = 'Test image';
  src = 'https://example.com/test.png';
}

describe('ImageComponent', () => {
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

  it('should render an img element', () => {
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
  });

  it('should bind the src attribute', () => {
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement.getAttribute('src')).toBe('https://example.com/test.png');
  });

  it('should bind the alt attribute', () => {
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement.getAttribute('alt')).toBe('Test image');
  });

  it('should have default values', () => {
    fixture.detectChanges();
    const image = fixture.debugElement.query(By.directive(ImageComponent)).componentInstance;
    expect(image.alt).toBe('Test image');
    expect(image.src).toBe('https://example.com/test.png');
  });
});
