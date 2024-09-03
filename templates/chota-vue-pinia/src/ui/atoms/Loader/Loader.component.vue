<template>
  <span class="loader" :style="getLoaderStyle()"></span>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: ['size', 'width', 'color'],
  methods: {
    getLoaderStyle() {
      return `
      height: ${this.size || '48px'};
        width: ${this.size || '48px'};
        border: ${this.width || '5px'} solid ${this.color || '#fff'};
        border-bottom-color: transparent;
      `;
    }
  },
})
</script>

<style scoped src="./Loader.style.css">

</style>