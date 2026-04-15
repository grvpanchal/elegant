import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import FilterGroupComponent from './FilterGroup.component';

@Component({
  standalone: true,
  imports: [FilterGroupComponent],
  template: `<app-filter-group
    [filterItems]="filterItems"
    (onFilterClick)="onFilterClick($event)"
  ></app-filter-group>`,
})
class TestHostComponent {
  filterItems = [
    { id: 'SHOW_ALL', label: 'All', selected: true },
    { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
    { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
  ];
  onFilterClick = jasmine.createSpy('onFilterClick');
}

describe('FilterGroupComponent', () => {
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

  it('should render a group div with role="group"', () => {
    fixture.detectChanges();
    const group = fixture.debugElement.query(By.css('[role="group"]'));
    expect(group).toBeTruthy();
  });

  it('should render all filter items', () => {
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('app-link'));
    expect(links.length).toBe(3);
  });

  it('should display filter labels', () => {
    fixture.detectChanges();
    const group = fixture.debugElement.query(By.css('[role="group"]'));
    const text = group.nativeElement.textContent;
    expect(text).toContain('All');
    expect(text).toContain('Active');
    expect(text).toContain('Completed');
  });

  it('should emit onFilterClick with the filter id when a link is clicked', () => {
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('app-link'));
    links[1].triggerEventHandler('onClick', new Event('click'));
    expect(component.onFilterClick).toHaveBeenCalledWith('SHOW_ACTIVE');
  });

  it('should pass selected state to link components', () => {
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('app-link'));
    const firstLink = links[0].componentInstance;
    const secondLink = links[1].componentInstance;
    expect(firstLink.isActive).toBe(true);
    expect(secondLink.isActive).toBe(false);
  });

  it('should handle empty filterItems', () => {
    component.filterItems = [];
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('app-link'));
    expect(links.length).toBe(0);
  });
});
