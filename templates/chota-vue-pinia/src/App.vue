<template>
  <Layout>
    <config-container />
    <site-header-container />
    <todo-list-container />
    <todo-filters-container />
  </Layout>
</template>

<script lang="ts">
import Layout from './ui/templates/Layout/Layout.component.vue'

import { defineComponent, ref } from 'vue'
import ConfigContainer from './containers/ConfigContainer.vue'
import SiteHeaderContainer from './containers/SiteHeaderContainer.vue'
import TodoFiltersContainer from './containers/TodoFiltersContainer.vue'
import TodoListContainer from './containers/TodoListContainer.vue'

export default defineComponent({
  components: { Layout, ConfigContainer, SiteHeaderContainer, TodoFiltersContainer, TodoListContainer },
})
</script>
