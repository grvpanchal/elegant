import { defineStore, acceptHMRUpdate } from 'pinia'
import { updateConfig } from './config.actions'
import intialConfigState from './config.initial'
import { getTheme } from './config.selectors'

export const useConfigStore = defineStore({
  id: 'config',
  state: () => (intialConfigState),
  getters: {
    theme: getTheme,
  },
  actions: {
    updateConfig
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
