import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Layout from './Layout.component.vue'

describe('<Layout />', () => {
  it('renders successfully', () => {
    const wrapper = mount(Layout)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders children', () => {
    const wrapper = mount(Layout, {
      slots: { default: '<div>Child Content</div>' },
    })
    expect(wrapper.text()).toContain('Child Content')
  })

  it('renders with container and layout classes', () => {
    const wrapper = mount(Layout)
    expect(wrapper.find('div').classes()).toContain('container')
    expect(wrapper.find('div').classes()).toContain('layout')
  })

  it('renders multiple children', () => {
    const wrapper = mount(Layout, {
      slots: { default: '<div>First</div><div>Second</div>' },
    })
    expect(wrapper.text()).toContain('First')
    expect(wrapper.text()).toContain('Second')
  })
})
