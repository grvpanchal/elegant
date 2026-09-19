<script setup>
import { ref, computed } from "vue";

// Tabs molecule.
// - roving tabindex: exactly one tab has tabindex="0" (the selected one)
// - ArrowLeft/ArrowRight wrap; Home/End jump to first/last
// - role=tablist / role=tab / role=tabpanel, aria-selected, aria-controls,
//   aria-labelledby, and `hidden` on the panels that are not shown
// - the visible panel needs tabindex="0" so Tab reaches its content
const props = defineProps({ tabs: { type: Array, required: true } }); // [{ id, label }]
const selected = ref(0);
</script>

<template>
  <!-- Your code here. -->
  <div role="tablist">
    <button v-for="(tab, i) in tabs" :key="tab.id" role="tab">{{ tab.label }}</button>
  </div>
</template>
