import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './TodoList.component.html',
  styleUrls: ['./TodoList.style.css'],
})
export default class TodoListComponent {
  @Input()
  todoData = {
    todoItems: [],
      currentTodoItem: {
        id: '',
        text: '',
        completed: false
      },
  };

  get buttonInfo() {
    return {
      label: this.todoData?.currentTodoItem?.text ? 'Save' : 'Add',
      variant: 'primary',
    }
  }

  @Input()
  events = {
    onTodoCreate: new EventEmitter(),
    onTodoEdit: new EventEmitter(),
    onTodoUpdate: new EventEmitter(),
    onTodoToggleUpdate: new EventEmitter(),
    onTodoDelete: new EventEmitter(),
  };
}
