import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useConfigStore } from './index'
import { getTheme } from './config.selectors'

describe('config store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default config', () => {
    const store = useConfigStore()
    expect(store.config.name).toBe('Todo App')
    expect(store.config.lang).toBe('en')
    expect(store.config.theme).toBe('light')
  })

  describe('updateConfig', () => {
    it('updates theme', () => {
      const store = useConfigStore()
      store.updateConfig({ theme: 'dark' })
      expect(store.config.theme).toBe('dark')
    })
  })
})

describe('config selectors', () => {
  it('returns the theme', () => {
    const state = { config: { theme: 'dark' } }
    expect(getTheme(state)).toBe('dark')
  })
})
