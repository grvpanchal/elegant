import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Link from './Link.component.vue'

describe('<Link />', () => {
  it('renders successfully', () => {
    const wrapper = mount(Link, {
      slots: { default: 'Link text' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with primary class when isActive is true', () => {
    const wrapper = mount(Link, {
      props: { isActive: true },
      slots: { default: 'Active' },
    })
    expect(wrapper.vm.getLinkClass()).toContain('primary')
  })

  it('renders with outline class when isActive is false', () => {
    const wrapper = mount(Link, {
      props: { isActive: false },
      slots: { default: 'Inactive' },
    })
    expect(wrapper.vm.getLinkClass()).toContain('outline')
  })

  it('emits onClick when clicked', async () => {
    const wrapper = mount(Link, {
      slots: { default: 'Click me' },
    })
    await wrapper.find('a').trigger('click')
    expect(wrapper.emitted('onClick')).toBeTruthy()
  })

  it('renders slot content', () => {
    const wrapper = mount(Link, {
      slots: { default: 'Custom Content' },
    })
    expect(wrapper.text()).toContain('Custom Content')
  })
})
