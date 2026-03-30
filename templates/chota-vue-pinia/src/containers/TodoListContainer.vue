<template>
  <TodoList :todoData="todoData.visibleTodos" :events="events" />
</template>

<script>
import { defineComponent } from 'vue';
import { useFiltersStore } from '../state/filters';
import { useTodoStore } from '../state/todo';
import TodoList from '../ui/organisms/TodoList/TodoList.component.vue'

export default defineComponent({
  components: {
    TodoList
  },
  props: [],
  setup() {
    const filtersData = useFiltersStore();
    const todoData = useTodoStore();
    todoData.getTodos();
    const events = {
      onTodoCreate: (payload) => todoData.addTodos(payload),
      onTodoEdit: (payload) => todoData.editTodo(payload),
      onTodoUpdate: (text) =>
        todoData.updateTodos({ id: todoData.currentTodoItem.id, text }),
      onTodoToggleUpdate: (todo) => todoData.updateToggleTodos(todo),
      onTodoDelete: (payload) => todoData.deleteTodos(payload),
    };

    console.log();

    return {
      filtersData,
      todoData,
      events,
    }
  },
})
</script>