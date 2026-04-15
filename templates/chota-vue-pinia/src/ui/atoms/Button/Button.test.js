import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.component.vue'

describe('<Button />', () => {
  it('renders successfully', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Hello' },
    })
    expect(wrapper.text()).toContain('Hello')
  })

  it('renders as loading button when isLoading is true', () => {
    const wrapper = mount(Button, {
      props: { isLoading: true },
      slots: { default: 'Loading' },
    })
    expect(wrapper.find('button').classes()).toContain('loading-button')
  })

  it('renders button with type prop', () => {
    const wrapper = mount(Button, {
      props: { isLoading: false, type: 'submit' },
      slots: { default: 'Submit' },
    })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
    expect(wrapper.text()).toContain('Submit')
  })

  it('emits onClick event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click' },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('onClick')).toBeTruthy()
  })

  it('passes disabled prop', () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('getButtonClass returns correct class', () => {
    const wrapper = mount(Button, {
      props: { class: 'custom-class' },
      slots: { default: 'Click' },
    })
    expect(wrapper.vm.getButtonClass()).toBe('custom-class loading-button')
  })

  it('renders Loader component when isLoading is true', () => {
    const wrapper = mount(Button, {
      props: { isLoading: true },
      slots: { default: 'Loading' },
    })
    expect(wrapper.findComponent({ name: 'Loader' }).exists()).toBe(true)
  })

  it('renders button without type attribute when type is not provided', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click' },
    })
    expect(wrapper.find('button').attributes('type')).toBeUndefined()
  })

  it('renders loading button with disabled state', () => {
    const wrapper = mount(Button, {
      props: { isLoading: true, disabled: true },
      slots: { default: 'Loading' },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').classes()).toContain('loading-button')
  })

  it('getButtonClass handles undefined class prop', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click' },
    })
    expect(wrapper.vm.getButtonClass()).toBe('undefined loading-button')
  })

  it('renders with isLoading explicitly false', () => {
    const wrapper = mount(Button, {
      props: { isLoading: false },
      slots: { default: 'Click' },
    })
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toContain('Click')
  })

  it('triggers click event on loading button', async () => {
    const wrapper = mount(Button, {
      props: { isLoading: true },
      slots: { default: 'Loading' },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('onClick')).toBeTruthy()
  })

  it('triggers click event on normal button', async () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click' },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('onClick')).toBeTruthy()
  })
})
