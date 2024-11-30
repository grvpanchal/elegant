import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-todo-item",
  templateUrl: "./TodoItem.component.html",
  styleUrls: ["./TodoItem.style.css"],
})
export default class TodoItemComponent {

  @Input()
  id = false;

  @Input()
  text = '';

  @Input()
  completed = false;

  get checkboxId() {
    return `checkbox${this.id}`;
  }

  get styles() {
    return `textDecoration: ${this.completed ? "line-through" : "none"};`;
  }

  /**
   * Optional click handler
   */
  @Output()
  onToggleClick = new EventEmitter<Event>();

  @Output()
  onChange = new EventEmitter<Event>();

  @Output()
  onEditClick = new EventEmitter<Event>();

  @Output()
  onDeleteClick = new EventEmitter<Event>();
}
