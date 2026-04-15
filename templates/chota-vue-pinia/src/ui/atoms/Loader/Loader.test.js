import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Loader from './Loader.component.vue'

describe('<Loader />', () => {
  it('renders successfully', () => {
    const wrapper = mount(Loader)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a span with loader class', () => {
    const wrapper = mount(Loader)
    expect(wrapper.find('span').classes()).toContain('loader')
  })

  it('applies default styles', () => {
    const wrapper = mount(Loader)
    const style = wrapper.vm.getLoaderStyle()
    expect(style).toContain('48px')
  })

  it('applies custom size', () => {
    const wrapper = mount(Loader, { props: { size: '24px' } })
    const style = wrapper.vm.getLoaderStyle()
    expect(style).toContain('24px')
  })

  it('applies custom width', () => {
    const wrapper = mount(Loader, { props: { width: '3px' } })
    const style = wrapper.vm.getLoaderStyle()
    expect(style).toContain('3px')
  })

  it('applies custom color', () => {
    const wrapper = mount(Loader, { props: { color: '#000' } })
    const style = wrapper.vm.getLoaderStyle()
    expect(style).toContain('#000')
  })
})
