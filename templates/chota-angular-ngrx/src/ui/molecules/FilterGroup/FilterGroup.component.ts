import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-group',
  templateUrl: './FilterGroup.component.html',
  styleUrls: ['./FilterGroup.style.css'],
})
export default class FilterGroupComponent {
  /**
   * Is this the principal call to action on the page?
   */
  @Input()
  filterItems = [];

  @Output()
  onFilterClick = new EventEmitter();
}
