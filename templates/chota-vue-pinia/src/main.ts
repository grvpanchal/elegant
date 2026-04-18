import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './ui/theme.css'

const themeState = reactive({ theme: '' })

const app = createApp(App)

Object.defineProperty(app.config.globalProperties, '$theme', {
  get() {
    return themeState.theme
  },
  set(value: string) {
    themeState.theme = value
  },
})

app.use(createPinia()).mount('#app')
