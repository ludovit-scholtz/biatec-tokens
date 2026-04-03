import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from '../Select.vue'

describe('Select.vue', () => {
  const stringOptions = ['Option A', 'Option B', 'Option C']
  const objectOptions = [
    { label: 'Label A', value: 'a' },
    { label: 'Label B', value: 'b' },
  ]

  it('renders a select element', () => {
    const wrapper = mount(Select, {
      props: { options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('renders string options', () => {
    const wrapper = mount(Select, {
      props: { options: stringOptions, modelValue: '' },
    })
    const opts = wrapper.findAll('option')
    expect(opts.length).toBe(3)
    expect(opts[0].text()).toBe('Option A')
  })

  it('renders object options with label and value', () => {
    const wrapper = mount(Select, {
      props: { options: objectOptions, modelValue: '' },
    })
    const opts = wrapper.findAll('option')
    expect(opts[0].text()).toBe('Label A')
    expect(opts[0].attributes('value')).toBe('a')
  })

  it('renders placeholder option when provided', () => {
    const wrapper = mount(Select, {
      props: { options: stringOptions, placeholder: 'Pick one', modelValue: '' },
    })
    const placeholderOpt = wrapper.find('option[value=""]')
    expect(placeholderOpt.exists()).toBe(true)
    expect(placeholderOpt.text()).toBe('Pick one')
  })

  it('does not render placeholder option when not provided', () => {
    const wrapper = mount(Select, {
      props: { options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('option[value=""]').exists()).toBe(false)
  })

  it('renders label when provided', () => {
    const wrapper = mount(Select, {
      props: { label: 'Country', options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('label').text()).toContain('Country')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(Select, {
      props: { options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('shows asterisk when required', () => {
    const wrapper = mount(Select, {
      props: { label: 'Country', required: true, options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('span[aria-hidden]').text()).toBe('*')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(Select, {
      props: { options: stringOptions, modelValue: '' },
    })
    await wrapper.find('select').setValue('Option B')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Option B'])
  })

  it('shows error message when error prop provided', () => {
    const wrapper = mount(Select, {
      props: { error: 'Required field', options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('p[role="alert"]').text()).toBe('Required field')
  })

  it('does not show error when no error prop', () => {
    const wrapper = mount(Select, {
      props: { options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('p[role="alert"]').exists()).toBe(false)
  })

  it('shows hint when provided and no error', () => {
    const wrapper = mount(Select, {
      props: { hint: 'Choose wisely', options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('p').text()).toBe('Choose wisely')
  })

  it('error takes precedence over hint', () => {
    const wrapper = mount(Select, {
      props: { hint: 'Hint', error: 'Error', options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('p[role="alert"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Hint')
  })

  it('applies error classes when error present', () => {
    const wrapper = mount(Select, {
      props: { error: 'bad', options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('select').classes().join(' ')).toContain('border-red-300')
  })

  it('applies disabled classes when disabled', () => {
    const wrapper = mount(Select, {
      props: { disabled: true, options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('select').classes().join(' ')).toContain('cursor-not-allowed')
  })

  it('sets aria-invalid when error present', () => {
    const wrapper = mount(Select, {
      props: { error: 'bad', options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('select').attributes('aria-invalid')).toBe('true')
  })

  it('sets aria-required when required', () => {
    const wrapper = mount(Select, {
      props: { required: true, options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('select').attributes('aria-required')).toBe('true')
  })

  it('uses custom id when provided', () => {
    const wrapper = mount(Select, {
      props: { id: 'my-select', label: 'My Label', options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('select').attributes('id')).toBe('my-select')
    expect(wrapper.find('label').attributes('for')).toBe('my-select')
  })

  it('applies normal classes when no error and not disabled', () => {
    const wrapper = mount(Select, {
      props: { options: stringOptions, modelValue: '' },
    })
    expect(wrapper.find('select').classes().join(' ')).toContain('border-gray-300')
  })
})
