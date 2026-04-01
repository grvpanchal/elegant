import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import InputComponent from '../../atoms/Input/Input.component';
import ButtonComponent from '../../atoms/Button/Button.component';

@Component({
  selector: 'app-add-todo-form',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  templateUrl: './AddTodoForm.component.html',
  styleUrls: ['./AddTodoForm.style.css'],
})
export default class AddTodoFormComponent implements OnChanges {
  @Input() buttonInfo = { variant: 'primary', label: 'Add' };
  @Input() placeholder = 'Add your task';
  @Input() isLoading = false;
  @Input() todoValue = '';

  @Output() onTodoAdd = new EventEmitter<string>();
  @Output() onTodoUpdate = new EventEmitter<string>();

  inputValue = '';

  get buttonClasses() {
    return `button ${this.buttonInfo.variant}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['todoValue']) {
      this.inputValue = changes['todoValue'].currentValue || '';
    }
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const trimmed = this.inputValue.trim();
    if (!trimmed) return;
    if (this.todoValue) {
      this.onTodoUpdate.emit(trimmed);
    } else {
      this.onTodoAdd.emit(trimmed);
    }
    this.inputValue = '';
  }

  handleChange(value: string) {
    this.inputValue = value;
  }
}

