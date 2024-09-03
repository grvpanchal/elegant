<template>
  <li
    :style="getTodoItemStyle()"
    class="todo-item"
  >
    <label :htmlFor="getInputId()">
      <Input
        :id="getInputId()"
        name="checkbox"
        type="checkbox"
        :checked="completed"
        @onInput="$emit('onToggleClick')"
      />
      {{text}}
      <span class="icon-buttons">
        <IconButton
          variant="clear"
          alt="edit"
          iconName="edit"
          size="16"
          @onClick="$emit('onEditClick')"
        />
        <IconButton
          variant="clear"
          alt="remove"
          iconName="trash-2"
          size="16"
          @onClick="$emit('onDeleteClick')"
        />
      </span>
    </label>
  </li>
</template>
<script>
import { defineComponent } from 'vue'
import Input from '../Input/Input.component.vue';
import IconButton from '../IconButton/IconButton.component.vue';

export default defineComponent({
  components: { Input, IconButton },
  props: [
    'onToggleClick',
    'completed',
    'text',
    'id',
    'onEditClick',
    'onDeleteClick',
  ],
  methods: {
    getInputId() {
      return `checkbox${this.id}`;
    },
    getTodoItemStyle() {
      return `text-decoration: ${this.completed ? "line-through" : "none"}`;
    },
  },
})
</script>

<style scoped src="./TodoItem.style.css"></style>
