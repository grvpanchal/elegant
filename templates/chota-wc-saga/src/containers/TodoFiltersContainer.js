import { LitElement, html } from 'lit-element';
import store, { useDispatch } from '../state';
import { connect } from 'pwa-helpers';

import "../ui/organisms/TodoFilters/app-todo-filters";

import { setVisibilityFilter } from "../state/filters/filters.action";


export default class TodoFiltersContainer extends connect(store)(LitElement) {
  static get properties() {
    return {
      filtersData: { type: Object },
      events: { type: Object }
    };
  }
  constructor() {
    super();
    const dispatch = useDispatch();
    this.events = {
      onTodoFilterUpdate: (e) => dispatch(setVisibilityFilter(e.detail)),
    };
  }
  stateChanged(state) {
    this.filtersData = state.filters;
  }
  render() {
    return html`
      <app-todo-filters
        .filtersData=${this.filtersData}
        .events=${this.events}
      ></app-todo-filters>
    `;
  }
}

customElements.define('todo-filters-container', TodoFiltersContainer);