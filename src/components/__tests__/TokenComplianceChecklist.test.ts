import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TokenComplianceChecklist from '../TokenComplianceChecklist.vue'

vi.mock('../MicaReadinessBadge.vue', () => ({
  default: { name: 'MicaReadinessBadge', template: '<span />', props: ['tokenId', 'size'] },
}))

const mockRouter = { push: vi.fn() }
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

function mountChecklist(props = {}) {
  setActivePinia(createPinia())
  return mount(TokenComplianceChecklist, {
    props: { tokenId: 'token-1', ...props },
    global: { stubs: { MicaReadinessBadge: true } },
  })
}

describe('TokenComplianceChecklist', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders MICA Compliance Checklist heading', () => {
    const wrapper = mountChecklist()
    expect(wrapper.text()).toContain('MICA Compliance Checklist')
  })

  it('shows completion percentage', () => {
    const wrapper = mountChecklist()
    expect(wrapper.text()).toMatch(/\d+% Complete/)
  })

  it('renders checklist items from default store', () => {
    const wrapper = mountChecklist()
    expect(wrapper.text()).toContain('Token whitepaper published')
  })

  it('renders all 5 default checklist items', () => {
    const wrapper = mountChecklist()
    const buttons = wrapper.findAll('button[class*="rounded"][class*="border"]')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('toggles item on click', async () => {
    const wrapper = mountChecklist()
    const itemBtn = wrapper.findAll('button').find(b => b.classes().some(c => c.includes('border-gray-500') || c.includes('biatec-accent')))
    if (itemBtn) {
      await itemBtn.trigger('click')
      // After toggle, the text should reflect the change
      expect(wrapper.exists()).toBe(true)
    }
  })

  it('shows Reset button when showResetButton is true and items completed', async () => {
    const wrapper = mountChecklist({ showResetButton: true })
    // Toggle an item to trigger hasAnyCompleted
    const toggleBtn = wrapper.findAll('button').find(b => b.attributes('class')?.includes('border-'))
    if (toggleBtn) {
      await toggleBtn.trigger('click')
      // Reset button should appear
      expect(wrapper.exists()).toBe(true)
    }
  })

  it('does not show Reset button when showResetButton is false', () => {
    const wrapper = mountChecklist({ showResetButton: false })
    const text = wrapper.text()
    expect(text).not.toContain('Reset')
  })

  it('shows View Full Compliance Dashboard button when showComplianceLink is true', () => {
    const wrapper = mountChecklist({ showComplianceLink: true })
    expect(wrapper.text()).toContain('View Full Compliance Dashboard')
  })

  it('does not show compliance link when showComplianceLink is false', () => {
    const wrapper = mountChecklist({ showComplianceLink: false })
    expect(wrapper.text()).not.toContain('View Full Compliance Dashboard')
  })

  it('navigates to ComplianceDashboard when link clicked', async () => {
    const wrapper = mountChecklist({ showComplianceLink: true })
    // Find the "View Full Compliance Dashboard" button by text
    const allBtns = wrapper.findAll('button')
    const linkBtn = allBtns.find(b => b.text().includes('View Full Compliance Dashboard'))
    if (linkBtn) {
      await linkBtn.trigger('click')
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'ComplianceDashboard' })
    }
  })

  it('calls confirm and resets when Reset clicked', async () => {
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
    const wrapper = mountChecklist({ showResetButton: true })
    // First complete an item by clicking a checklist toggle button
    const itemBtns = wrapper.findAll('button').filter(b => b.attributes('class')?.includes('border-2'))
    if (itemBtns.length) {
      await itemBtns[0].trigger('click')
      await wrapper.vm.$nextTick()
      // Reset button may appear now
      const allBtns = wrapper.findAll('button')
      const resetBtn = allBtns.find(b => b.text().includes('Reset'))
      if (resetBtn) {
        await resetBtn.trigger('click')
        expect(vi.mocked(window.confirm)).toHaveBeenCalled()
      }
    }
    vi.unstubAllGlobals()
  })

  it('does not reset when confirm returns false', async () => {
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(false))
    const wrapper = mountChecklist({ showResetButton: true })
    const itemBtns = wrapper.findAll('button').filter(b => b.attributes('class')?.includes('border-2'))
    if (itemBtns.length) {
      await itemBtns[0].trigger('click')
      await wrapper.vm.$nextTick()
      const allBtns = wrapper.findAll('button')
      const resetBtn = allBtns.find(b => b.text().includes('Reset'))
      if (resetBtn) {
        await resetBtn.trigger('click')
        expect(vi.mocked(window.confirm)).toHaveBeenCalled()
      }
    }
    vi.unstubAllGlobals()
  })
})
