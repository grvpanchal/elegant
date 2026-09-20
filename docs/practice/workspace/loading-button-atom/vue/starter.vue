<script setup>
import Loader from "../Loader/Loader.component.vue";

// Button atom.
// - the default slot renders as the label
// - isLoading swaps the slot for <Loader />, disables the button and sets aria-busy
// - every other attribute falls through to <button>
defineProps({ isLoading: { type: Boolean, default: false } });
</script>

<template>
  <!-- Your code here. -->
  <button v-bind="$attrs"><slot /></button>
</template>
