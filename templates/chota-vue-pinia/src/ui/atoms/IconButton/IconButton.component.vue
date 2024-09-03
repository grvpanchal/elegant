<template>
  <Button :class="getIconButtonClass()" @onClick="onClick">
    <Image :alt="alt" :src="getImageSrc()" />
  </Button>
</template>

<script>
import { defineComponent } from 'vue'
import Button from '../Button/Button.component.vue';
import Image from '../Image/Image.component.vue';

export default defineComponent({
  components: { Button, Image },
  props: ['iconName', 'alt', 'variant', 'size', 'color', 'onClick'],
  data() {
    return {
      themeColor: this.$theme,
    }
  },
  methods: {
    getIconButtonClass() {
      return `button icon-only ${this.variant}`;
    },
    getImageSrc() {
      return `https://icongr.am/feather/${this.iconName}.svg?size=${this.size}&color=${this.color ? this.color : this.themeColor}`;
    }
  },
  watch: {
    '$theme'() {
      console.log('this.$theme', this.$theme);
      this.themeColor = this.$theme === "dark" ? "ffffff" : "000000";
    }
  }
})
</script>

<style scoped src="./IconButton.style.css"></style>
