<template>
  <input :id="id" :name="name" :type="type || 'text'" :disabled="disabled" :alt="alt" :placeholder="placeholder"
    :class="getImageClass()"  @click="$emit('onClick', $event)" @input="$emit('onInput', $event)" :value="value" :checked="checked"  />
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({

  props: ['id', 'name', 'type', 'value', 'disabled', 'placeholder', 'alt', 'class', 'onInput', 'onClick', 'checked'],
  methods: {
    getImageClass() {
      return `${this.class}`;
    }
  },
})
</script>

<style scoped src="./Input.style.css"></style>
