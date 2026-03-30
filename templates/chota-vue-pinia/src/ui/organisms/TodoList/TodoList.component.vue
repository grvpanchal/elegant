<template>
  <div>
    <Alert v-if="todoData.error" variant="error" :show="!!todoData.error" :message="todoData.error" />
    <AddTodoForm :todoValue="todoData.currentTodoItem.text || ''" @onTodoAdd="events.onTodoCreate"
      @onTodoUpdate="events.onTodoUpdate" placeholder="Add your task" :isLoading="todoData.isActionLoading"
      :buttonInfo="getButtonInfo()" />
    <div>
      <template v-if="todoData.isContentLoading">
        <br />
        <Skeleton height="24px" />
        <br />
        <Skeleton height="24px" />
        <br />
        <Skeleton height="24px" />
      </template>
      <template v-else>
        <TodoItems
          :todos="todoData.todoItems || []"
          :isDisabled="todoData.isActionLoading"
          @onToggleClick="events.onTodoToggleUpdate"
          @onDeleteClick="events.onTodoDelete"
          @onEditClick="events.onTodoEdit"
        />
      </template>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import Alert from '../../atoms/Alert/Alert.component.vue';
import TodoItems from '../../molecules/TodoItems/TodoItems.component.vue';
import AddTodoForm from '../../molecules/AddTodoForm/AddTodoForm.component.vue';
import Skeleton from '../../skeletons/Skeleton/Skeleton.component.vue';

export default defineComponent({
  components: { Alert, TodoItems, AddTodoForm, Skeleton },
  props: ['todoData', 'events'],
  methods: {
    getButtonInfo() {
      return {
        label: this.todoData.currentTodoItem.text ? " Save" : "Add", variant: "primary"
      };
    }
  }
})
</script>
