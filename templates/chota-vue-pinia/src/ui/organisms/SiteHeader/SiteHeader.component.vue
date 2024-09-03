<template>
  <div>
    <br />
    <br />
    <div style="display: flex; justify-content: space-between">
      <div>
        <h1>{{ headerData.brandName }}</h1>
      </div>
      <div>
        <h1 role="button" @click="() => updateTheme()" className="text-right pointer">
          {{ headerData.theme === "dark" ? "☀️" : "🌙" }}
        </h1>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['headerData', 'events'],
  methods: {
    updateTheme() {
      this.events.onThemeChangeClick();
      this.$theme = this.headerData.theme === "dark" ? "dark" : "light";
      console.log('this.$theme', this.$theme);
    }
  }
})
</script>

<style scoped src="./SiteHeader.style.css"></style>