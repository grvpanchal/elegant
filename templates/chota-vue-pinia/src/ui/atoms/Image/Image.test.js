import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Image from './Image.component.vue'

describe('<Image />', () => {
  it('renders successfully', () => {
    const wrapper = mount(Image)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders an img element', () => {
    const wrapper = mount(Image)
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('renders with alt and src', () => {
    const wrapper = mount(Image, {
      props: { alt: 'Test image', src: 'test.jpg' },
    })
    expect(wrapper.find('img').attributes('alt')).toBe('Test image')
    expect(wrapper.find('img').attributes('src')).toBe('test.jpg')
  })

  it('applies custom class', () => {
    const wrapper = mount(Image, {
      props: { class: 'custom-img', src: 'test.jpg' },
    })
    expect(wrapper.vm.getImageClass()).toBe('custom-img')
  })
})
