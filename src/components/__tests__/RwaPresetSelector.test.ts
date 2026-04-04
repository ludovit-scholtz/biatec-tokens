/**
 * Tests for RwaPresetSelector.vue
 *
 * Covers: selectPreset, currentPreset computed,
 * formatFeatureName (camelCase → Title Case), rwaPresets computed,
 * and template rendering.
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import RwaPresetSelector from '../RwaPresetSelector.vue'

const MOCK_RWA_TEMPLATES = [
  {
    id: 'rwa-real-estate',
    name: 'Real Estate Token',
    description: 'Tokenized real estate asset',
    standard: 'ARC19',
    network: 'VOI',
    rwaFeatures: {
      whitelistEnabled: true,
      transferRestrictions: true,
      complianceReporting: false,
      kycRequired: true,
    },
    additionalFeatures: [],
    tags: [],
    type: 'rwa',
    defaultValues: {},
  },
  {
    id: 'rwa-commodity',
    name: 'Commodity Token',
    description: 'Tokenized commodity',
    standard: 'ARC19',
    network: 'VOI',
    rwaFeatures: {
      whitelistEnabled: false,
      transferRestrictions: false,
      complianceReporting: true,
      kycRequired: false,
    },
    additionalFeatures: ['dividendSupport'],
    tags: [],
    type: 'rwa',
    defaultValues: {},
  },
]

const mountSelector = () =>
  mount(RwaPresetSelector, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            tokens: {
              rwaTokenTemplates: MOCK_RWA_TEMPLATES,
            },
          },
        }),
      ],
    },
  })

describe('RwaPresetSelector — selectPreset', () => {
  it('sets selectedPreset to the given ID', async () => {
    const wrapper = mountSelector()
    const vm = wrapper.vm as unknown as {
      selectPreset: (id: string) => void
      selectedPreset: string | null
    }
    expect(vm.selectedPreset).toBeNull()
    vm.selectPreset('rwa-security-token')
    await nextTick()
    expect(vm.selectedPreset).toBe('rwa-security-token')
  })

  it('can switch to a different preset', async () => {
    const wrapper = mountSelector()
    const vm = wrapper.vm as unknown as {
      selectPreset: (id: string) => void
      selectedPreset: string | null
    }
    vm.selectPreset('rwa-security-token')
    await nextTick()
    vm.selectPreset('rwa-real-estate-token')
    await nextTick()
    expect(vm.selectedPreset).toBe('rwa-real-estate-token')
  })
})

describe('RwaPresetSelector — currentPreset computed', () => {
  it('returns null when no preset is selected', () => {
    const wrapper = mountSelector()
    const vm = wrapper.vm as unknown as {
      currentPreset: object | null
    }
    expect(vm.currentPreset).toBeNull()
  })

  it('returns the matching template object when a preset is selected', async () => {
    const wrapper = mountSelector()
    const vm = wrapper.vm as unknown as {
      selectPreset: (id: string) => void
      currentPreset: { id: string; name: string } | null
    }
    vm.selectPreset('rwa-security-token')
    await nextTick()
    expect(vm.currentPreset).not.toBeNull()
    expect(vm.currentPreset!.id).toBe('rwa-security-token')
    expect(vm.currentPreset!.name).toBe('RWA Security Token (Whitelisted)')
  })

  it('returns null for an unknown preset ID', async () => {
    const wrapper = mountSelector()
    const vm = wrapper.vm as unknown as {
      selectPreset: (id: string) => void
      currentPreset: object | null
    }
    vm.selectPreset('unknown-id')
    await nextTick()
    expect(vm.currentPreset).toBeUndefined()
  })
})

describe('RwaPresetSelector — formatFeatureName', () => {
  it('converts camelCase to Title Case with spaces', () => {
    const wrapper = mountSelector()
    const vm = wrapper.vm as unknown as { formatFeatureName: (s: string) => string }
    expect(vm.formatFeatureName('whitelistEnabled')).toBe('Whitelist Enabled')
    expect(vm.formatFeatureName('transferRestrictions')).toBe('Transfer Restrictions')
  })

  it('handles a single word without modification', () => {
    const wrapper = mountSelector()
    const vm = wrapper.vm as unknown as { formatFeatureName: (s: string) => string }
    expect(vm.formatFeatureName('governance')).toBe('Governance')
  })

  it('converts dividendSupport correctly', () => {
    const wrapper = mountSelector()
    const vm = wrapper.vm as unknown as { formatFeatureName: (s: string) => string }
    expect(vm.formatFeatureName('dividendSupport')).toBe('Dividend Support')
  })
})

describe('RwaPresetSelector — rwaPresets computed', () => {
  it('returns all templates from the token store', () => {
    const wrapper = mountSelector()
    const vm = wrapper.vm as unknown as { rwaPresets: object[] }
    // The token store has 5 RWA presets (rwaTokenTemplates is a computed, not overridable via initialState)
    expect(vm.rwaPresets).toHaveLength(5)
  })
})

describe('RwaPresetSelector — template rendering', () => {
  it('renders preset names from the store', () => {
    const wrapper = mountSelector()
    const html = wrapper.html()
    expect(html).toContain('RWA Real Estate Token')
    expect(html).toContain('RWA Security Token (Whitelisted)')
  })

  it('does not render any wallet connector UI', () => {
    const wrapper = mountSelector()
    const html = wrapper.html()
    expect(html).not.toContain('WalletConnect')
    expect(html).not.toContain('MetaMask')
    expect(html).not.toContain('Connect Wallet')
  })
})
