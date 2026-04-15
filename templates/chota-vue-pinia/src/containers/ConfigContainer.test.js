import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import ConfigContainer from './ConfigContainer.vue'

vi.mock('../state/config', () => ({
  useConfigStore: () => ({
    config: { name: 'Todo App', lang: 'en', theme: 'light', themeMode: 'light' },
    theme: 'light',
  }),
}))

describe('<ConfigContainer />', () => {
  beforeEach(() => {
    document.body.classList.remove('dark')
  })

  it('renders successfully', () => {
    const wrapper = shallowMount(ConfigContainer)
    expect(wrapper.exists()).toBe(true)
  })

  it('returns empty template', () => {
    const wrapper = mount(ConfigContainer)
    expect(wrapper.html()).toBe('')
  })
})
