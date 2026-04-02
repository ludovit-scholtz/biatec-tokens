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
    getSubscriptionTierGating: vi.fn(),
  },
}))

import { complianceService } from '../../services/ComplianceService'

const mockMetrics = {
  currentTier: 'professional' as 'free' | 'professional' | 'enterprise',
  features: [
    { feature: 'Advanced Analytics', enabled: true },
    { feature: 'Custom Reports', enabled: true },
    { feature: 'API Access', enabled: false },
  ],
  upgradableFeatures: 1,
  lastUpdated: new Date().toISOString(),
}

async function mountWidget(tier: 'free' | 'professional' | 'enterprise' = 'professional', subscriptionActive = true, upgradable = 1) {
  setActivePinia(createPinia())
  const metrics = { ...mockMetrics, currentTier: tier, upgradableFeatures: upgradable }
  vi.mocked(complianceService.getSubscriptionTierGating).mockResolvedValue(metrics as any)

  const { useSubscriptionStore } = await import('../../stores/subscription')
  const store = useSubscriptionStore()
  store.subscription = subscriptionActive ? { subscription_status: 'active', id: 'sub-1', user_id: 'u1', stripe_subscription_id: 'sub_1', stripe_customer_id: 'cus_1', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), price_id: 'price_1' } as any : null
  store.fetchSubscription = vi.fn().mockResolvedValue(undefined)

  const SubscriptionTierGatingWidget = (await import('../SubscriptionTierGatingWidget.vue')).default
  const wrapper = mount(SubscriptionTierGatingWidget)
  await new Promise(r => setTimeout(r, 50))
  return wrapper
}

describe('SubscriptionTierGatingWidget', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('shows Professional tier label', async () => {
    const wrapper = await mountWidget('professional')
    expect(wrapper.text()).toContain('Professional')
  })

  it('shows Enterprise tier label', async () => {
    const wrapper = await mountWidget('enterprise')
    expect(wrapper.text()).toContain('Enterprise')
  })

  it('shows Free tier label for inactive subscription', async () => {
    const wrapper = await mountWidget('free', false)
    expect(wrapper.text()).toContain('Free')
  })

  it('shows enabled features count', async () => {
    const wrapper = await mountWidget()
    expect(wrapper.text()).toContain('Enabled')
    expect(wrapper.text()).toContain('2')
  })

  it('shows total features count', async () => {
    const wrapper = await mountWidget()
    expect(wrapper.text()).toContain('Total Features')
    expect(wrapper.text()).toContain('3')
  })

  it('shows locked count when upgradableFeatures > 0', async () => {
    const wrapper = await mountWidget('professional', true, 1)
    expect(wrapper.text()).toContain('Locked')
  })

  it('shows upgrade button when upgradableFeatures > 0', async () => {
    const wrapper = await mountWidget('professional', true, 1)
    expect(wrapper.text()).toContain('Upgrade to unlock')
  })

  it('shows "All features unlocked" when upgradableFeatures is 0', async () => {
    const wrapper = await mountWidget('enterprise', true, 0)
    expect(wrapper.text()).toContain('All features unlocked')
  })

  it('hides locked row when upgradableFeatures is 0', async () => {
    const wrapper = await mountWidget('enterprise', true, 0)
    expect(wrapper.text()).not.toContain('Locked')
  })

  it('shows error state on failure', async () => {
    setActivePinia(createPinia())
    vi.mocked(complianceService.getSubscriptionTierGating).mockRejectedValue(new Error('API error'))
    const { useSubscriptionStore } = await import('../../stores/subscription')
    const store = useSubscriptionStore()
    store.fetchSubscription = vi.fn().mockResolvedValue(undefined)

    const SubscriptionTierGatingWidget = (await import('../SubscriptionTierGatingWidget.vue')).default
    const wrapper = mount(SubscriptionTierGatingWidget)
    await new Promise(r => setTimeout(r, 50))
    expect(wrapper.text()).toContain('Failed to load metrics')
  })
})
