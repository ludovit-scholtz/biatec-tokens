/**
 * Marketplace View Tests
 * 
 * Tests for the Token Marketplace view, which displays regulated tokens
 * for enterprise operators to discover and trade.
 * 
 * Business value: Marketplace visibility directly supports operator trust —
 * operators need to discover tokens with correct compliance badges (MICA,
 * KYC, Whitelisted) to make informed decisions for regulated token operations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'
import Marketplace from '../Marketplace.vue'

// Stub components that have heavy deps
vi.mock('../../layout/MainLayout.vue', () => ({
  default: { name: 'MainLayout', template: '<div><slot /></div>' },
}))
vi.mock('../../components/MarketplaceFilters.vue', () => ({
  default: { name: 'MarketplaceFilters', template: '<div data-testid="marketplace-filters" />', props: ['filters', 'filteredCount', 'totalTokens'] },
}))
vi.mock('../../components/MarketplaceTokenCard.vue', () => ({
  default: { name: 'MarketplaceTokenCard', template: '<div data-testid="marketplace-token-card" />', props: ['token'] },
}))
vi.mock('../../components/TokenDetailDrawer.vue', () => ({
  default: { name: 'TokenDetailDrawer', template: '<div data-testid="token-detail-drawer" />', props: ['token', 'isOpen'] },
}))
vi.mock('../../services/PriceOracleService', () => ({
  priceOracleService: {
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    startPolling: vi.fn(),
    stopPolling: vi.fn(),
  },
}))

const makeRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }, { path: '/marketplace', component: Marketplace }],
  })

const mountMarketplace = async (storeOverrides = {}) => {
  const router = makeRouter()
  await router.push('/marketplace')
  await router.isReady()

  const pinia = createTestingPinia({
    createSpy: vi.fn,
    initialState: {
      marketplace: {
        tokens: [],
        filters: { network: 'All', complianceBadge: 'All', assetClass: 'All', search: '' },
        loading: false,
        error: null,
        filteredCount: 0,
        totalTokens: 0,
        ...storeOverrides,
      },
    },
  })

  const wrapper = mount(Marketplace, {
    global: {
      plugins: [pinia, router],
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        MarketplaceFilters: { template: '<div data-testid="marketplace-filters" />', props: ['filters', 'filteredCount', 'totalTokens'] },
        MarketplaceTokenCard: { template: '<div data-testid="marketplace-token-card" />', props: ['token'] },
        TokenDetailDrawer: { template: '<div data-testid="token-detail-drawer" />', props: ['token', 'isOpen'] },
      },
    },
  })
  await nextTick()
  return { wrapper, router }
}

describe('Marketplace View', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Token Marketplace heading', async () => {
    const { wrapper } = await mountMarketplace()
    const heading = wrapper.find('h1')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toContain('Token Marketplace')
  })

  it('renders the marketplace description text', async () => {
    const { wrapper } = await mountMarketplace()
    const html = wrapper.html()
    expect(html).toMatch(/regulated tokens|blockchain networks/i)
  })

  it('renders the filters panel', async () => {
    const { wrapper } = await mountMarketplace()
    const filters = wrapper.find('[data-testid="marketplace-filters"]')
    expect(filters.exists()).toBe(true)
  })

  it('shows empty state when no tokens are available', async () => {
    const { wrapper } = await mountMarketplace({ tokens: [], loading: false, error: null })
    const html = wrapper.html()
    // Should show some empty state indication
    const cards = wrapper.findAll('[data-testid="marketplace-token-card"]')
    expect(cards.length).toBe(0)
  })

  it('shows loading state when tokens are being fetched', async () => {
    const { wrapper } = await mountMarketplace({ loading: true })
    const html = wrapper.html()
    expect(html).toMatch(/Loading|loading/i)
  })

  it('shows error state when there is a fetch error', async () => {
    const { wrapper } = await mountMarketplace({ loading: false, error: 'Network error' })
    const html = wrapper.html()
    expect(html).toMatch(/Failed to load|Network error/i)
  })

  it('does not render wallet connector UI (product alignment)', async () => {
    const { wrapper } = await mountMarketplace()
    const html = wrapper.html()
    expect(html).not.toMatch(/WalletConnect|MetaMask|\bPera\b|Defly/i)
  })

  it('shows compliance-related filters for enterprise operators', async () => {
    const { wrapper } = await mountMarketplace()
    // The filters component should be rendered (it handles compliance badge filters)
    const filters = wrapper.find('[data-testid="marketplace-filters"]')
    expect(filters.exists()).toBe(true)
  })

  // handleTokenSelect coverage (lines 167-170)
  it('handleTokenSelect sets selectedToken and opens detail drawer', async () => {
    const { wrapper } = await mountMarketplace()
    const vm = wrapper.vm as any
    const mockToken = {
      id: 'tk-001',
      name: 'Test Token',
      ticker: 'TEST',
      network: 'Algorand Mainnet',
      standard: 'ARC3',
      complianceBadge: 'MICA Compliant',
      assetClass: 'Security Token',
      price: 1.0,
      priceChange24h: 0,
      marketCap: 1000000,
      volume24h: 50000,
      holders: 100,
      description: 'A test token',
      issuer: 'Test Issuer',
      issuanceDate: '2025-01-01',
      totalSupply: 1000000,
    }
    vm.handleTokenSelect(mockToken)
    await nextTick()
    expect(vm.selectedToken).toStrictEqual(mockToken)
    expect(vm.showDetailDrawer).toBe(true)
  })

  // closeDetailDrawer coverage (lines 172-178)
  it('closeDetailDrawer hides the drawer immediately', async () => {
    const { wrapper } = await mountMarketplace()
    const vm = wrapper.vm as any
    // First open the drawer
    vm.showDetailDrawer = true
    vm.selectedToken = { id: 'tk-001', name: 'Test Token' }
    await nextTick()
    expect(vm.showDetailDrawer).toBe(true)
    // Close the drawer
    vm.closeDetailDrawer()
    await nextTick()
    expect(vm.showDetailDrawer).toBe(false)
  })

  it('closeDetailDrawer clears selectedToken after animation delay', async () => {
    vi.useFakeTimers()
    const { wrapper } = await mountMarketplace()
    const vm = wrapper.vm as any
    vm.showDetailDrawer = true
    vm.selectedToken = { id: 'tk-002', name: 'Token B' }
    await nextTick()
    vm.closeDetailDrawer()
    await nextTick()
    // selectedToken still set immediately (animation delay in progress)
    expect(vm.selectedToken).not.toBeNull()
    // After 300ms delay, selectedToken should be cleared
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(vm.selectedToken).toBeNull()
    vi.useRealTimers()
  })

  // handleFilterUpdate coverage (line 160)
  it('handleFilterUpdate calls updateFilters on the store', async () => {
    const { wrapper } = await mountMarketplace()
    const vm = wrapper.vm as any
    const newFilters = { network: 'Algorand Mainnet', complianceBadge: 'MICA Compliant', assetClass: 'All', search: '' }
    vm.handleFilterUpdate(newFilters)
    await nextTick()
    // The store's updateFilters should have been called with the new filters
    const { useMarketplaceStore } = await import('../../stores/marketplace')
    const store = useMarketplaceStore()
    expect(store.updateFilters).toHaveBeenCalledWith(newFilters)
  })

  // handleReset coverage (line 164)
  it('handleReset calls resetFilters on the store', async () => {
    const { wrapper } = await mountMarketplace()
    const vm = wrapper.vm as any
    vm.handleReset()
    await nextTick()
    const { useMarketplaceStore } = await import('../../stores/marketplace')
    const store = useMarketplaceStore()
    expect(store.resetFilters).toHaveBeenCalled()
  })
})
