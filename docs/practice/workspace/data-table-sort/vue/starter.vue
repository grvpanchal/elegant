<script setup>
import { ref, computed } from "vue";

// DataTable with sortable columns.
// - click cycles asc -> desc -> unsorted (original order)
// - the <th> carries aria-sort="ascending|descending|none"
// - the header contains a real <button> so the keyboard works for free
// - the sort is STABLE: equal values keep their previous relative order
// - the computed depends on rows, column and direction only
const props = defineProps({
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
});
const sort = ref({ column: null, direction: "asc" });

const sorted = computed(() => {
  // Your code here.
  return props.rows;
});
</script>

<template>
  <table class="data-table">
    <thead>
      <tr><th v-for="c in columns" :key="c.key" scope="col">{{ c.label }}</th></tr>
    </thead>
    <tbody>
      <tr v-for="row in sorted" :key="row.id">
        <td v-for="c in columns" :key="c.key">{{ row[c.key] }}</td>
      </tr>
    </tbody>
  </table>
</template>
