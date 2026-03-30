
<template>
  <SiteHeader :headerData="{ brandName: configData.config.name, theme: configData.config.theme }" :events="events" />
</template>

<script>
import { defineComponent } from 'vue';
import { useConfigStore } from '../state/config';
import SiteHeader from '../ui/organisms/SiteHeader/SiteHeader.component.vue'

export default defineComponent({
  components: {
    SiteHeader
  },
  props: [],
  setup() {
    const configData = useConfigStore();
    const events = {
      onThemeChangeClick: () => configData.updateConfig({ theme: configData.config.theme === "light" ? "dark" : "light" })
    };

    return {
      configData,
      events,
    }
  },
})
</script>