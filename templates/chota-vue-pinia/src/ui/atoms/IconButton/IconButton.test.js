import { describe, it, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import IconButton from './IconButton.component.vue'

describe('<IconButton />', () => {
  it('renders successfully', () => {
    const wrapper = shallowMount(IconButton, {
      props: { iconName: 'edit', alt: 'edit', size: '16' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('applies variant class', () => {
    const wrapper = shallowMount(IconButton, {
      props: { iconName: 'x', alt: 'close', size: '16', variant: 'clear' },
    })
    expect(wrapper.vm.getIconButtonClass()).toContain('clear')
  })

  it('generates correct image src', () => {
    const wrapper = shallowMount(IconButton, {
      props: { iconName: 'trash-2', alt: 'delete', size: '24' },
    })
    const src = wrapper.vm.getImageSrc()
    expect(src).toContain('trash-2')
    expect(src).toContain('size=24')
  })

  it('generates image src with custom color', () => {
    const wrapper = shallowMount(IconButton, {
      props: { iconName: 'edit', alt: 'edit', size: '16', color: 'ff0000' },
    })
    const src = wrapper.vm.getImageSrc()
    expect(src).toContain('color=ff0000')
  })

  it('emits onClick when clicked', async () => {
    const wrapper = mount(IconButton, {
      props: { iconName: 'edit', alt: 'edit', size: '16' },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
