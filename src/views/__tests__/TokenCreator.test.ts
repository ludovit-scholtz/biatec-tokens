import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TokenCreator from '../TokenCreator.vue'

// Mock dependencies
vi.mock('../../stores/tokens', () => ({
  useTokenStore: vi.fn(() => ({
    networkGuidance: [
      {
        name: 'VOI',
        displayName: 'VOI Network',
        description: 'High-performance Algorand Virtual Machine',
        fees: { creation: '0.1 ALGO', transaction: '0.001 ALGO' },
        metadataHosting: {
          description: 'IPFS integration available',
          recommended: ['Pinata', 'Infura'],
        },
        compliance: {
          micaRelevance: 'Full MICA compliance support',
          considerations: ['Regulatory compliance', 'AML requirements'],
        },
        bestFor: ['DeFi applications', 'NFT marketplaces'],
      },
      {
        name: 'Aramid',
        displayName: 'Aramid Network',
        description: 'Enterprise-grade blockchain network',
        fees: { creation: '0.2 ALGO', transaction: '0.002 ALGO' },
        metadataHosting: {
          description: 'Built-in metadata hosting',
          recommended: ['Aramid Storage'],
        },
        compliance: {
          micaRelevance: 'Enhanced compliance features',
          considerations: ['Enterprise compliance', 'Audit trails'],
        },
        bestFor: ['Enterprise applications', 'RWA tokenization'],
      },
    ],
    tokenStandards: [
      {
        name: 'ASA',
        type: 'Asset',
        description: 'Algorand Standard Asset',
        icon: 'pi pi-circle',
        bgClass: 'bg-blue-500',
      },
      {
        name: 'ARC200',
        type: 'Token',
        description: 'ARC-200 Token Standard',
        icon: 'pi pi-star',
        bgClass: 'bg-green-500',
      },
    ],
    tokenTemplates: [
      {
        id: 'fungible-basic',
        name: 'Basic Fungible Token',
        description: 'Simple fungible token for general use',
        standard: 'ASA',
        network: 'VOI',
        type: 'FT',
        micaCompliant: true,
        useCases: ['Payments', 'Rewards'],
        defaults: {
          supply: 1000000,
          decimals: 6,
          description: 'A basic fungible token',
        },
        guidance: 'Perfect for basic token use cases',
        compliance: 'MICA compliant by default',
      },
      {
        id: 'nft-basic',
        name: 'Basic NFT',
        description: 'Simple non-fungible token',
        standard: 'ASA',
        network: 'Aramid',
        type: 'NFT',
        micaCompliant: false,
        useCases: ['Digital art', 'Collectibles'],
        defaults: {
          supply: 1,
          decimals: 0,
          description: 'A basic NFT',
        },
        guidance: 'Great for digital collectibles',
        compliance: 'Consider MICA compliance for regulated assets',
      },
    ],
    standardTokenTemplates: [
      {
        id: 'fungible-basic',
        name: 'Basic Fungible Token',
        description: 'Simple fungible token for general use',
        standard: 'ASA',
        network: 'VOI',
        type: 'FT',
        micaCompliant: true,
        useCases: ['Payments', 'Rewards'],
        defaults: {
          supply: 1000000,
          decimals: 6,
          description: 'A basic fungible token',
        },
        guidance: 'Perfect for basic token use cases',
        compliance: 'MICA compliant by default',
      },
      {
        id: 'nft-basic',
        name: 'Basic NFT',
        description: 'Simple non-fungible token',
        standard: 'ASA',
        network: 'Aramid',
        type: 'NFT',
        micaCompliant: false,
        useCases: ['Digital art', 'Collectibles'],
        defaults: {
          supply: 1,
          decimals: 0,
          description: 'A basic NFT',
        },
        guidance: 'Great for digital collectibles',
        compliance: 'Consider MICA compliance for regulated assets',
      },
    ],
    createToken: vi.fn(),
  })),
}))
vi.mock('../../stores/subscription', () => ({
  useSubscriptionStore: vi.fn(() => ({
    trackGuidanceInteraction: vi.fn(),
    trackTokenCreationAttempt: vi.fn(),
    trackTokenCreationSuccess: vi.fn(),
  })),
}))
vi.mock('../../stores/compliance', () => ({
  useComplianceStore: vi.fn(() => ({
    metrics: {
      completedChecks: 5,
      totalChecks: 10,
      completionPercentage: 50,
    },
    setNetwork: vi.fn(),
  })),
}))
vi.mock('../../services/TelemetryService', () => ({
  telemetryService: {
    trackTokenWizardStarted: vi.fn(),
    trackTokenWizardCompleted: vi.fn(),
  },
}))
vi.mock('../../composables/useWalletManager', () => ({
  useWalletManager: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    networkInfo: {
      chainType: 'AVM',
      genesisId: 'voi-testnet-v1',
      chainId: 1,
      isTestnet: true,
    },
  })),
}))
// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:test-url')
global.URL.revokeObjectURL = vi.fn()

describe('TokenCreator', () => {
  let wrapper: VueWrapper | null = null

  beforeEach(() => {
    setActivePinia(createPinia())

    // Reset localStorage mocks
    localStorageMock.getItem.mockReset()
    localStorageMock.setItem.mockReset()
    localStorageMock.removeItem.mockReset()

    wrapper = mount(TokenCreator, {
      global: {
        plugins: [createPinia()],
        stubs: {
          MainLayout: {
            template: '<div><slot /></div>',
          },
          ComplianceChecklist: {
            template: '<div data-testid="compliance-checklist"></div>',
          },
          RwaPresetSelector: {
            template: '<div data-testid="rwa-preset-selector"></div>',
          },
          WalletAttestationForm: {
            template: '<div data-testid="wallet-attestation-form"></div>',
          },
          MicaComplianceForm: {
            template: '<div data-testid="mica-compliance-form"></div>',
          },
          CompetitorParityChecklist: {
            template: '<div data-testid="competitor-parity-checklist"></div>',
          },
          WalletNetworkPanel: {
            template: '<div data-testid="wallet-network-panel"><button @click="$emit(\'connect-wallet\')">Connect</button><button @click="$emit(\'disconnect-wallet\')">Disconnect</button></div>',
          },
          DeploymentConfirmationDialog: {
            template: '<div data-testid="deployment-confirmation-dialog"><button @click="$emit(\'confirm\')">Confirm</button></div>',
            props: ['isOpen', 'tokenName', 'tokenSymbol', 'standard', 'tokenType', 'supply', 'decimals', 'networkDisplayName', 'networkGenesisId', 'isTestnet', 'fees', 'attestationsCount', 'hasComplianceMetadata', 'isDeploying'],
          },
          DeploymentProgressDialog: {
            template: '<div data-testid="deployment-progress-dialog"><button @click="$emit(\'close\')">Close</button></div>',
            props: ['isOpen', 'currentStep', 'status', 'errorMessage', 'errorType', 'transactionId', 'canCancel'],
          },
        },
      },
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render the main layout and header', () => {
      // MainLayout is stubbed, so we check for the slot content
      expect(wrapper!.text()).toContain('Create New Token')
      expect(wrapper!.text()).toContain('Choose a template or token standard')
    })

    it('should render wallet network panel', () => {
      expect(wrapper!.find('[data-testid="wallet-network-panel"]').exists()).toBe(true)
    })

    it('should render compliance checklist component', () => {
      // Initially hidden, so check for the toggle button
      expect(wrapper!.text()).toContain('Compliance Checklist')
      expect(wrapper!.text()).toContain('Show Checklist')
    })

    it('should render RWA preset selector', () => {
      expect(wrapper!.find('[data-testid="rwa-preset-selector"]').exists()).toBe(true)
    })

    it('should render competitor parity checklist', () => {
      // Initially hidden, so check for the toggle button
      expect(wrapper!.text()).toContain('Feature Parity Tracker')
      expect(wrapper!.text()).toContain('Show Parity Checklist')
    })

    it('should render wallet attestation form', () => {
      expect(wrapper!.find('[data-testid="wallet-attestation-form"]').exists()).toBe(true)
    })

    it('should render MICA compliance form', () => {
      expect(wrapper!.find('[data-testid="mica-compliance-form"]').exists()).toBe(true)
    })
  })

  describe('Network Selection', () => {
    it('should display network options', () => {
      const networkButtons = wrapper!.findAll('button').filter(btn =>
        btn.text().includes('VOI Network') || btn.text().includes('Aramid Network')
      )
      expect(networkButtons.length).toBe(2)
    })

    it('should select network when clicked', async () => {
      const voiButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('VOI Network')
      )
      await voiButton?.trigger('click')

      // Network selection should be stored in localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('biatec_selected_network', 'VOI')
    })

    it('should display network guidance when selected', async () => {
      const voiButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('VOI Network')
      )
      await voiButton?.trigger('click')

      // Check if guidance is displayed
      expect(wrapper!.text()).toContain('Fee Structure')
      expect(wrapper!.text()).toContain('Metadata Hosting')
      expect(wrapper!.text()).toContain('MICA Compliance')
    })
  })

  describe('Template Selection', () => {
    it('should display template options', () => {
      const templateButtons = wrapper!.findAll('button').filter(btn =>
        btn.text().includes('Basic Fungible Token') || btn.text().includes('Basic NFT')
      )
      expect(templateButtons.length).toBe(2)
    })

    it('should apply template when clicked', async () => {
      const fungibleButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('Basic Fungible Token')
      )
      await fungibleButton?.trigger('click')

      expect(localStorage.setItem).toHaveBeenCalledWith('biatec_selected_template', 'fungible-basic')
    })

    it('should show template guidance when selected', async () => {
      const fungibleButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('Basic Fungible Token')
      )
      await fungibleButton?.trigger('click')

      expect(wrapper!.text()).toContain('Template Guidance')
      expect(wrapper!.text()).toContain('Perfect for basic token use cases')
    })

    it('should display MICA compliance badge for compliant templates', () => {
      const fungibleTemplate = wrapper!.findAll('button').find(btn =>
        btn.text().includes('Basic Fungible Token')
      )
      expect(fungibleTemplate?.text()).toContain('MICA')
    })
  })

  describe('Token Standard Selection', () => {
    it('should display token standards', () => {
      const standardButtons = wrapper!.findAll('button').filter(btn =>
        btn.text().includes('ASA') && btn.text().includes('Asset') ||
        btn.text().includes('ARC200') && btn.text().includes('Token')
      )
      expect(standardButtons.length).toBe(2)
    })

    it('should select standard when clicked', async () => {
      const asaButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('ASA')
      )
      await asaButton?.trigger('click')

      expect(localStorage.setItem).toHaveBeenCalledWith('biatec_selected_standard', 'ASA')
    })

    it('should show standard details when selected', async () => {
      const asaButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('ASA')
      )
      await asaButton?.trigger('click')

      expect(wrapper!.text()).toContain('About ASA')
      expect(wrapper!.text()).toContain('Algorand Standard Asset')
    })

    it('should show token creation form when standard is selected', async () => {
      const asaButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('ASA')
      )
      await asaButton?.trigger('click')

      expect(wrapper!.text()).toContain('Token Details')
      expect(wrapper!.find('form').exists()).toBe(true)
    })
  })
})
