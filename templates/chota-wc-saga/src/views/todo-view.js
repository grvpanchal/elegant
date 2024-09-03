import { LitElement, html } from 'lit-element';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import {
  VisibilityFilters,
  getVisibleTodosSelector
} from '../redux/reducer.js';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';
import {
  addTodo,
  updateTodoStatus,
  updateFilter,
  clearCompleted
} from '../redux/actions.js';

import '../ui/templates/Layout/app-layout.js';

import '../containers/ConfigContainer.js';
import '../containers/SiteHeaderContainer.js';
import '../containers/TodoListContainer.js';
import '../containers/TodoFiltersContainer.js';

class TodoView extends connect(store)(LitElement) {
  static get properties() {
    return {
      todos: { type: Array },
      filter: { type: String },
      task: { type: String }
    };
  }

  stateChanged(state) {
    this.todos = getVisibleTodosSelector(state);
    this.filter = state.filter;
  }

  render() {
    return html`
      <app-layout>
        <config-container></config-container>
        <site-header-container></site-header-container>
        <todo-list-container></todo-list-container>
        <todo-filters-container></todo-filters-container>
      </app-layout>
    `;
  }

  addTodo() {
    if (this.task) {
      store.dispatch(addTodo(this.task));
      this.task = '';
    }
  }

  shortcutListener(e) {
    if (e.key === 'Enter') {
      this.addTodo();
    }
  }

  updateTask(e) {
    this.task = e.target.value;
  }

  updateTodoStatus(updatedTodo, complete) {
    store.dispatch(updateTodoStatus(updatedTodo, complete));
  }

  filterChanged(e) {
    store.dispatch(updateFilter(e.detail.value));
  }

  clearCompleted() {
    store.dispatch(clearCompleted());
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('todo-view', TodoView);
