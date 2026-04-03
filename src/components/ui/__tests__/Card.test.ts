import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '../Card.vue'

describe('Card.vue', () => {
  it('renders default slot content', () => {
    const wrapper = mount(Card, {
      slots: { default: '<span>Card body</span>' },
    })
    expect(wrapper.text()).toContain('Card body')
  })

  it('renders header slot when provided', () => {
    const wrapper = mount(Card, {
      slots: {
        header: '<h3>Card Header</h3>',
        default: 'body',
      },
    })
    expect(wrapper.text()).toContain('Card Header')
  })

  it('does not render header slot container when not provided', () => {
    const wrapper = mount(Card, {
      slots: { default: 'body' },
    })
    // No border-b element when no header slot
    const borderDivs = wrapper.findAll('.border-b')
    expect(borderDivs.length).toBe(0)
  })

  it('renders footer slot when provided', () => {
    const wrapper = mount(Card, {
      slots: {
        default: 'body',
        footer: '<span>Footer</span>',
      },
    })
    expect(wrapper.text()).toContain('Footer')
  })

  it('does not render footer slot container when not provided', () => {
    const wrapper = mount(Card, {
      slots: { default: 'body' },
    })
    const borderTDivs = wrapper.findAll('.border-t')
    expect(borderTDivs.length).toBe(0)
  })

  it('applies default variant classes', () => {
    const wrapper = mount(Card, {
      slots: { default: 'body' },
    })
    expect(wrapper.classes().join(' ')).toContain('rounded-xl')
  })

  it('applies glass variant classes', () => {
    const wrapper = mount(Card, {
      props: { variant: 'glass' },
      slots: { default: 'body' },
    })
    expect(wrapper.classes().join(' ')).toContain('backdrop-blur-xl')
  })

  it('applies elevated variant classes', () => {
    const wrapper = mount(Card, {
      props: { variant: 'elevated' },
      slots: { default: 'body' },
    })
    expect(wrapper.classes().join(' ')).toContain('shadow-lg')
  })

  it('applies hover effect when hover=true', () => {
    const wrapper = mount(Card, {
      props: { hover: true },
      slots: { default: 'body' },
    })
    expect(wrapper.classes().join(' ')).toContain('hover:shadow-lg')
  })

  it('does not apply hover effect when hover=false (default)', () => {
    const wrapper = mount(Card, {
      slots: { default: 'body' },
    })
    expect(wrapper.classes().join(' ')).not.toContain('hover:-translate-y-1')
  })

  it('applies none padding', () => {
    const wrapper = mount(Card, {
      props: { padding: 'none' },
      slots: { default: 'body' },
    })
    // Content div is the first direct child when no header/footer slots
    const contentEl = wrapper.element.children[0] as HTMLElement
    expect(contentEl.className).toBe('')
  })

  it('applies sm padding', () => {
    const wrapper = mount(Card, {
      props: { padding: 'sm' },
      slots: { default: 'body' },
    })
    const contentEl = wrapper.element.children[0] as HTMLElement
    expect(contentEl.className).toContain('p-4')
  })

  it('applies md padding (default)', () => {
    const wrapper = mount(Card, {
      slots: { default: 'body' },
    })
    const contentEl = wrapper.element.children[0] as HTMLElement
    expect(contentEl.className).toContain('p-6')
  })

  it('applies lg padding', () => {
    const wrapper = mount(Card, {
      props: { padding: 'lg' },
      slots: { default: 'body' },
    })
    const contentEl = wrapper.element.children[0] as HTMLElement
    expect(contentEl.className).toContain('p-8')
  })
})
