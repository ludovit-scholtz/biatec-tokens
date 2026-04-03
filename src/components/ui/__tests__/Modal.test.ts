/**
 * Tests for Modal.vue (ui component)
 *
 * Section 7r: Teleport + @keydown.esc cannot be tested via dispatchEvent in happy-dom.
 * Strategy:
 *   - Structural presence: verify [role="presentation"] outer wrapper exists in DOM
 *   - closeModal behavior: call via (wrapper.vm as any).closeModal() and assert emit
 *   - modalSizeClass: all 4 size variants (sm, md, lg, xl, default)
 *   - Slot rendering: header, default, footer slots
 *   - Accessibility attributes: role="dialog", aria-modal, aria-labelledby
 *   - Show/hide: show=false renders nothing; show=true renders dialog
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Modal from '../Modal.vue'

const mountModal = (props = {}, slots = {}) =>
  mount(Modal, {
    props: { show: true, ...props },
    slots,
    attachTo: document.body,
  })

describe('Modal.vue — show prop', () => {
  it('renders role="dialog" when show=true', async () => {
    const wrapper = mountModal({ show: true })
    await nextTick()
    // Teleport renders into body; check document.body for the dialog
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    wrapper.unmount()
  })

  it('does not render dialog content when show=false', async () => {
    const wrapper = mountModal({ show: false })
    await nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).toBeNull()
    wrapper.unmount()
  })
})

describe('Modal.vue — modalSizeClass computed', () => {
  const sizes: Array<[string, string]> = [
    ['sm', 'max-w-sm'],
    ['md', 'max-w-md'],
    ['lg', 'max-w-lg'],
    ['xl', 'max-w-2xl'],
  ]

  for (const [size, expectedClass] of sizes) {
    it(`returns ${expectedClass} for size="${size}"`, () => {
      const wrapper = mount(Modal, { props: { show: false, size: size as 'sm' | 'md' | 'lg' | 'xl' } })
      const vm = wrapper.vm as unknown as { modalSizeClass: string }
      expect(vm.modalSizeClass).toContain(expectedClass)
      wrapper.unmount()
    })
  }

  it('returns max-w-md for unknown size (default fallback)', () => {
    const wrapper = mount(Modal, { props: { show: false } })
    const vm = wrapper.vm as unknown as { modalSizeClass: string }
    // Default size is 'md'
    expect(vm.modalSizeClass).toContain('max-w-md')
    wrapper.unmount()
  })
})

describe('Modal.vue — closeModal logic', () => {
  it('emits "close" when closeModal is called directly', async () => {
    const wrapper = mountModal({ show: true })
    await nextTick()
    // Access the method via vm (Teleport component pattern per section 7r)
    const vm = wrapper.vm as unknown as { closeModal: () => void }
    vm.closeModal()
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('[role="presentation"] outer wrapper is present in DOM for keyboard trap (WCAG SC 2.1.2)', async () => {
    const wrapper = mountModal({ show: true })
    await nextTick()
    const outer = document.body.querySelector('[role="presentation"]')
    expect(outer).not.toBeNull()
    wrapper.unmount()
  })
})

describe('Modal.vue — slot rendering', () => {
  it('renders default slot content', async () => {
    const wrapper = mount(Modal, {
      props: { show: true },
      slots: { default: '<p data-testid="body-content">Body text</p>' },
      attachTo: document.body,
    })
    await nextTick()
    const bodyEl = document.body.querySelector('[data-testid="body-content"]')
    expect(bodyEl?.textContent).toBe('Body text')
    wrapper.unmount()
  })

  it('renders header slot when provided', async () => {
    const wrapper = mount(Modal, {
      props: { show: true },
      slots: { header: '<h2 data-testid="modal-title">Dialog Title</h2>' },
      attachTo: document.body,
    })
    await nextTick()
    const titleEl = document.body.querySelector('[data-testid="modal-title"]')
    expect(titleEl?.textContent).toBe('Dialog Title')
    wrapper.unmount()
  })

  it('renders footer slot when provided', async () => {
    const wrapper = mount(Modal, {
      props: { show: true },
      slots: { footer: '<button data-testid="cancel-btn">Cancel</button>' },
      attachTo: document.body,
    })
    await nextTick()
    const cancelBtn = document.body.querySelector('[data-testid="cancel-btn"]')
    expect(cancelBtn?.textContent).toBe('Cancel')
    wrapper.unmount()
  })
})

describe('Modal.vue — accessibility attributes', () => {
  it('dialog element has role="dialog"', async () => {
    const wrapper = mountModal({ show: true })
    await nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    wrapper.unmount()
  })

  it('dialog element has aria-modal="true"', async () => {
    const wrapper = mountModal({ show: true })
    await nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    wrapper.unmount()
  })

  it('dialog element has aria-labelledby attribute', async () => {
    const wrapper = mountModal({ show: true })
    await nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-labelledby')).toBeTruthy()
    wrapper.unmount()
  })

  it('dialog element has tabindex="-1" for focus management', async () => {
    const wrapper = mountModal({ show: true })
    await nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('tabindex')).toBe('-1')
    wrapper.unmount()
  })
})

describe('Modal.vue — no wallet connector UI', () => {
  it('renders no wallet connector references', async () => {
    const wrapper = mountModal({ show: true })
    await nextTick()
    const html = document.body.innerHTML
    expect(html).not.toMatch(/WalletConnect|MetaMask|\bPera\b.*Wallet|Defly/i)
    wrapper.unmount()
  })
})
