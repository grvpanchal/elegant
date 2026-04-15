import { describe, it, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import TodoFiltersContainer from './TodoFiltersContainer.vue'

vi.mock('../state/filters', () => ({
  useFiltersStore: () => ({
    filters: [
      { id: 'SHOW_ALL', label: 'All', selected: true },
      { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
      { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
    ],
    setVisibilityFilter: vi.fn(),
  }),
}))

describe('<TodoFiltersContainer />', () => {
  it('renders successfully', () => {
    const wrapper = shallowMount(TodoFiltersContainer)
    expect(wrapper.exists()).toBe(true)
  })

  it('passes filtersData to TodoFilters', () => {
    const wrapper = shallowMount(TodoFiltersContainer)
    const todoFilters = wrapper.findComponent({ name: 'TodoFilters' })
    expect(todoFilters.exists()).toBe(true)
  })
})
