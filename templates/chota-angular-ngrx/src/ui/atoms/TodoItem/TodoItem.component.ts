import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import InputComponent from '../Input/Input.component';
import IconButtonComponent from '../IconButton/IconButton.component';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [InputComponent, IconButtonComponent],
  templateUrl: './TodoItem.component.html',
  styleUrls: ['./TodoItem.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export default class TodoItemComponent {
  @Input() id: number | null = null;
  @Input() text = '';
  @Input() completed = false;
  @Input() isDisabled = false;

  get checkboxId() {
    return `checkbox${this.id}`;
  }

  @Output() onToggleClick = new EventEmitter<any>();
  @Output() onEditClick = new EventEmitter<any>();
  @Output() onDeleteClick = new EventEmitter<any>();
}
