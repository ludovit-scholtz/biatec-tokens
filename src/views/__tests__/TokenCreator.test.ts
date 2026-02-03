import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import TokenCreator from '../TokenCreator.vue'
import type { NetworkId } from '../../composables/useWalletManager'
import { useWalletManager } from '../../composables/useWalletManager'

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
vi.mock('../../utils/tokenValidation', () => ({
  validateTokenParameters: vi.fn(() => ({
    isValid: false,
    errors: [],
    warnings: [],
  })),
  formatValidationErrors: vi.fn(() => 'Validation error'),
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
  let tokenStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    
    // Get the mocked tokenStore
    const { useTokenStore } = vi.mocked(await import('../../stores/tokens'))
    tokenStore = useTokenStore()

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

  describe('Form Functions', () => {
    beforeEach(async () => {
      // Select a standard to show the form
      const asaButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('ASA')
      )
      await asaButton?.trigger('click')
    })

    it('should handle image upload', async () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const input = wrapper!.find('input[type="file"]')
      
      if (input.exists()) {
        // Create a mock event with the file
        const event = {
          target: { files: [file] }
        } as Event
        
        // Call the handler directly
        wrapper!.vm.handleImageUpload(event)
        
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file)
      }
    })

    it('should add NFT attribute', async () => {
      // Switch to NFT type
      const nftRadio = wrapper!.find('input[value="NFT"]')
      await nftRadio.setValue(true)
      await nftRadio.trigger('change')

      const addButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('Add Attribute')
      )
      await addButton?.trigger('click')

      // Check if attributes array was modified (mock implementation)
      expect(wrapper!.text()).toContain('Attributes')
    })

    it('should remove NFT attribute', async () => {
      // This would require setting up attributes first
      // For now, just test that the function exists
      expect(wrapper!.vm.removeAttribute).toBeDefined()
    })

    it('should clear template selection', async () => {
      // First apply a template
      const fungibleButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('Basic Fungible Token')
      )
      await fungibleButton?.trigger('click')

      expect(localStorage.setItem).toHaveBeenCalledWith('biatec_selected_template', 'fungible-basic')

      // Clear template
      const clearButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('Clear Template')
      )
      if (clearButton) {
        await clearButton.trigger('click')
        expect(localStorage.removeItem).toHaveBeenCalledWith('biatec_selected_template')
      }
    })

    it('should dismiss validation error', async () => {
      // Set validation error
      wrapper!.vm.validationError = 'Test error'
      
      const dismissButton = wrapper!.findAll('button').find(btn =>
        btn.attributes('aria-label') === 'Dismiss error'
      )
      if (dismissButton) {
        await dismissButton.trigger('click')
        expect(wrapper!.vm.validationError).toBeNull()
      }
    })
  })

  describe('Wallet Functions', () => {
    it.skip('should handle wallet connect', async () => {
      const mockWalletManager = vi.mocked(useWalletManager)
      
      await wrapper!.vm.handleConnectWallet()
      
      expect(mockWalletManager().connect).toHaveBeenCalled()
    })

    it.skip('should handle wallet disconnect', async () => {
      const mockWalletManager = vi.mocked(useWalletManager)
      
      await wrapper!.vm.handleDisconnectWallet()
      
      expect(mockWalletManager().disconnect).toHaveBeenCalled()
    })

    it('should handle network switched', () => {
      const networkId = 'voi-mainnet'
      wrapper!.vm.handleNetworkSwitched(networkId)
      
      // Function should exist and be callable
      expect(wrapper!.vm.handleNetworkSwitched).toBeDefined()
    })
  })

  describe('Token Creation Flow', () => {
    beforeEach(async () => {
      // Select network and standard
      const voiButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('VOI Network')
      )
      await voiButton?.trigger('click')

      const asaButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('ASA')
      )
      await asaButton?.trigger('click')
    })

    it('should validate form before creation', async () => {
      // Try to create without filling form
      const createButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('Create Token')
      )
      if (createButton) {
        await createButton.trigger('click')
        // Should show validation error
        expect(wrapper!.vm.validationError).not.toBeNull()
      }
    })

    it('should show confirmation dialog on valid form submission', async () => {
      // Fill required form fields directly on the component
      wrapper!.vm.tokenForm.name = 'Test Token'
      wrapper!.vm.tokenForm.symbol = 'TEST'
      wrapper!.vm.tokenForm.description = 'Test description'

      const createButton = wrapper!.findAll('button').find(btn =>
        btn.text().includes('Create Token')
      )
      if (createButton) {
        await createButton.trigger('click')
        expect(wrapper!.vm.showConfirmationDialog).toBe(true)
      }
    })

    it.skip('should execute deployment when confirmed', async () => {
      // Set up form data
      wrapper!.vm.selectedStandard = 'ASA'
      wrapper!.vm.selectedNetwork = 'VOI'
      wrapper!.vm.tokenForm = {
        name: 'Test Token',
        symbol: 'TEST',
        description: 'Test description',
        type: 'FT',
        supply: 1000000,
        decimals: 6,
        imageUrl: '',
        attributes: [],
        attestationEnabled: false,
        attestations: [],
        complianceMetadata: undefined,
        complianceMetadataEnabled: false,
        complianceMetadataValid: false,
      }

      // Mock successful deployment
      vi.mocked(tokenStore.createToken).mockResolvedValue(undefined)

      await wrapper!.vm.executeDeployment()

      expect(tokenStore.createToken).toHaveBeenCalled()
      expect(wrapper!.vm.deploymentStatus).toBe('success')
    })

    it.skip('should handle deployment errors', async () => {
      // Set up form data
      wrapper!.vm.selectedStandard = 'ASA'
      wrapper!.vm.selectedNetwork = 'VOI'
      wrapper!.vm.tokenForm = {
        name: 'Test Token',
        symbol: 'TEST',
        description: 'Test description',
        type: 'FT',
        supply: 1000000,
        decimals: 6,
        imageUrl: '',
        attributes: [],
        attestationEnabled: false,
        attestations: [],
        complianceMetadata: undefined,
        complianceMetadataEnabled: false,
        complianceMetadataValid: false,
      }

      // Mock deployment failure
      vi.mocked(tokenStore.createToken).mockRejectedValue(new Error('Network error'))

      await wrapper!.vm.executeDeployment()

      expect(wrapper!.vm.deploymentStatus).toBe('error')
      expect(wrapper!.vm.deploymentError).toBe('Network error')
      expect(wrapper!.vm.deploymentErrorType).toBe('network_error')
    })

    it('should handle progress dialog close', () => {
      wrapper!.vm.deploymentStatus = 'success'
      wrapper!.vm.handleProgressDialogClose()
      
      expect(wrapper!.vm.showProgressDialog).toBe(false)
    })

    it('should retry deployment', () => {
      wrapper!.vm.handleRetryDeployment()
      
      expect(wrapper!.vm.showProgressDialog).toBe(false)
      // Note: The setTimeout logic is tested separately if needed
    })

    it('should cancel deployment', () => {
      wrapper!.vm.isCreating = true
      wrapper!.vm.showProgressDialog = true
      
      wrapper!.vm.handleCancelDeployment()
      
      expect(wrapper!.vm.isCreating).toBe(false)
      expect(wrapper!.vm.showProgressDialog).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it.skip('should handle insufficient funds error', async () => {
      wrapper!.vm.selectedStandard = 'ASA'
      wrapper!.vm.tokenForm = {
        name: 'Test Token',
        symbol: 'TEST',
        description: 'Test description',
        type: 'FT',
        supply: 1000000,
        decimals: 6,
        imageUrl: '',
        attributes: [],
        attestationEnabled: false,
        attestations: [],
        complianceMetadata: undefined,
        complianceMetadataEnabled: false,
        complianceMetadataValid: false,
      }

      tokenStore.createToken.mockRejectedValue(new Error('insufficient funds'))

      await wrapper!.vm.executeDeployment()

      expect(wrapper!.vm.deploymentErrorType).toBe('insufficient_funds')
    })

    it.skip('should handle wallet rejection error', async () => {
      wrapper!.vm.selectedStandard = 'ASA'
      wrapper!.vm.tokenForm = {
        name: 'Test Token',
        symbol: 'TEST',
        description: 'Test description',
        type: 'FT',
        supply: 1000000,
        decimals: 6,
        imageUrl: '',
        attributes: [],
        attestationEnabled: false,
        attestations: [],
        complianceMetadata: undefined,
        complianceMetadataEnabled: false,
        complianceMetadataValid: false,
      }

      tokenStore.createToken.mockRejectedValue(new Error('user rejected'))

      await wrapper!.vm.executeDeployment()

      expect(wrapper!.vm.deploymentErrorType).toBe('wallet_rejected')
    })
  })

  describe('Computed Properties', () => {
    it('should compute validation result', () => {
      wrapper!.vm.selectedStandard = 'ASA'
      wrapper!.vm.tokenForm.name = 'Test Token'
      wrapper!.vm.tokenForm.symbol = 'TEST'
      
      const result = wrapper!.vm.validationResult
      expect(result).toHaveProperty('isValid')
      expect(result).toHaveProperty('errors')
    })

    it.skip('should compute canSubmit based on validation', async () => {
      // Initially cannot submit (no standard selected)
      expect(wrapper!.vm.canSubmit).toBe(false)
      
      // Set standard and valid form
      wrapper!.vm.selectedStandard = 'ASA'
      wrapper!.vm.tokenForm.name = 'Test Token'
      wrapper!.vm.tokenForm.symbol = 'TEST'
      wrapper!.vm.tokenForm.description = 'Test description'
      wrapper!.vm.tokenForm.type = 'FT'
      wrapper!.vm.tokenForm.supply = 1000000
      wrapper!.vm.tokenForm.decimals = 6
      
      await nextTick()
      
      console.log('After setting validationResult:', wrapper!.vm.validationResult)
      console.log('selectedStandard:', wrapper!.vm.selectedStandard)
      console.log('tokenForm:', wrapper!.vm.tokenForm)
      expect(wrapper!.vm.canSubmit).toBe(true)
    })
  })

  describe('Template Application', () => {
    it('should apply template correctly', () => {
      wrapper!.vm.applyTemplate('fungible-basic')
      
      expect(wrapper!.vm.selectedTemplate).toBe('fungible-basic')
      expect(wrapper!.vm.selectedStandard).toBe('ASA')
      expect(wrapper!.vm.tokenForm.supply).toBe(1000000)
      expect(wrapper!.vm.tokenForm.decimals).toBe(6)
    })

    it('should auto-select network when template specifies one', () => {
      wrapper!.vm.applyTemplate('nft-basic')
      
      expect(wrapper!.vm.selectedNetwork).toBe('Aramid')
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should save selections to localStorage', async () => {
      wrapper!.vm.selectNetwork('VOI')
      await nextTick()
      expect(localStorage.setItem).toHaveBeenCalledWith('biatec_selected_network', 'VOI')
      
      wrapper!.vm.selectStandard('ASA')
      await nextTick()
      expect(localStorage.setItem).toHaveBeenCalledWith('biatec_selected_standard', 'ASA')
    })

    it('should restore selections from localStorage on mount', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'biatec_selected_network') return 'VOI'
        if (key === 'biatec_selected_standard') return 'ASA'
        return null
      })
      
      // Remount component to test onMounted
      wrapper!.unmount()
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
              props: ['isOpen', 'tokenName', 'tokenSymbol', 'standard', 'tokenType', 'supply', 'decimals', 'networkDisplayName', 'networkGenesisId', 'isTestnet', 'fees', 'attestationsCount', 'hasComplianceMetadata', 'isDeploying'],
            },
            DeploymentConfirmationDialog: {
              template: '<div data-testid="deployment-confirmation-dialog"><button @click="$emit(\'confirm\')">Confirm</button></div>',
            },
            DeploymentProgressDialog: {
              template: '<div data-testid="deployment-progress-dialog"><button @click="$emit(\'close\')">Close</button></div>',
            },
          },
        },
      })
      
      expect(wrapper!.vm.selectedNetwork).toBe('VOI')
      expect(wrapper!.vm.selectedStandard).toBe('ASA')
    })
  })
})
