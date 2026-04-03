import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '../Input.vue'

describe('Input.vue', () => {
  it('renders an input element', () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
    })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders label when provided', () => {
    const wrapper = mount(Input, {
      props: { label: 'Email', modelValue: '' },
    })
    expect(wrapper.find('label').text()).toContain('Email')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
    })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('shows asterisk when required', () => {
    const wrapper = mount(Input, {
      props: { label: 'Name', required: true, modelValue: '' },
    })
    expect(wrapper.find('span[aria-hidden]').text()).toBe('*')
  })

  it('does not show asterisk when not required', () => {
    const wrapper = mount(Input, {
      props: { label: 'Name', modelValue: '' },
    })
    expect(wrapper.find('label').text()).not.toContain('*')
  })

  it('sets type attribute', () => {
    const wrapper = mount(Input, {
      props: { type: 'email', modelValue: '' },
    })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('defaults to type=text', () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
    })
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('binds modelValue to input value', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'hello' },
    })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
    })
    await wrapper.find('input').setValue('typed')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['typed'])
  })

  it('shows error message when error prop provided', () => {
    const wrapper = mount(Input, {
      props: { error: 'Field is required', modelValue: '' },
    })
    expect(wrapper.find('p[role="alert"]').text()).toBe('Field is required')
  })

  it('does not show error message when no error', () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
    })
    expect(wrapper.find('p[role="alert"]').exists()).toBe(false)
  })

  it('shows hint when provided and no error', () => {
    const wrapper = mount(Input, {
      props: { hint: 'Enter your email', modelValue: '' },
    })
    expect(wrapper.find('p').text()).toBe('Enter your email')
  })

  it('error takes precedence over hint', () => {
    const wrapper = mount(Input, {
      props: { hint: 'Hint', error: 'Error', modelValue: '' },
    })
    expect(wrapper.find('p[role="alert"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Hint')
  })

  it('applies error classes when error present', () => {
    const wrapper = mount(Input, {
      props: { error: 'bad', modelValue: '' },
    })
    expect(wrapper.find('input').classes().join(' ')).toContain('border-red-300')
  })

  it('applies disabled classes when disabled', () => {
    const wrapper = mount(Input, {
      props: { disabled: true, modelValue: '' },
    })
    expect(wrapper.find('input').classes().join(' ')).toContain('cursor-not-allowed')
  })

  it('sets aria-invalid when error present', () => {
    const wrapper = mount(Input, {
      props: { error: 'bad', modelValue: '' },
    })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('sets aria-required when required', () => {
    const wrapper = mount(Input, {
      props: { required: true, modelValue: '' },
    })
    expect(wrapper.find('input').attributes('aria-required')).toBe('true')
  })

  it('emits focus event', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
    })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  it('emits blur event', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
    })
    await wrapper.find('input').trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('uses custom id when provided', () => {
    const wrapper = mount(Input, {
      props: { id: 'custom-id', label: 'Label', modelValue: '' },
    })
    expect(wrapper.find('input').attributes('id')).toBe('custom-id')
    expect(wrapper.find('label').attributes('for')).toBe('custom-id')
  })

  it('renders icon slot content', () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
      slots: { icon: '<svg data-testid="icon"></svg>' },
    })
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
  })
})
