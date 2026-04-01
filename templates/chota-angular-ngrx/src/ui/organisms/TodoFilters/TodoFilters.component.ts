import { Component, Input } from '@angular/core';
import FilterGroupComponent from '../../molecules/FilterGroup/FilterGroup.component';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [FilterGroupComponent],
  templateUrl: './TodoFilters.component.html',
  styleUrls: ['./TodoFilters.style.css'],
})
export default class TodoFiltersComponent {
  @Input() filtersData: { id: string; label: string; selected: boolean }[] = [];

  @Input() events: { onTodoFilterUpdate: (id: string) => void } = {
    onTodoFilterUpdate: () => {},
  };
}

