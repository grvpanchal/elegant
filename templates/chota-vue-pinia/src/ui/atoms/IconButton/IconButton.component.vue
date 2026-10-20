<template>
  <Button :class="getIconButtonClass()" @onClick="onClick">
    <Image :alt="alt" :src="getImageSrc()" />
  </Button>
</template>

<script>
import { defineComponent } from 'vue'
import Button from '../Button/Button.component.vue';
import Image from '../Image/Image.component.vue';
import { iconSrc } from '../../../utils/icons';

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
      return iconSrc(this.iconName, this.size, this.color ? this.color : this.themeColor);
    }
  },
  watch: {
    /* istanbul ignore next */
    '$theme'() {
      console.log('this.$theme', this.$theme);
      this.themeColor = this.$theme === "dark" ? "ffffff" : "000000";
    }
  }
})
</script>

<style scoped src="./IconButton.style.css"></style>
