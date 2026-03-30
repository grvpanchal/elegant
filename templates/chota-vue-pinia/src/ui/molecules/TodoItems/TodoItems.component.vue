<template>
  <div>
    <ul v-if="todos && todos.length" class="todo-items">
      <template v-for="todo in todos" v-bind:key="todo.id" >
        <TodoItem :id="todo.id" :completed="todo.completed" :text="todo.text" @onToggleClick="$emit('onToggleClick', todo)" @onEditClick="$emit('onEditClick', todo)" @onDeleteClick="$emit('onDeleteClick', todo.id)" />
      </template>
    </ul>
    <p v-else class="text-center empty-text">Nothing to display here. Carry on.</p>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import TodoItem from '../../atoms/TodoItem/TodoItem.component.vue';

export default defineComponent({
  components: { TodoItem },
  props: ['todos', 'isDisabled', 'onToggleClick', 'onEditClick', 'onDeleteClick'],
})
</script>

<style scoped src="./TodoItems.style.css"></style>