<script setup>
import { ref } from "vue";

// ToastStack.
// - notify({ message, tone }) adds a toast; newest nearest the corner
// - non-error toasts dismiss after 5000ms; error toasts never auto-dismiss
// - the timer pauses on pointerenter AND focusin, and resumes on leave
// - polite announcements go in an aria-live="polite" region that already exists;
//   errors go in a role="alert" region. Focus must never move to a toast.
const props = defineProps({ toasts: { type: Array, default: () => [] } });
defineEmits(["dismiss"]);

const paused = ref(new Set());
</script>

<template>
  <!-- Your code here. The two live regions must render even when empty. -->
  <div class="toast-stack"></div>
</template>
