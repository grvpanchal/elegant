import { defineStore, acceptHMRUpdate } from 'pinia';
import { addTodos, deleteTodos, getTodos, updateTodos, updateToggleTodos } from './todo.operations';
import intialTodoState from './todo.initial';
import { getVisibleTodos } from './todo.selectors';
import { editTodo } from './todo.actions';
import { useFiltersStore } from '../filters';
import { getSelectedFilter } from '../filters/filters.selectors';

export const useTodoStore = defineStore({
  id: 'todo',
  state: () => ({ ...intialTodoState }),
  getters: {
    visibleTodos: (state) => {
      const filtersData = useFiltersStore();
      const selectedFilter = getSelectedFilter(filtersData);
      return getVisibleTodos(state, selectedFilter.id);
    }
  },
  actions: {
    getTodos,
    addTodos,
    editTodo,
    updateTodos,
    updateToggleTodos,
    deleteTodos,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodoStore, import.meta.hot))
}
