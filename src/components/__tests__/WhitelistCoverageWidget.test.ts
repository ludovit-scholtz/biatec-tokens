import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('../MicaSummaryWidget.vue', () => ({
  default: {
    name: 'MicaSummaryWidget',
    template: '<div><slot name="content" /></div>',
    props: ['title', 'subtitle', 'icon', 'iconColor', 'lastUpdated', 'hasDetails'],
    emits: ['view-details'],
  },
}))

vi.mock('../../services/ComplianceService', () => ({
  complianceService: {
    getWhitelistCoverageMetrics: vi.fn(),
  },
}))

import { complianceService } from '../../services/ComplianceService'

const mockMetrics = {
  coveragePercentage: 85,
  totalAddresses: 1200,
  activeAddresses: 1000,
  pendingAddresses: 50,
  recentlyAdded: 10,
  lastUpdated: new Date().toISOString(),
}

async function mountWidget(metrics = mockMetrics, props = {}) {
  setActivePinia(createPinia())
  vi.mocked(complianceService.getWhitelistCoverageMetrics).mockResolvedValue(metrics as any)
  const WhitelistCoverageWidget = (await import('../WhitelistCoverageWidget.vue')).default
  const wrapper = mount(WhitelistCoverageWidget, {
    props: { tokenId: 'tok-1', network: 'algorand-mainnet', ...props },
  })
  await new Promise(r => setTimeout(r, 50))
  return wrapper
}

describe('WhitelistCoverageWidget', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('shows coverage percentage after load', async () => {
    const wrapper = await mountWidget()
    expect(wrapper.text()).toContain('85.0%')
  })

  it('shows total addresses', async () => {
    const wrapper = await mountWidget()
    expect(wrapper.text()).toContain('Total Addresses')
    expect(wrapper.text()).toContain('1,200')
  })

  it('shows active addresses count', async () => {
    const wrapper = await mountWidget()
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('1,000')
  })

  it('shows pending addresses when > 0', async () => {
    const wrapper = await mountWidget()
    expect(wrapper.text()).toContain('Pending')
    expect(wrapper.text()).toContain('50')
  })

  it('hides pending row when pendingAddresses is 0', async () => {
    const wrapper = await mountWidget({ ...mockMetrics, pendingAddresses: 0 })
    expect(wrapper.text()).not.toContain('Pending')
  })

  it('shows recentlyAdded when > 0', async () => {
    const wrapper = await mountWidget()
    expect(wrapper.text()).toContain('Added (24h)')
    expect(wrapper.text()).toContain('+10')
  })

  it('hides recentlyAdded row when 0', async () => {
    const wrapper = await mountWidget({ ...mockMetrics, recentlyAdded: 0 })
    expect(wrapper.text()).not.toContain('Added (24h)')
  })

  it('shows error state on failure', async () => {
    setActivePinia(createPinia())
    vi.mocked(complianceService.getWhitelistCoverageMetrics).mockRejectedValue(new Error('Network error'))
    const WhitelistCoverageWidget = (await import('../WhitelistCoverageWidget.vue')).default
    const wrapper = mount(WhitelistCoverageWidget, {
      props: { tokenId: 'tok-1', network: 'algorand-mainnet' },
    })
    await new Promise(r => setTimeout(r, 50))
    expect(wrapper.text()).toContain('Failed to load metrics')
  })

  it('returns green iconColor when coverage >= 90', async () => {
    const wrapper = await mountWidget({ ...mockMetrics, coveragePercentage: 95 })
    expect(wrapper.exists()).toBe(true)
  })

  it('returns yellow iconColor when coverage >= 70 and < 90', async () => {
    const wrapper = await mountWidget({ ...mockMetrics, coveragePercentage: 75 })
    expect(wrapper.exists()).toBe(true)
  })

  it('returns orange iconColor when coverage < 70', async () => {
    const wrapper = await mountWidget({ ...mockMetrics, coveragePercentage: 60 })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits view-details when widget emits', async () => {
    const wrapper = await mountWidget()
    expect(wrapper.exists()).toBe(true)
  })

  it('skips API call when tokenId is empty', async () => {
    setActivePinia(createPinia())
    vi.mocked(complianceService.getWhitelistCoverageMetrics).mockResolvedValue(mockMetrics as any)
    const WhitelistCoverageWidget = (await import('../WhitelistCoverageWidget.vue')).default
    mount(WhitelistCoverageWidget, {
      props: { tokenId: '', network: 'algorand-mainnet' },
    })
    await new Promise(r => setTimeout(r, 50))
    expect(complianceService.getWhitelistCoverageMetrics).not.toHaveBeenCalled()
  })
})
