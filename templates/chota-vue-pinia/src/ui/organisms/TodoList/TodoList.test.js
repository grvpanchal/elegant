import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from './TodoList.component.vue'

describe('<TodoList />', () => {
  const defaultTodoData = {
    isLoading: false,
    isActionLoading: false,
    isContentLoading: false,
    error: '',
    todoItems: [{ id: 1, text: 'Todo 1', completed: false }],
    currentTodoItem: { text: '', id: '' },
  }
  const defaultEvents = {
    onTodoCreate: vi.fn(),
    onTodoEdit: vi.fn(),
    onTodoUpdate: vi.fn(),
    onTodoToggleUpdate: vi.fn(),
    onTodoDelete: vi.fn(),
  }

  it('renders successfully', () => {
    const wrapper = mount(TodoList, {
      props: { todoData: defaultTodoData, events: defaultEvents },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders todo items', () => {
    const wrapper = mount(TodoList, {
      props: { todoData: defaultTodoData, events: defaultEvents },
    })
    expect(wrapper.text()).toContain('Todo 1')
  })

  it('renders Alert when there is an error', () => {
    const wrapper = mount(TodoList, {
      props: { todoData: { ...defaultTodoData, error: 'Error occurred' }, events: defaultEvents },
    })
    expect(wrapper.findComponent({ name: 'Alert' }).exists()).toBe(true)
  })

  it('does not render Alert when there is no error', () => {
    const wrapper = mount(TodoList, {
      props: { todoData: defaultTodoData, events: defaultEvents },
    })
    expect(wrapper.findComponent({ name: 'Alert' }).exists()).toBe(false)
  })

  it('renders Skeleton when isContentLoading is true', () => {
    const wrapper = mount(TodoList, {
      props: { todoData: { ...defaultTodoData, isContentLoading: true }, events: defaultEvents },
    })
    expect(wrapper.findAllComponents({ name: 'Skeleton' }).length).toBe(3)
  })

  it('renders TodoItems when isContentLoading is false', () => {
    const wrapper = mount(TodoList, {
      props: { todoData: defaultTodoData, events: defaultEvents },
    })
    expect(wrapper.findComponent({ name: 'TodoItems' }).exists()).toBe(true)
  })

  it('shows "Add" button label when currentTodoItem.text is empty', () => {
    const wrapper = mount(TodoList, {
      props: { todoData: defaultTodoData, events: defaultEvents },
    })
    const addTodoForm = wrapper.findComponent({ name: 'AddTodoForm' })
    expect(addTodoForm.props('buttonInfo').label).toContain('Add')
  })

  it('shows "Save" button label when currentTodoItem.text has value', () => {
    const wrapper = mount(TodoList, {
      props: {
        todoData: { ...defaultTodoData, currentTodoItem: { text: 'Editing', id: 1 } },
        events: defaultEvents,
      },
    })
    const addTodoForm = wrapper.findComponent({ name: 'AddTodoForm' })
    expect(addTodoForm.props('buttonInfo').label).toContain('Save')
  })

  it('handles empty todoItems', () => {
    const wrapper = mount(TodoList, {
      props: {
        todoData: { ...defaultTodoData, todoItems: [] },
        events: defaultEvents,
      },
    })
    expect(wrapper.text()).toContain('Nothing to display here. Carry on.')
  })

  it('handles undefined todoItems gracefully', () => {
    const wrapper = mount(TodoList, {
      props: {
        todoData: { ...defaultTodoData, todoItems: undefined },
        events: defaultEvents,
      },
    })
    expect(wrapper.text()).toContain('Nothing to display here. Carry on.')
  })
})
