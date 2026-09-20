<script setup>
// Image.
// Emit srcset over WIDTHS, pass `sizes` through, reserve the box from
// width/height, lazy-load unless `priority`, and require `alt`.
const WIDTHS = [400, 800, 1200, 2400];

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  sizes: { type: String, default: "100vw" },
  priority: { type: Boolean, default: false },
});
</script>

<template>
  <!-- Your code here. -->
  <img :src="src" :alt="alt" :width="width" :height="height" />
</template>
