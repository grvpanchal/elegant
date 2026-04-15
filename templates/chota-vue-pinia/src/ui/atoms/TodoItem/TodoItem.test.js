import { describe, it, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import TodoItem from './TodoItem.component.vue'

describe('<TodoItem />', () => {
  const defaultProps = {
    id: 1,
    text: 'Test todo',
    completed: false,
  }

  it('renders successfully', () => {
    const wrapper = shallowMount(TodoItem, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the todo text', () => {
    const wrapper = mount(TodoItem, { props: defaultProps })
    expect(wrapper.text()).toContain('Test todo')
  })

  it('applies line-through when completed', () => {
    const wrapper = shallowMount(TodoItem, { props: { ...defaultProps, completed: true } })
    const style = wrapper.vm.getTodoItemStyle()
    expect(style).toContain('line-through')
  })

  it('does not apply line-through when not completed', () => {
    const wrapper = shallowMount(TodoItem, { props: { ...defaultProps, completed: false } })
    const style = wrapper.vm.getTodoItemStyle()
    expect(style).toContain('none')
  })

  it('emits onToggleClick when checkbox is toggled', async () => {
    const wrapper = shallowMount(TodoItem, { props: defaultProps })
    const input = wrapper.findComponent({ name: 'Input' })
    await input.vm.$emit('onInput')
    expect(wrapper.emitted('onToggleClick')).toBeTruthy()
  })

  it('emits onEditClick when edit is clicked', async () => {
    const wrapper = shallowMount(TodoItem, { props: defaultProps })
    const iconButtons = wrapper.findAllComponents({ name: 'IconButton' })
    await iconButtons[0].vm.$emit('onClick')
    expect(wrapper.emitted('onEditClick')).toBeTruthy()
  })

  it('emits onDeleteClick when delete is clicked', async () => {
    const wrapper = shallowMount(TodoItem, { props: defaultProps })
    const iconButtons = wrapper.findAllComponents({ name: 'IconButton' })
    await iconButtons[1].vm.$emit('onClick')
    expect(wrapper.emitted('onDeleteClick')).toBeTruthy()
  })

  it('generates correct input id', () => {
    const wrapper = shallowMount(TodoItem, { props: { ...defaultProps, id: 5 } })
    expect(wrapper.vm.getInputId()).toBe('checkbox5')
  })
})
