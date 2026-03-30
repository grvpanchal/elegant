<template>
    <div>
        <div v-if="filtersData && filtersData.isContentLoading" style="display:flex; gap: 1rem;">
          <Skeleton height="24px" />
          <Skeleton height="24px" />
          <Skeleton height="24px" />
        </div>
        <template v-else>
          <FilterGroup
            :filterItems="filtersData"
            @onFilterClick="events.onTodoFilterUpdate"
          />
        </template>
    </div>
  </template>
  <script>
  import { defineComponent } from 'vue';
  import FilterGroup from '../../molecules/FilterGroup/FilterGroup.component.vue';
  import Skeleton from '../../skeletons/Skeleton/Skeleton.component.vue';
  
  export default defineComponent({
    components: { FilterGroup, Skeleton },
    props: ['filtersData', 'events'],
  })
  </script>