import { describe, it, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import AddTodoForm from './AddTodoForm.component.vue'

describe('<AddTodoForm />', () => {
  const defaultProps = {
    buttonInfo: { label: 'Add', variant: 'primary' },
    placeholder: 'Add your task',
    isLoading: false,
    todoValue: '',
  }

  it('renders successfully', () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with default label', () => {
    const wrapper = shallowMount(AddTodoForm)
    expect(wrapper.vm.label).toBe('Add')
    expect(wrapper.vm.variant).toBe('primary')
  })

  it('updates label and variant when buttonInfo changes', async () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    await wrapper.setProps({ buttonInfo: { label: 'Save', variant: 'primary' } })
    expect(wrapper.vm.label).toBe('Save')
    expect(wrapper.vm.variant).toBe('primary')
  })

  it('emits onTodoAdd when form is submitted with text', async () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    wrapper.vm.inputValue = 'New todo'
    await wrapper.vm.onSubmit({ preventDefault: vi.fn() })
    expect(wrapper.emitted('onTodoAdd')).toBeTruthy()
    expect(wrapper.emitted('onTodoAdd')[0]).toEqual(['New todo'])
  })

  it('does not emit onTodoAdd when form is submitted with empty text', async () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    wrapper.vm.inputValue = ''
    await wrapper.vm.onSubmit({ preventDefault: vi.fn() })
    expect(wrapper.emitted('onTodoAdd')).toBeFalsy()
  })

  it('does not emit onTodoAdd when form is submitted with whitespace', async () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    wrapper.vm.inputValue = '   '
    await wrapper.vm.onSubmit({ preventDefault: vi.fn() })
    expect(wrapper.emitted('onTodoAdd')).toBeFalsy()
  })

  it('emits onTodoUpdate when todoValue is provided', async () => {
    const wrapper = shallowMount(AddTodoForm, {
      props: { ...defaultProps, todoValue: 'Existing' },
    })
    wrapper.vm.inputValue = 'Updated text'
    await wrapper.vm.onSubmit({ preventDefault: vi.fn() })
    expect(wrapper.emitted('onTodoUpdate')).toBeTruthy()
    expect(wrapper.emitted('onTodoUpdate')[0]).toEqual(['Updated text'])
  })

  it('clears input after submission', async () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    wrapper.vm.inputValue = 'New todo'
    await wrapper.vm.onSubmit({ preventDefault: vi.fn() })
    expect(wrapper.vm.inputValue).toBe('')
  })

  it('updates inputValue when todoValue changes', async () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    await wrapper.setProps({ todoValue: 'Updated' })
    expect(wrapper.vm.inputValue).toBe('Updated')
  })

  it('handleChange updates inputValue', async () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    wrapper.vm.handleChange({ target: { value: 'Test input' } })
    expect(wrapper.vm.inputValue).toBe('Test input')
  })

  it('getButtonClass returns correct class', () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    expect(wrapper.vm.getButtonClass()).toBe('button primary')
  })

  it('emits onTodoAdd when form is submitted via event', async () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    wrapper.vm.inputValue = 'New todo'
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('onTodoAdd')).toBeTruthy()
    expect(wrapper.emitted('onTodoAdd')[0]).toEqual(['New todo'])
  })

  it('does not emit when form is submitted with empty input via event', async () => {
    const wrapper = shallowMount(AddTodoForm, { props: defaultProps })
    wrapper.vm.inputValue = ''
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('onTodoAdd')).toBeFalsy()
    expect(wrapper.emitted('onTodoUpdate')).toBeFalsy()
  })
})
