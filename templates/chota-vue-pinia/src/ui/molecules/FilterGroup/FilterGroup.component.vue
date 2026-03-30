<template>
  <div class="grouped" role="group">
    <template v-for="filterItem in filterItems" v-bind:key="filterItem.id">
      <Link :isActive="filterItem.selected" @onClick="() => $emit('onFilterClick', filterItem.id)">
      {{ filterItem.label }}
      </Link>
    </template>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import Link from '../../atoms/Link/Link.component.vue';

export default defineComponent({
  components: { Link },
  props: ['filterItems', 'onFilterClick'],
})
</script>
