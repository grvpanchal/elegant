<template>
</template>

<script>
import { defineComponent } from 'vue';
import { useConfigStore } from '../state/config';

export default defineComponent({
  props: [],
  setup() {
    const configData = useConfigStore();
    return {
      configData,
      theme: configData.theme,
    }
  },
  watch: {
    'configData.config.theme': {
      /* istanbul ignore next */
      handler(newVal, oldVal) {
        const bodyClass = document.body.classList;
        if (newVal !== oldVal) {
          if (newVal === 'dark') {
            bodyClass.add("dark");
          } else {
            bodyClass.remove("dark");
          }
        }
      },
      deep: true
    }
  }
})
</script>