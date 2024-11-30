import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-filters',
  templateUrl: './TodoFilters.component.html',
  styleUrls: ['./TodoFilters.style.css'],
})
export default class TodoFiltersComponent {
  @Input()
  headerData = [];

  @Input()
  events = {
    onTodoFilterUpdate: new EventEmitter(),
  };
}
