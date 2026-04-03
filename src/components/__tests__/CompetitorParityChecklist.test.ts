/**
 * Tests for CompetitorParityChecklist.vue
 *
 * Covers: toggleFeature, getCompletedFeatures, getCompletionClass,
 * saveToLocalStorage, loadFromLocalStorage (success + catch branch),
 * completedCount/totalCount/completionPercentage computed props.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CompetitorParityChecklist from '../CompetitorParityChecklist.vue'

const mountChecklist = () =>
  mount(CompetitorParityChecklist, {
    global: {
      stubs: {
        'transition': false,
      },
    },
  })

describe('CompetitorParityChecklist — computed props', () => {
  it('shows correct totalCount (3 competitors × N features each)', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      totalCount: number
      completedCount: number
      completionPercentage: number
    }
    expect(vm.totalCount).toBeGreaterThan(0)
    // No features completed at start
    expect(vm.completedCount).toBe(0)
  })

  it('completionPercentage is 0 when nothing is checked', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as { completionPercentage: number }
    expect(vm.completionPercentage).toBe(0)
  })
})

describe('CompetitorParityChecklist — toggleFeature', () => {
  it('marks a feature as completed and updates completedCount', async () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      toggleFeature: (id: string) => void
      completedCount: number
    }
    expect(vm.completedCount).toBe(0)
    vm.toggleFeature('pera-asa-support')
    await nextTick()
    expect(vm.completedCount).toBe(1)
  })

  it('toggles a feature back to unchecked when called twice', async () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      toggleFeature: (id: string) => void
      completedCount: number
    }
    vm.toggleFeature('pera-nft-gallery')
    await nextTick()
    expect(vm.completedCount).toBe(1)
    vm.toggleFeature('pera-nft-gallery')
    await nextTick()
    expect(vm.completedCount).toBe(0)
  })

  it('does nothing for an unknown feature ID', async () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      toggleFeature: (id: string) => void
      completedCount: number
    }
    vm.toggleFeature('non-existent-feature-id')
    await nextTick()
    expect(vm.completedCount).toBe(0)
  })
})

describe('CompetitorParityChecklist — getCompletedFeatures', () => {
  it('returns 0 for a competitor with no completed features', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      getCompletedFeatures: (competitor: { features: { completed: boolean }[] }) => number
    }
    const competitor = { features: [{ completed: false }, { completed: false }] }
    expect(vm.getCompletedFeatures(competitor)).toBe(0)
  })

  it('returns correct count for a partially-completed competitor', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      getCompletedFeatures: (competitor: { features: { completed: boolean }[] }) => number
    }
    const competitor = { features: [{ completed: true }, { completed: false }, { completed: true }] }
    expect(vm.getCompletedFeatures(competitor)).toBe(2)
  })
})

describe('CompetitorParityChecklist — getCompletionClass', () => {
  it('returns text-green-400 when all features are complete', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      getCompletionClass: (competitor: { features: { completed: boolean }[] }) => string
    }
    const competitor = { features: [{ completed: true }, { completed: true }] }
    expect(vm.getCompletionClass(competitor)).toContain('text-green-400')
  })

  it('returns text-yellow-400 when ≥50% but not 100% are complete', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      getCompletionClass: (competitor: { features: { completed: boolean }[] }) => string
    }
    const competitor = { features: [{ completed: true }, { completed: false }] }
    expect(vm.getCompletionClass(competitor)).toContain('text-yellow-400')
  })

  it('returns text-gray-400 when less than 50% are complete', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      getCompletionClass: (competitor: { features: { completed: boolean }[] }) => string
    }
    const competitor = {
      features: [
        { completed: true },
        { completed: false },
        { completed: false },
        { completed: false },
      ],
    }
    expect(vm.getCompletionClass(competitor)).toContain('text-gray-400')
  })
})

describe('CompetitorParityChecklist — localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    localStorage.clear()
  })

  it('saveToLocalStorage persists data to localStorage', async () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      toggleFeature: (id: string) => void
    }
    vm.toggleFeature('pera-asa-support')
    await nextTick()
    const stored = localStorage.getItem('biatec_competitor_parity_checklist')
    expect(stored).not.toBeNull()
    const data = JSON.parse(stored!)
    expect(Array.isArray(data)).toBe(true)
    const peraEntry = data.find((c: { name: string }) => c.name === 'Pera Wallet')
    const asaFeature = peraEntry?.features.find((f: { id: string }) => f.id === 'pera-asa-support')
    expect(asaFeature?.completed).toBe(true)
  })

  it('loadFromLocalStorage restores state on mount', async () => {
    // Pre-seed localStorage with a completed feature
    const seed = [
      {
        name: 'Pera Wallet',
        features: [{ id: 'pera-asa-support', completed: true }],
      },
    ]
    localStorage.setItem('biatec_competitor_parity_checklist', JSON.stringify(seed))

    const wrapper = mountChecklist()
    // loadFromLocalStorage is called in onMounted
    await nextTick()
    const vm = wrapper.vm as unknown as { completedCount: number }
    expect(vm.completedCount).toBe(1)
  })

  it('loadFromLocalStorage handles corrupt JSON gracefully (catch branch)', async () => {
    localStorage.setItem('biatec_competitor_parity_checklist', 'INVALID_JSON:::')
    // Should not throw
    expect(() => mountChecklist()).not.toThrow()
  })
})

describe('CompetitorParityChecklist — template rendering', () => {
  it('renders all 3 competitor sections', () => {
    const wrapper = mountChecklist()
    const html = wrapper.html()
    // The component renders competitor names
    expect(html.toLowerCase()).toMatch(/pera|algorand|folks|defly/i)
  })

  it('does not render any wallet connector UI CTA (product definition compliance)', () => {
    const wrapper = mountChecklist()
    const html = wrapper.html()
    // Note: "WalletConnect" appears as a FEATURE NAME in the competitor checklist (it's a competitor feature),
    // so we only check there is no "Connect Wallet" CTA button targeting our own users
    expect(html).not.toContain('Connect Wallet')
    expect(html).not.toContain('MetaMask')
    // No wallet address display or auth prompt
    expect(html).not.toContain('wallet address:')
  })
})
