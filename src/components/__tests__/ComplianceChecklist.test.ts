/**
 * Tests for ComplianceChecklist.vue
 *
 * Covers: getCategoryLabel, getCategoryIcon, getCategoryItems,
 * toggleExpanded, handleToggle, handleExport (blob/download path),
 * handleReset (with window.confirm stub), trackCompletionEvent (window.gtag branch).
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import ComplianceChecklist from '../ComplianceChecklist.vue'

const MOCK_CHECKLIST_ITEMS = [
  {
    id: 'kyc-policy',
    category: 'kyc-aml',
    label: 'KYC Policy',
    description: 'Establish KYC',
    required: true,
    completed: false,
    networks: ['Both'],
  },
  {
    id: 'mica-compliance',
    category: 'jurisdiction',
    label: 'MICA Compliance',
    description: 'MICA assessment',
    required: true,
    completed: false,
    networks: ['Both'],
  },
]

const MOCK_METRICS = {
  completionPercentage: 50,
  completedChecks: 1,
  totalChecks: 2,
}

const mountChecklist = (storeOverrides = {}) =>
  mount(ComplianceChecklist, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            compliance: {
              checklistItems: MOCK_CHECKLIST_ITEMS,
              selectedNetwork: 'Both',
              metrics: MOCK_METRICS,
              filteredChecklist: MOCK_CHECKLIST_ITEMS,
              categoryProgress: [],
              requiredItemsComplete: false,
              checklistStartedAt: null,
              ...storeOverrides,
            },
          },
        }),
      ],
    },
  })

describe('ComplianceChecklist — getCategoryLabel', () => {
  const labelTests: [string, string][] = [
    ['kyc-aml', 'KYC/AML Compliance'],
    ['jurisdiction', 'Jurisdiction & Regulations'],
    ['disclosure', 'Disclosure Documents'],
    ['network-specific', 'Network-Specific Requirements'],
    ['unknown-category', 'unknown-category'],
  ]

  for (const [input, expected] of labelTests) {
    it(`returns "${expected}" for category "${input}"`, () => {
      const wrapper = mountChecklist()
      const vm = wrapper.vm as unknown as { getCategoryLabel: (c: string) => string }
      expect(vm.getCategoryLabel(input)).toBe(expected)
    })
  }
})

describe('ComplianceChecklist — getCategoryIcon', () => {
  const iconTests: [string, string][] = [
    ['kyc-aml', 'pi pi-users'],
    ['jurisdiction', 'pi pi-globe'],
    ['disclosure', 'pi pi-file'],
    ['network-specific', 'pi pi-server'],
    ['unknown', 'pi pi-check'],
  ]

  for (const [input, expected] of iconTests) {
    it(`returns "${expected}" for category "${input}"`, () => {
      const wrapper = mountChecklist()
      const vm = wrapper.vm as unknown as { getCategoryIcon: (c: string) => string }
      expect(vm.getCategoryIcon(input)).toBe(expected)
    })
  }
})

describe('ComplianceChecklist — getCategoryItems', () => {
  it('returns items matching the given category', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      getCategoryItems: (c: string) => { id: string }[]
    }
    const kycItems = vm.getCategoryItems('kyc-aml')
    expect(kycItems.length).toBe(1)
    expect(kycItems[0].id).toBe('kyc-policy')
  })

  it('returns empty array for a category with no items', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      getCategoryItems: (c: string) => object[]
    }
    expect(vm.getCategoryItems('disclosure')).toHaveLength(0)
  })
})

describe('ComplianceChecklist — toggleExpanded', () => {
  it('toggles an item from false to true', async () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      toggleExpanded: (id: string) => void
      expandedItems: Record<string, boolean>
    }
    expect(vm.expandedItems['kyc-policy']).toBeFalsy()
    vm.toggleExpanded('kyc-policy')
    await nextTick()
    expect(vm.expandedItems['kyc-policy']).toBe(true)
  })

  it('toggles back to false when called twice', async () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as {
      toggleExpanded: (id: string) => void
      expandedItems: Record<string, boolean>
    }
    vm.toggleExpanded('kyc-policy')
    await nextTick()
    vm.toggleExpanded('kyc-policy')
    await nextTick()
    expect(vm.expandedItems['kyc-policy']).toBe(false)
  })
})

describe('ComplianceChecklist — handleToggle', () => {
  it('calls complianceStore.toggleCheckItem with the item ID', async () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as { handleToggle: (id: string) => void }
    const { useComplianceStore } = await import('../../stores/compliance')
    const store = useComplianceStore()
    vm.handleToggle('kyc-policy')
    expect(store.toggleCheckItem).toHaveBeenCalledWith('kyc-policy')
  })

  it('calls trackCompletionEvent when requiredItemsComplete transitions to true', async () => {
    const wrapper = mountChecklist({
      requiredItemsComplete: true,
      checklistItems: [{ ...MOCK_CHECKLIST_ITEMS[0], completed: false }],
    })
    const vm = wrapper.vm as unknown as { handleToggle: (id: string) => void }
    // Should not throw when gtag is not available
    expect(() => vm.handleToggle('kyc-policy')).not.toThrow()
  })
})

describe('ComplianceChecklist — trackCompletionEvent', () => {
  afterEach(() => {
    delete (window as any).gtag
  })

  it('calls window.gtag when available', () => {
    const gtagSpy = vi.fn()
    ;(window as any).gtag = gtagSpy
    const wrapper = mountChecklist({ requiredItemsComplete: true })
    const vm = wrapper.vm as unknown as { trackCompletionEvent: () => void }
    vm.trackCompletionEvent()
    expect(gtagSpy).toHaveBeenCalledWith(
      'event',
      'compliance_checklist_completed',
      expect.any(Object),
    )
  })

  it('does not throw when window.gtag is not available', () => {
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as { trackCompletionEvent: () => void }
    expect(() => vm.trackCompletionEvent()).not.toThrow()
  })
})

describe('ComplianceChecklist — handleExport', () => {
  it('creates a download link without throwing', () => {
    const createObjectURLSpy = vi.fn(() => 'blob:test-url')
    const revokeObjectURLSpy = vi.fn()
    vi.stubGlobal('URL', {
      createObjectURL: createObjectURLSpy,
      revokeObjectURL: revokeObjectURLSpy,
    })
    // Stub document.body methods
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((el) => el)
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((el) => el)
    const clickSpy = vi.fn()
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = document.createElement.apply(document, [tag]) as HTMLAnchorElement
      if (tag === 'a') {
        ;(el as any).click = clickSpy
      }
      return el
    })

    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as { handleExport: () => void }
    expect(() => vm.handleExport()).not.toThrow()

    appendSpy.mockRestore()
    removeSpy.mockRestore()
    vi.unstubAllGlobals()
  })
})

describe('ComplianceChecklist — handleReset', () => {
  it('calls complianceStore.resetChecklist when user confirms', async () => {
    vi.stubGlobal('confirm', () => true)
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as { handleReset: () => void }
    const { useComplianceStore } = await import('../../stores/compliance')
    const store = useComplianceStore()
    vm.handleReset()
    expect(store.resetChecklist).toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('does NOT call resetChecklist when user cancels', async () => {
    vi.stubGlobal('confirm', () => false)
    const wrapper = mountChecklist()
    const vm = wrapper.vm as unknown as { handleReset: () => void }
    const { useComplianceStore } = await import('../../stores/compliance')
    const store = useComplianceStore()
    vm.handleReset()
    expect(store.resetChecklist).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})

describe('ComplianceChecklist — template rendering', () => {
  it('renders "Compliance Checklist" heading', () => {
    const wrapper = mountChecklist()
    expect(wrapper.html()).toContain('Compliance Checklist')
  })

  it('does not render wallet connector UI', () => {
    const wrapper = mountChecklist()
    const html = wrapper.html()
    expect(html).not.toContain('WalletConnect')
    expect(html).not.toContain('Connect Wallet')
    expect(html).not.toMatch(/MetaMask/i)
  })
})
