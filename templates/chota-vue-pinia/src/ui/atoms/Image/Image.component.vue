<template>
  <img :alt="alt" :src="src" :class="getImageClass()" />
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({

  props: ['alt', 'class', 'src'],
  methods: {
    getImageClass() {
      return `${this.class}`;
    }
  },
})
</script>

<style scoped src="./Image.style.css"></style>
