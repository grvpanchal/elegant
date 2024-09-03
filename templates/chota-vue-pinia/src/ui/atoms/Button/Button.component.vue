<template>
    <button  v-if="isLoading" :disabled="disabled" @click="$emit('onClick')" :class="getButtonClass()">
      <Loader width="2px" size="1.2rem" color="#fff" />
    </button>
    <button  v-else :disabled="disabled" :type="type" @click="$emit('onClick')" :class="getButtonClass()"><slot /></button>
</template>
<script>
import { defineComponent } from 'vue'
import Loader from '../Loader/Loader.component.vue';

export default defineComponent({
  components: {
    Loader
  },
  props: ['isLoading', 'class', 'disabled', 'onClick', 'label', 'type'],
  methods: {
    getButtonClass() {
      return `${this.class} loading-button`;
    }
  },
})
</script>

<style scoped src="./Button.style.css"></style>
