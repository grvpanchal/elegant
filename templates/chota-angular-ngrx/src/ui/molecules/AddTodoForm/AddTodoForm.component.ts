import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-add-todo-form",
  templateUrl: "./AddTodoForm.component.html",
  styleUrls: ["./AddTodoForm.style.css"],
})
export default class AddTodoFormComponent {
  /**
   * Is this the principal call to action on the page?
   */
  @Input()
  buttonInfo = {
    variant: "primary",
    label: "Add",
  };

  @Input()
  placeholder = "Add your task";

  @Input()
  isLoading = false;

  @Input()
  todoValue?: string;

  /**
   * Optional click handler
   */
  @Output()
  onTodoAdd = new EventEmitter();

  @Output()
  onTodoUpdate = new EventEmitter();

  inputValue: String;

  get buttonClasses() {
    return `button ${this.buttonInfo.variant}`;
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.inputValue.trim()) {
      return;
    }
    if (this.todoValue) {
      this.onTodoUpdate.emit(this.inputValue);
    } else {
      this.onTodoAdd.emit(this.inputValue);
    }
    this.inputValue = "";
  }

  handleChange(e) {
    this.todoValue = e;
  }
}
