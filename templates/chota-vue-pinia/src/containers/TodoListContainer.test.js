import { describe, it, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import TodoListContainer from './TodoListContainer.vue'

vi.mock('../state/filters', () => ({
  useFiltersStore: () => ({
    filters: [{ id: 'SHOW_ALL', label: 'All', selected: true }],
  }),
}))

vi.mock('../state/todo', () => ({
  useTodoStore: () => ({
    visibleTodos: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [{ id: 1, text: 'Test todo', completed: false }],
      currentTodoItem: { text: '', id: '' },
    },
    getTodos: vi.fn(),
    addTodos: vi.fn(),
    editTodo: vi.fn(),
    updateTodos: vi.fn(),
    updateToggleTodos: vi.fn(),
    deleteTodos: vi.fn(),
  }),
}))

describe('<TodoListContainer />', () => {
  it('renders successfully', () => {
    const wrapper = shallowMount(TodoListContainer)
    expect(wrapper.exists()).toBe(true)
  })

  it('passes todoData to TodoList', () => {
    const wrapper = shallowMount(TodoListContainer)
    const todoList = wrapper.findComponent({ name: 'TodoList' })
    expect(todoList.exists()).toBe(true)
  })
})
