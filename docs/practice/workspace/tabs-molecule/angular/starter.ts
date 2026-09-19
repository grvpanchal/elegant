import { Component, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Tabs molecule.
 * - roving tabindex: exactly one tab has tabindex="0" (the selected one)
 * - ArrowLeft/ArrowRight wrap; Home/End jump to first/last
 * - role=tablist / role=tab / role=tabpanel, aria-selected, aria-controls,
 *   aria-labelledby, and `hidden` on the panels that are not shown
 * - the visible panel needs tabindex="0" so Tab reaches its content
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./Tabs.style.css'],
  template: `
    <!-- Your code here. -->
    <div role="tablist">
      <button *ngFor="let tab of tabs; let i = index" role="tab" #tabButton>{{ tab.label }}</button>
    </div>
  `,
})
export default class TabsComponent {
  @Input() tabs: Array<{ id: string; label: string }> = [];
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  selected = 0;
}
