<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// InfiniteList.
// - an IntersectionObserver on a sentinel, with rootMargin so loading starts early
// - exactly ONE request in flight: guard with a plain variable, not a ref you render
// - a failed page keeps the items already loaded and offers a retry
// - when there is no next cursor, say so and stop observing
// - announce new rows politely; aria-busy on the list while loading
const props = defineProps({ fetchPage: { type: Function, required: true } });

const items = ref([]);
const status = ref("idle");
const done = ref(false);
const sentinel = ref(null);

async function loadMore() {
  // Your code here.
}
</script>

<template>
  <div class="infinite-list">
    <ul><li v-for="item in items" :key="item.id">{{ item.label }}</li></ul>
    <div ref="sentinel"></div>
  </div>
</template>
