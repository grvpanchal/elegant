<template>
  <div v-if="showAlert" :class="getVariantClass()">
    <div class="message">
      <Image :src="getImageSrc()" alt="variant" />
      <span>{{ message }}</span>
    </div>
    <div>
      <IconButton variant="clear" alt="close" color="ffffff" iconName="x" size="16" @onClick="handleClose" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Image from "../Image/Image.component.vue";
import IconButton from "../IconButton/IconButton.component.vue";

export default defineComponent({
  components: { Image, IconButton },
  props: ['show', 'message', 'variant', 'onCloseClick'],
  data() {
    return {
      showAlert: true,
    }
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.showAlert = newVal;
      }
    }
  },
  methods: {
    handleClose(e) {
      this.showAlert = false;
      if (this.onCloseClick) {
        this.onCloseClick(e);
      }
    },
    getImageSrc() {
      return `https://icongr.am/feather/${this.variant === "error" ? "alert-triangle" : "info"}.svg?size=24&color=ffffff`;
    },
    getVariant() {
      return this.variant === 'error' ? 'error' : 'primary';
    },
    getVariantClass() {
      return `bg-${this.getVariant()} text-white alert`;
    }
  }
});
</script>

<style scoped src="./Alert.style.css"></style>