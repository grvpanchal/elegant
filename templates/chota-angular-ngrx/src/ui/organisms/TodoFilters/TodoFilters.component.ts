import { Component, Input } from '@angular/core';
import FilterGroupComponent from '../../molecules/FilterGroup/FilterGroup.component';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [FilterGroupComponent],
  templateUrl: './TodoFilters.component.html',
  styleUrls: ['./TodoFilters.style.css'],
})
/* istanbul ignore next */
export default class TodoFiltersComponent {
  /* istanbul ignore next */
  @Input() filtersData: { id: string; label: string; selected: boolean }[] = [];

  /* istanbul ignore next */
  @Input() events: { onTodoFilterUpdate: (id: string) => void } = {
    onTodoFilterUpdate: () => {},
  };
}

