import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import FilterGroup from './FilterGroup.component.vue'

describe('<FilterGroup />', () => {
  const filterItems = [
    { id: 'SHOW_ALL', label: 'All', selected: true },
    { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
    { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
  ]

  it('renders successfully', () => {
    const wrapper = shallowMount(FilterGroup, { props: { filterItems } })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders all filter items', () => {
    const wrapper = mount(FilterGroup, { props: { filterItems } })
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Completed')
    expect(wrapper.text()).toContain('Active')
  })

  it('renders with empty filterItems', () => {
    const wrapper = shallowMount(FilterGroup, { props: { filterItems: [] } })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits onFilterClick when a filter is clicked', async () => {
    const wrapper = shallowMount(FilterGroup, { props: { filterItems } })
    const links = wrapper.findAllComponents({ name: 'Link' })
    await links[1].vm.$emit('onClick')
    expect(wrapper.emitted('onFilterClick')).toBeTruthy()
    expect(wrapper.emitted('onFilterClick')[0]).toEqual(['SHOW_COMPLETED'])
  })

  it('renders with role="group"', () => {
    const wrapper = mount(FilterGroup, { props: { filterItems } })
    expect(wrapper.find('[role="group"]').exists()).toBe(true)
  })
})
