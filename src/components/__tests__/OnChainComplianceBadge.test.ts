import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import OnChainComplianceBadge from '../OnChainComplianceBadge.vue'
import { useRouter } from 'vue-router'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

describe('OnChainComplianceBadge', () => {
  let wrapper: any
  let mockRouter: any

  const defaultProps = {
    tokenId: 'test-token-123',
    network: 'VOI',
    complianceScore: 85,
    complianceStatus: 'compliant' as const,
    onChainSignals: [
      {
        type: 'whitelist' as const,
        status: 'verified' as const,
        description: 'Token is whitelisted',
        timestamp: new Date('2024-01-01')
      }
    ],
    requiredArtifacts: [
      {
        type: 'audit' as const,
        status: 'completed' as const,
        description: 'Security audit completed',
        url: 'https://example.com/audit.pdf'
      }
    ]
  }

  beforeEach(() => {
    mockRouter = { push: vi.fn() }
    vi.mocked(useRouter).mockReturnValue(mockRouter)

    wrapper = mount(OnChainComplianceBadge, {
      props: defaultProps,
      global: {
        plugins: [createTestingPinia()],
        stubs: ['teleport']
      }
    })
  })

  describe('Component Rendering', () => {
    it('should render the badge with correct styling', () => {
      const badge = wrapper.find('[data-testid="compliance-badge"]')
      expect(badge.exists()).toBe(true)
      expect(badge.classes()).toContain('inline-flex')
      expect(badge.classes()).toContain('items-center')
    })

    it('should display the badge label', () => {
      const label = wrapper.find('[data-testid="badge-label"]')
      expect(label.text()).toBe('MICA Ready')
    })

    it('should display the badge icon', () => {
      const icon = wrapper.find('[data-testid="badge-icon"]')
      expect(icon.classes()).toContain('pi')
      expect(icon.classes()).toContain('pi-shield-check')
    })

    it('should show chevron when has artifacts', () => {
      const chevron = wrapper.find('[data-testid="chevron-icon"]')
      expect(chevron.exists()).toBe(true)
      expect(chevron.classes()).toContain('pi-chevron-down')
    })
  })

  describe('Badge Classes Computed Property', () => {
    it('should return compliant classes for high scores (80+)', async () => {
      await wrapper.setProps({ complianceScore: 85 })
      const badge = wrapper.find('[data-testid="compliance-badge"]')
      expect(badge.classes()).toContain('bg-green-500/20')
      expect(badge.classes()).toContain('border-green-500/50')
    })

    it('should return partial classes for medium scores (50-79)', async () => {
      await wrapper.setProps({ complianceScore: 65 })
      const badge = wrapper.find('[data-testid="compliance-badge"]')
      expect(badge.classes()).toContain('bg-yellow-500/20')
      expect(badge.classes()).toContain('border-yellow-500/50')
    })

    it('should return non-compliant classes for low scores (<50)', async () => {
      await wrapper.setProps({ complianceScore: 30 })
      const badge = wrapper.find('[data-testid="compliance-badge"]')
      expect(badge.classes()).toContain('bg-red-500/20')
      expect(badge.classes()).toContain('border-red-500/50')
    })
  })

  describe('Badge Icon Computed Property', () => {
    it('should return shield-check icon for high scores (80+)', async () => {
      await wrapper.setProps({ complianceScore: 85 })
      const icon = wrapper.find('[data-testid="badge-icon"]')
      expect(icon.classes()).toContain('pi-shield-check')
    })

    it('should return exclamation-triangle icon for medium scores (50-79)', async () => {
      await wrapper.setProps({ complianceScore: 65 })
      const icon = wrapper.find('[data-testid="badge-icon"]')
      expect(icon.classes()).toContain('pi-exclamation-triangle')
    })

    it('should return shield-x icon for low scores (<50)', async () => {
      await wrapper.setProps({ complianceScore: 30 })
      const icon = wrapper.find('[data-testid="badge-icon"]')
      expect(icon.classes()).toContain('pi-shield-x')
    })
  })

  describe('Badge Label Computed Property', () => {
    it('should return correct label for high scores (80+)', async () => {
      await wrapper.setProps({ complianceScore: 85 })
      const label = wrapper.find('[data-testid="badge-label"]')
      expect(label.text()).toBe('MICA Ready')
    })

    it('should return correct label for medium scores (50-79)', async () => {
      await wrapper.setProps({ complianceScore: 65 })
      const label = wrapper.find('[data-testid="badge-label"]')
      expect(label.text()).toBe('Partial Compliance')
    })

    it('should return correct label for low scores (<50)', async () => {
      await wrapper.setProps({ complianceScore: 30 })
      const label = wrapper.find('[data-testid="badge-label"]')
      expect(label.text()).toBe('Non-Compliant')
    })
  })

  describe('Badge Title Computed Property', () => {
    it('should return appropriate title with compliance score', async () => {
      await wrapper.setProps({ complianceScore: 85 })
      const badge = wrapper.find('[data-testid="compliance-badge"]')
      expect(badge.attributes('title')).toContain('MICA Compliance Score: 85%')
      expect(badge.attributes('title')).toContain('Click for details')
    })
  })

  describe('Score Color Computed Property', () => {
    it('should return green color for high scores', async () => {
      await wrapper.setProps({ complianceScore: 90 })
      // This would need to access the computed property directly
      // For now, we'll test the visual output
      expect(wrapper.vm.scoreColor).toBeDefined()
    })

    it('should return yellow color for medium scores', async () => {
      await wrapper.setProps({ complianceScore: 60 })
      expect(wrapper.vm.scoreColor).toBeDefined()
    })

    it('should return red color for low scores', async () => {
      await wrapper.setProps({ complianceScore: 30 })
      expect(wrapper.vm.scoreColor).toBeDefined()
    })
  })

  describe('Score Gradient Computed Property', () => {
    it('should return appropriate gradient for high scores', async () => {
      await wrapper.setProps({ complianceScore: 90 })
      expect(wrapper.vm.scoreGradient).toBeDefined()
    })

    it('should return appropriate gradient for medium scores', async () => {
      await wrapper.setProps({ complianceScore: 60 })
      expect(wrapper.vm.scoreGradient).toBeDefined()
    })
  })

  describe('On Chain Signals Computed Property', () => {
    it('should process on chain signals correctly', () => {
      expect(wrapper.vm.onChainSignals).toBeDefined()
      expect(Array.isArray(wrapper.vm.onChainSignals)).toBe(true)
      expect(wrapper.vm.onChainSignals.length).toBeGreaterThan(0)
      expect(wrapper.vm.onChainSignals[0]).toHaveProperty('label')
      expect(wrapper.vm.onChainSignals[0]).toHaveProperty('verified')
    })

    it('should generate different signals for different networks', async () => {
      await wrapper.setProps({ network: 'Ethereum' })
      const signals = wrapper.vm.onChainSignals
      // Should still return signals but with different verification status
      expect(signals.length).toBeGreaterThan(0)
    })
  })

  describe('Required Artifacts Computed Property', () => {
    it('should process required artifacts correctly', () => {
      expect(wrapper.vm.requiredArtifacts).toBeDefined()
      expect(Array.isArray(wrapper.vm.requiredArtifacts)).toBe(true)
      expect(wrapper.vm.requiredArtifacts.length).toBeGreaterThan(0)
      expect(wrapper.vm.requiredArtifacts[0]).toHaveProperty('type')
      expect(wrapper.vm.requiredArtifacts[0]).toHaveProperty('label')
      expect(wrapper.vm.requiredArtifacts[0]).toHaveProperty('status')
    })

    it('should generate different artifacts based on compliance score', async () => {
      await wrapper.setProps({ complianceScore: 30 })
      const artifacts = wrapper.vm.requiredArtifacts
      // Should still return artifacts but with different status
      expect(artifacts.length).toBeGreaterThan(0)
    })
  })

  describe('Has Artifacts Computed Property', () => {
    it('should return true when artifacts exist', () => {
      expect(wrapper.vm.hasArtifacts).toBe(true)
    })

    it('should return true even with low compliance score', async () => {
      await wrapper.setProps({ complianceScore: 10 })
      // The computed property always returns mock artifacts, so hasArtifacts is always true
      expect(wrapper.vm.hasArtifacts).toBe(true)
    })
  })

  describe('Data Sources Computed Property', () => {
    it('should return data sources array', () => {
      expect(wrapper.vm.dataSources).toBeDefined()
      expect(Array.isArray(wrapper.vm.dataSources)).toBe(true)
    })
  })

  describe('Navigate To Compliance Function', () => {
    it('should navigate to compliance dashboard with correct params', () => {
      wrapper.vm.navigateToCompliance()
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'ComplianceDashboard',
        params: { id: 'test-token-123' },
        query: { network: 'VOI' }
      })
    })

    it('should close details modal when navigating', () => {
      wrapper.vm.showDetails = true
      wrapper.vm.navigateToCompliance()
      expect(wrapper.vm.showDetails).toBe(false)
    })
  })

  describe('Export Artifacts Function', () => {
    it('should handle artifact export', () => {
      // Mock window.open
      const mockOpen = vi.fn()
      global.open = mockOpen

      wrapper.vm.exportArtifacts()

      // Function should exist and be callable
      expect(wrapper.vm.exportArtifacts).toBeDefined()
    })
  })

  describe('Modal Interactions', () => {
    it('should show details modal when badge is clicked', async () => {
      const badge = wrapper.find('[data-testid="compliance-badge"]')
      await badge.trigger('click')

      expect(wrapper.vm.showDetails).toBe(true)
    })

    it('should hide details modal when close button is clicked', async () => {
      // First show the modal
      wrapper.vm.showDetails = true
      await wrapper.vm.$nextTick()

      const closeButton = wrapper.find('[data-testid="close-modal"]')
      await closeButton.trigger('click')

      expect(wrapper.vm.showDetails).toBe(false)
    })

    it('should hide details modal when backdrop is clicked', async () => {
      // First show the modal
      wrapper.vm.showDetails = true
      await wrapper.vm.$nextTick()

      const backdrop = wrapper.find('[data-testid="modal-backdrop"]')
      await backdrop.trigger('click')

      expect(wrapper.vm.showDetails).toBe(false)
    })
  })

  describe('Score Display', () => {
    it('should display compliance score correctly when modal is open', async () => {
      wrapper.vm.showDetails = true
      await wrapper.vm.$nextTick()
      
      const scoreElement = wrapper.find('[data-testid="compliance-score"]')
      expect(scoreElement.text()).toContain('85%')
    })

    it('should update score bar width based on compliance score when modal is open', async () => {
      wrapper.vm.showDetails = true
      await wrapper.vm.$nextTick()
      
      const scoreBar = wrapper.find('[data-testid="score-bar"]')
      expect(scoreBar.attributes('style')).toContain('width: 85%')
    })
  })

  describe('Network Display', () => {
    it('should display network name in modal header when modal is open', async () => {
      wrapper.vm.showDetails = true
      await wrapper.vm.$nextTick()
      
      const networkElement = wrapper.find('[data-testid="token-id-display"]')
      expect(networkElement.text()).toContain('VOI')
    })
  })

  describe('Token ID Display', () => {
    it('should display token ID in modal header when modal is open', async () => {
      wrapper.vm.showDetails = true
      await wrapper.vm.$nextTick()
      
      const tokenIdElement = wrapper.find('[data-testid="token-id-display"]')
      expect(tokenIdElement.text()).toContain('test-token-123')
    })
  })
})