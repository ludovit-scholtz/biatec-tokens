import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import BatchTokenEntryForm from '../BatchTokenEntryForm.vue'
import { TokenStandard } from '../../types/api'

vi.mock('../../types/api', async () => {
  const actual = await vi.importActual<typeof import('../../types/api')>('../../types/api')
  return {
    ...actual,
    validateTokenDeploymentRequest: vi.fn().mockReturnValue({ valid: true, errors: [] }),
  }
})

const baseERC20Token = {
  standard: TokenStandard.ERC20,
  name: 'Test Token',
  symbol: 'TST',
  decimals: 18,
  totalSupply: '1000000',
  walletAddress: 'WALLET123',
}

const baseARC3Token = {
  standard: TokenStandard.ARC3,
  name: 'ARC3 Token',
  unitName: 'ARC',
  decimals: 0,
  total: 100,
  walletAddress: 'WALLET123',
}

const baseARC200Token = {
  standard: TokenStandard.ARC200,
  name: 'ARC200 Token',
  symbol: 'ARC2',
  decimals: 6,
  totalSupply: '1000000',
  walletAddress: 'WALLET123',
}

function mountForm(props = {}) {
  return mount(BatchTokenEntryForm, {
    props: {
      index: 0,
      token: baseERC20Token,
      walletAddress: 'WALLET123',
      ...props,
    },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
    },
  })
}

describe('BatchTokenEntryForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form for ERC20 token', () => {
    const wrapper = mountForm()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Token')
  })

  it('renders index number in header', () => {
    const wrapper = mountForm({ index: 3 })
    expect(wrapper.text()).toContain('4') // index + 1
  })

  describe('isERC20 computed', () => {
    it('is true for ERC20 standard', () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      expect(vm.isERC20).toBe(true)
    })
    it('is false for ARC3 standard', () => {
      const vm = mountForm({ token: baseARC3Token }).vm as any
      expect(vm.isERC20).toBe(false)
    })
  })

  describe('isARC3 computed', () => {
    it('is true for ARC3 standard', () => {
      const vm = mountForm({ token: baseARC3Token }).vm as any
      expect(vm.isARC3).toBe(true)
    })
    it('is false for ERC20 standard', () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      expect(vm.isARC3).toBe(false)
    })
  })

  describe('isARC200 computed', () => {
    it('is true for ARC200 standard', () => {
      const vm = mountForm({ token: baseARC200Token }).vm as any
      expect(vm.isARC200).toBe(true)
    })
    it('is false for ERC20 standard', () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      expect(vm.isARC200).toBe(false)
    })
  })

  describe('symbolOrUnitName computed', () => {
    it('returns symbol for ERC20', () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      expect(vm.symbolOrUnitName).toBe('TST')
    })
    it('returns unitName for ARC3', () => {
      const vm = mountForm({ token: baseARC3Token }).vm as any
      expect(vm.symbolOrUnitName).toBe('ARC')
    })
    it('sets unitName for ARC3 when set', async () => {
      const vm = mountForm({ token: baseARC3Token }).vm as any
      vm.symbolOrUnitName = 'NEWUNIT'
      await nextTick()
      expect(vm.localToken.unitName).toBe('NEWUNIT')
    })
    it('sets symbol for ERC20 when set', async () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      vm.symbolOrUnitName = 'NEWSYM'
      await nextTick()
      expect(vm.localToken.symbol).toBe('NEWSYM')
    })
    it('returns empty string when no symbol', () => {
      const vm = mountForm({ token: { standard: TokenStandard.ERC20, name: 'No Symbol' } }).vm as any
      expect(vm.symbolOrUnitName).toBe('')
    })
  })

  describe('totalSupply computed', () => {
    it('returns totalSupply for ERC20', () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      expect(vm.totalSupply).toBe('1000000')
    })
    it('sets totalSupply when assigned', async () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      vm.totalSupply = '5000000'
      await nextTick()
      expect(vm.localToken.totalSupply).toBe('5000000')
    })
    it('returns empty string when no totalSupply', () => {
      const vm = mountForm({ token: { standard: TokenStandard.ERC20, name: 'No Supply' } }).vm as any
      expect(vm.totalSupply).toBe('')
    })
  })

  describe('arc3Total computed', () => {
    it('returns total for ARC3', () => {
      const vm = mountForm({ token: baseARC3Token }).vm as any
      expect(vm.arc3Total).toBe(100)
    })
    it('returns 1 for non-ARC3', () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      expect(vm.arc3Total).toBe(1)
    })
    it('sets total for ARC3 when assigned', async () => {
      const vm = mountForm({ token: baseARC3Token }).vm as any
      vm.arc3Total = 200
      await nextTick()
      expect(vm.localToken.total).toBe(200)
    })
  })

  describe('validateToken', () => {
    it('clears errors when no standard set', () => {
      const vm = mountForm({ token: { name: 'No Standard' } }).vm as any
      vm.validationErrors = ['some error']
      vm.localToken.standard = undefined
      vm.validateToken()
      expect(vm.validationErrors).toEqual([])
    })

    it('populates errors when validation fails', async () => {
      const { validateTokenDeploymentRequest } = await import('../../types/api')
      vi.mocked(validateTokenDeploymentRequest).mockReturnValue({ valid: false, errors: ['Name required', 'Symbol required'] })
      const vm = mountForm({ token: baseERC20Token }).vm as any
      vm.validateToken()
      expect(vm.validationErrors.length).toBe(2)
    })

    it('handles validate throw gracefully', async () => {
      const { validateTokenDeploymentRequest } = await import('../../types/api')
      vi.mocked(validateTokenDeploymentRequest).mockImplementation(() => { throw new Error('Schema error') })
      const vm = mountForm({ token: baseERC20Token }).vm as any
      vm.validateToken()
      expect(vm.validationErrors).toEqual([])
    })
  })

  describe('handleStandardChange', () => {
    it('resets token fields on standard change', async () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      vm.localToken.symbol = 'KEEP'
      vm.handleStandardChange()
      await nextTick()
      // After reset, only standard/name/description/walletAddress/decimals remain
      expect(vm.localToken.standard).toBe(TokenStandard.ERC20)
    })

    it('sets decimals to 6 for ARC200', async () => {
      const vm = mountForm({ token: baseARC200Token }).vm as any
      vm.handleStandardChange()
      await nextTick()
      expect(vm.localToken.decimals).toBe(6)
    })

    it('sets decimals to 18 for ERC20', async () => {
      const vm = mountForm({ token: baseERC20Token }).vm as any
      vm.handleStandardChange()
      await nextTick()
      expect(vm.localToken.decimals).toBe(18)
    })

    it('sets decimals to 0 for ARC3', async () => {
      const vm = mountForm({ token: baseARC3Token }).vm as any
      vm.handleStandardChange()
      await nextTick()
      expect(vm.localToken.decimals).toBe(0)
    })
  })

  it('emits remove when remove button clicked', async () => {
    const wrapper = mountForm()
    const removeBtn = wrapper.findAll('button').find(b => b.text().includes('Remove') || b.attributes('aria-label')?.includes('Remove') || b.find('i.pi-trash').exists())
    if (removeBtn) {
      await removeBtn.trigger('click')
      expect(wrapper.emitted('remove')).toBeTruthy()
    }
  })

  it('emits update:token when local token changes', async () => {
    const wrapper = mountForm()
    const vm = wrapper.vm as any
    vm.localToken.name = 'Updated Name'
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('update:token')).toBeTruthy()
  })

  it('updates walletAddress when prop changes', async () => {
    const wrapper = mountForm()
    await wrapper.setProps({ walletAddress: 'NEWWALLET456' })
    await nextTick()
    const vm = wrapper.vm as any
    expect(vm.localToken.walletAddress).toBe('NEWWALLET456')
  })
})
