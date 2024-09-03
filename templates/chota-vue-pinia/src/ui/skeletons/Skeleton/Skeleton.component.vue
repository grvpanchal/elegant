<template>
  <div :class="getSkeletonClass()" :style="getSkeletonStyle()"></div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['variant', 'height', 'width', 'style'],
  methods: {
    getSkeletonStyle() {
      return `
      height: ${this.height};
      width: ${this.width};
      `;
    },
    getSkeletonClass() {
      return `skeleton skeleton-${this.variant ? this.variant : 'text'}`;
    }
  }
})
</script>

<style scoped src="./Skeleton.style.css"></style>
