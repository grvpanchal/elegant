<template>
  <TodoFilters :filtersData="filtersData.filters" :events="events" />
</template>

<script>
import { defineComponent } from 'vue';
import { useFiltersStore } from '../state/filters';
import TodoFilters from '../ui/organisms/TodoFilters/TodoFilters.component.vue'

export default defineComponent({
  components: {
    TodoFilters
  },
  props: [],
  setup() {
    const filtersData = useFiltersStore();
    const events = {
      onTodoFilterUpdate: (id) => { console.log('id', id); filtersData.setVisibilityFilter(id); },
    };

    return {
      filtersData,
      events,
    }
  },
})
</script>