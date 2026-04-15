import { describe, it, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Alert from './Alert.component.vue'

describe('<Alert />', () => {
  it('renders successfully with error variant', () => {
    const wrapper = shallowMount(Alert, {
      props: { show: true, variant: 'error', message: 'Error message' },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Error message')
  })

  it('renders with info variant when no variant specified', () => {
    const wrapper = shallowMount(Alert, {
      props: { show: true, message: 'Info message' },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Info message')
  })

  it('does not render alert div when show prop changes to false', async () => {
    const wrapper = shallowMount(Alert, {
      props: { show: true, variant: 'error', message: 'Hidden' },
    })
    expect(wrapper.vm.showAlert).toBe(true)
    await wrapper.setProps({ show: false })
    expect(wrapper.vm.showAlert).toBe(false)
  })

  it('closes when close button is clicked', async () => {
    const wrapper = shallowMount(Alert, {
      props: { show: true, variant: 'error', message: 'Test' },
    })
    await wrapper.vm.handleClose({})
    expect(wrapper.vm.showAlert).toBe(false)
  })

  it('calls onCloseClick when provided', async () => {
    const onCloseClick = vi.fn()
    const wrapper = shallowMount(Alert, {
      props: { show: true, variant: 'error', message: 'Test', onCloseClick },
    })
    await wrapper.vm.handleClose({})
    expect(onCloseClick).toHaveBeenCalled()
  })

  it('watches show prop and updates showAlert', async () => {
    const wrapper = shallowMount(Alert, {
      props: { show: true, variant: 'error', message: 'Test' },
    })
    await wrapper.setProps({ show: false })
    expect(wrapper.vm.showAlert).toBe(false)
  })

  it('returns correct image src for error variant', () => {
    const wrapper = shallowMount(Alert, {
      props: { show: true, variant: 'error', message: 'Test' },
    })
    const src = wrapper.vm.getImageSrc()
    expect(src).toContain('alert-triangle')
  })

  it('returns correct image src for info variant', () => {
    const wrapper = shallowMount(Alert, {
      props: { show: true, message: 'Test' },
    })
    const src = wrapper.vm.getImageSrc()
    expect(src).toContain('info')
  })

  it('returns correct variant class for error', () => {
    const wrapper = shallowMount(Alert, {
      props: { show: true, variant: 'error', message: 'Test' },
    })
    expect(wrapper.vm.getVariantClass()).toBe('bg-error text-white alert')
  })

  it('returns correct variant class for primary', () => {
    const wrapper = shallowMount(Alert, {
      props: { show: true, message: 'Test' },
    })
    expect(wrapper.vm.getVariantClass()).toBe('bg-primary text-white alert')
  })
})
