import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteHeader from './SiteHeader.component.vue'

describe('<SiteHeader />', () => {
  const headerData = { brandName: 'My Todo App', theme: 'light' }
  const events = { onThemeChangeClick: vi.fn() }

  it('renders successfully', () => {
    const wrapper = mount(SiteHeader, { props: { headerData, events } })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the brand name', () => {
    const wrapper = mount(SiteHeader, { props: { headerData, events } })
    expect(wrapper.text()).toContain('My Todo App')
  })

  it('displays moon icon for light theme', () => {
    const wrapper = mount(SiteHeader, { props: { headerData, events } })
    expect(wrapper.text()).toContain('🌙')
  })

  it('displays sun icon for dark theme', () => {
    const wrapper = mount(SiteHeader, { props: { headerData: { ...headerData, theme: 'dark' }, events } })
    expect(wrapper.text()).toContain('☀️')
  })

  it('calls onThemeChangeClick when theme toggle is clicked', async () => {
    const wrapper = mount(SiteHeader, { props: { headerData, events } })
    await wrapper.find('[role="button"]').trigger('click')
    expect(events.onThemeChangeClick).toHaveBeenCalled()
  })

  it('updateTheme sets theme correctly for light theme', async () => {
    const wrapper = mount(SiteHeader, { props: { headerData, events } })
    await wrapper.vm.updateTheme()
    expect(wrapper.vm.$theme).toBe('light')
  })

  it('updateTheme sets theme correctly for dark theme', async () => {
    const wrapper = mount(SiteHeader, { props: { headerData: { ...headerData, theme: 'dark' }, events } })
    await wrapper.vm.updateTheme()
    expect(wrapper.vm.$theme).toBe('dark')
  })

  it('renders with header class', () => {
    const wrapper = mount(SiteHeader, { props: { headerData, events } })
    expect(wrapper.find('header').classes()).toContain('header')
  })
})
