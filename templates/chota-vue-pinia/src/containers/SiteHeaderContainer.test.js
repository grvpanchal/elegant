import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import SiteHeaderContainer from './SiteHeaderContainer.vue'

vi.mock('../state/config', () => ({
  useConfigStore: () => ({
    config: { name: 'Todo App', lang: 'en', theme: 'light', themeMode: 'light' },
    updateConfig: vi.fn(),
  }),
}))

describe('<SiteHeaderContainer />', () => {
  it('renders successfully', () => {
    const wrapper = shallowMount(SiteHeaderContainer)
    expect(wrapper.exists()).toBe(true)
  })

  it('passes headerData to SiteHeader', () => {
    const wrapper = shallowMount(SiteHeaderContainer)
    const siteHeader = wrapper.findComponent({ name: 'SiteHeader' })
    expect(siteHeader.exists()).toBe(true)
    expect(siteHeader.props('headerData').brandName).toBe('Todo App')
  })
})
