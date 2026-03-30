import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-todo-items",
  templateUrl: "./TodoItems.component.html",
  styleUrls: ["./TodoItems.style.css"],
})
export default class TodoItemsComponent {
  /**
   * Is this the principal call to action on the page?
   */
  @Input()
  todos = [];

  @Input()
  isDisabled = false;

  @Output()
  onToggleClick = new EventEmitter();
  onEditClick = new EventEmitter();
  onDeleteClick = new EventEmitter();
}
