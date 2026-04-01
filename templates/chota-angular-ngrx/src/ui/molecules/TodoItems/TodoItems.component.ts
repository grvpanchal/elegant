import { Component, Input, Output, EventEmitter } from '@angular/core';
import TodoItemComponent from '../../atoms/TodoItem/TodoItem.component';

@Component({
  selector: 'app-todo-items',
  standalone: true,
  imports: [TodoItemComponent],
  templateUrl: './TodoItems.component.html',
  styleUrls: ['./TodoItems.style.css'],
})
export default class TodoItemsComponent {
  @Input() todos: any[] = [];
  @Input() isDisabled = false;

  @Output() onToggleClick = new EventEmitter<any>();
  @Output() onEditClick = new EventEmitter<any>();
  @Output() onDeleteClick = new EventEmitter<any>();
}

