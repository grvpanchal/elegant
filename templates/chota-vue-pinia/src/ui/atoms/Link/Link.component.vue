<template>
  <a href="#" :class="getLinkClass()" :disabled="isActive" role="button" @click="handleClick">
    <slot />
  </a>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['isActive', 'class', 'onClick'],
  methods: {
    getLinkClass() {
      return `button ${this.isActive ? "primary" : "outline"}`;
    },
    handleClick(e) {
      e.preventDefault();
      console.log('asdasd');
      this.$emit('onClick');
    },
  },
})
</script>

<style scoped src="./Link.style.css"></style>
