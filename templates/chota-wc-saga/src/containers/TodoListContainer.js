import { LitElement, html } from 'lit-element';
import store, { useDispatch } from '../state';
import { connect } from 'pwa-helpers';

import "../ui/organisms/TodoFilters/app-todo-filters";

import {
  createTodo,
  deleteTodo,
  editTodo,
  readTodo,
  toggleTodo,
  updateTodo,
} from "../state/todo/todo.actions";

import { getSelectedFilter } from "../state/filters/filters.selectors";
import { getVisibleTodos } from "../state/todo/todo.selectors";

import "../ui/organisms/TodoList/app-todo-list";

export default class TodoListContainer extends connect(store)(LitElement) {
  static get properties() {
    return {
      todoData: { type: Object },
      selectedFilter: { type: Object },
      events: { type: Object }
    };
  }
  constructor() {
    super();
    const dispatch = useDispatch();
    this.events = {
      onTodoCreate: (e) => dispatch(createTodo(e.detail)),
      onTodoEdit: (e) => dispatch(editTodo(e.detail)),
      onTodoUpdate: (e) =>
        dispatch(updateTodo({ id: this.todoData.currentTodoItem.id, text: e.detail })),
      onTodoToggleUpdate: (e) => dispatch(toggleTodo(e.detail)),
      onTodoDelete: (e) => dispatch(deleteTodo(e.detail)),
    };

    dispatch(readTodo());
  }
  stateChanged(state) {
    this.selectedFilter = getSelectedFilter(state);
    this.todoData = getVisibleTodos(state.todo, this.selectedFilter.id);
  }
  render() {
    return html`
      <app-todo-list
        .todoData=${this.todoData}
        .events=${this.events}
      ></app-todo-list>
    `;
  }
}

customElements.define('todo-list-container', TodoListContainer);