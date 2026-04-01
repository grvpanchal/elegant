import { Component, Input, Output, EventEmitter } from '@angular/core';
import LinkComponent from '../../atoms/Link/Link.component';

@Component({
  selector: 'app-filter-group',
  standalone: true,
  imports: [LinkComponent],
  templateUrl: './FilterGroup.component.html',
  styleUrls: ['./FilterGroup.style.css'],
})
export default class FilterGroupComponent {
  @Input() filterItems: { id: string; label: string; selected: boolean }[] = [];
  @Output() onFilterClick = new EventEmitter<string>();
}

