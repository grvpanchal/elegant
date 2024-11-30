import { createPinia } from 'pinia'
import { createApp } from 'vue'
import * as Vue from 'vue'
import App from './App.vue'
import './ui/theme.css';


const app = createApp(App);
app.use(createPinia()).mount('#app');

const theme = Vue.observable({ theme: '' })

Object.defineProperty(Vue.prototype, '$theme', {
  get () {
    return theme.theme
  },
  set (value) {
    theme.theme = value
  }
})
