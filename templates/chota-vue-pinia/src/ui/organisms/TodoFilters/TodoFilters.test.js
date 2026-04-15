import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoFilters from './TodoFilters.component.vue'

describe('<TodoFilters />', () => {
  const filtersData = [
    { id: 'SHOW_ALL', label: 'All', selected: true },
    { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
    { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
  ]
  const events = { onTodoFilterUpdate: vi.fn() }

  it('renders successfully', () => {
    const wrapper = mount(TodoFilters, { props: { filtersData, events } })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders filter items', () => {
    const wrapper = mount(TodoFilters, { props: { filtersData, events } })
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Completed')
    expect(wrapper.text()).toContain('Active')
  })

  it('renders skeleton when isContentLoading is true', () => {
    const wrapper = mount(TodoFilters, {
      props: { filtersData: { isContentLoading: true }, events },
    })
    expect(wrapper.findAllComponents({ name: 'Skeleton' }).length).toBe(3)
  })

  it('renders FilterGroup when isContentLoading is false', () => {
    const wrapper = mount(TodoFilters, { props: { filtersData, events } })
    expect(wrapper.findComponent({ name: 'FilterGroup' }).exists()).toBe(true)
  })

  it('emits onFilterClick through FilterGroup', async () => {
    const wrapper = mount(TodoFilters, { props: { filtersData, events } })
    const filterGroup = wrapper.findComponent({ name: 'FilterGroup' })
    await filterGroup.vm.$emit('onFilterClick', 'SHOW_ALL')
    expect(events.onTodoFilterUpdate).toHaveBeenCalledWith('SHOW_ALL')
  })
})
