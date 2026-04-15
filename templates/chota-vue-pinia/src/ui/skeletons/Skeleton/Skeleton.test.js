import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from './Skeleton.component.vue'

describe('<Skeleton />', () => {
  it('renders successfully', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with default variant "text"', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.vm.getSkeletonClass()).toContain('skeleton-text')
  })

  it('renders with custom variant', () => {
    const wrapper = mount(Skeleton, { props: { variant: 'circle' } })
    expect(wrapper.vm.getSkeletonClass()).toContain('skeleton-circle')
  })

  it('renders with height prop', () => {
    const wrapper = mount(Skeleton, { props: { height: '24px' } })
    const style = wrapper.vm.getSkeletonStyle()
    expect(style).toContain('24px')
  })

  it('renders with width prop', () => {
    const wrapper = mount(Skeleton, { props: { width: '100px' } })
    const style = wrapper.vm.getSkeletonStyle()
    expect(style).toContain('100px')
  })
})
