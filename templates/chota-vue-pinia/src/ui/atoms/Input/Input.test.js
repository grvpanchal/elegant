import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.component.vue'

describe('<Input />', () => {
  it('renders successfully', () => {
    const wrapper = mount(Input)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders an input element', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('applies props correctly', () => {
    const wrapper = mount(Input, {
      props: { id: 'test-id', name: 'test-name', type: 'text', placeholder: 'Enter text' },
    })
    expect(wrapper.find('input').attributes('id')).toBe('test-id')
    expect(wrapper.find('input').attributes('name')).toBe('test-name')
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text')
  })

  it('emits onInput event when input changes', async () => {
    const wrapper = mount(Input)
    await wrapper.find('input').setValue('test')
    expect(wrapper.emitted('onInput')).toBeTruthy()
  })

  it('emits onClick event when clicked', async () => {
    const wrapper = mount(Input)
    await wrapper.find('input').trigger('click')
    expect(wrapper.emitted('onClick')).toBeTruthy()
  })

  it('applies disabled prop', () => {
    const wrapper = mount(Input, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies value prop', () => {
    const wrapper = mount(Input, { props: { value: 'test value' } })
    expect(wrapper.find('input').element.value).toBe('test value')
  })

  it('applies checked prop', () => {
    const wrapper = mount(Input, { props: { checked: true } })
    expect(wrapper.find('input').element.checked).toBe(true)
  })
})
