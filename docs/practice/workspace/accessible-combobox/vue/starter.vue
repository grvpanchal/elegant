<script setup>
import { ref, computed } from "vue";

// Combobox.
// - typing filters `options` and opens the listbox
// - ArrowDown / ArrowUp move the active option and wrap
// - Enter selects, Escape closes without clearing the query
// - the input is role="combobox" with aria-expanded, aria-controls and
//   aria-activedescendant pointing at the active option's id
const props = defineProps({ options: { type: Array, default: () => [] } });
defineEmits(["select"]);

const query = ref("");
const open = ref(false);
const active = ref(-1);
</script>

<template>
  <!-- Your code here. -->
  <input v-model="query" />
</template>
