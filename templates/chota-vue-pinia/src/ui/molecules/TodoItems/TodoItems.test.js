import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItems from './TodoItems.component.vue'

describe('<TodoItems />', () => {
  const todos = [
    { id: 1, text: 'First todo', completed: false },
    { id: 2, text: 'Second todo', completed: true },
  ]

  it('renders successfully', () => {
    const wrapper = mount(TodoItems, { props: { todos } })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders all todo items', () => {
    const wrapper = mount(TodoItems, { props: { todos } })
    expect(wrapper.text()).toContain('First todo')
    expect(wrapper.text()).toContain('Second todo')
  })

  it('shows empty message when todos is empty', () => {
    const wrapper = mount(TodoItems, { props: { todos: [] } })
    expect(wrapper.text()).toContain('Nothing to display here. Carry on.')
  })

  it('shows empty message when todos is undefined', () => {
    const wrapper = mount(TodoItems, { props: { todos: undefined } })
    expect(wrapper.text()).toContain('Nothing to display here. Carry on.')
  })

  it('shows empty message when todos is null', () => {
    const wrapper = mount(TodoItems, { props: { todos: null } })
    expect(wrapper.text()).toContain('Nothing to display here. Carry on.')
  })

  it('emits onToggleClick with correct todo', async () => {
    const wrapper = mount(TodoItems, { props: { todos } })
    const todoItems = wrapper.findAllComponents({ name: 'TodoItem' })
    await todoItems[0].vm.$emit('onToggleClick')
    expect(wrapper.emitted('onToggleClick')).toBeTruthy()
    expect(wrapper.emitted('onToggleClick')[0]).toEqual([todos[0]])
  })

  it('emits onEditClick with correct todo', async () => {
    const wrapper = mount(TodoItems, { props: { todos } })
    const todoItems = wrapper.findAllComponents({ name: 'TodoItem' })
    await todoItems[0].vm.$emit('onEditClick')
    expect(wrapper.emitted('onEditClick')).toBeTruthy()
    expect(wrapper.emitted('onEditClick')[0]).toEqual([todos[0]])
  })

  it('emits onDeleteClick with correct id', async () => {
    const wrapper = mount(TodoItems, { props: { todos } })
    const todoItems = wrapper.findAllComponents({ name: 'TodoItem' })
    await todoItems[0].vm.$emit('onDeleteClick')
    expect(wrapper.emitted('onDeleteClick')).toBeTruthy()
    expect(wrapper.emitted('onDeleteClick')[0]).toEqual([todos[0].id])
  })
})
