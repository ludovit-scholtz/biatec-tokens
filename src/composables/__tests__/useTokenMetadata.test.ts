import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// ─── hoisted mocks ────────────────────────────────────────────────────────────
const mockDo = vi.hoisted(() => vi.fn())
const mockGetAssetByID = vi.hoisted(() => vi.fn(() => ({ do: mockDo })))
const MockAlgodv2Class = vi.hoisted(() =>
  vi.fn(function () {
    return { getAssetByID: mockGetAssetByID }
  }),
)

vi.mock('algosdk', () => ({
  default: { Algodv2: MockAlgodv2Class },
}))

const mockAxiosGet = vi.hoisted(() => vi.fn())
vi.mock('axios', () => ({ default: { get: mockAxiosGet } }))

const mockNetworkStore = vi.hoisted(() => ({
  networkInfo: {
    id: 'algorand-mainnet',
    displayName: 'Algorand Mainnet',
    isTestnet: false,
    chainType: 'AVM',
    algodUrl: 'https://algod.example.com',
  } as any,
}))
vi.mock('../../stores/network', () => ({
  useNetworkStore: () => mockNetworkStore,
}))

import { useTokenMetadata } from '../useTokenMetadata'

const BASE_PARAMS = {
  name: 'My Token',
  unitName: 'MTK',
  decimals: 6,
  total: 1000000,
  creator: 'CREATOR_ADDR',
  url: '',
  freeze: null,
  clawback: null,
}

function makeAlgodReturn(params: any) {
  mockDo.mockResolvedValue({ params })
}

describe('useTokenMetadata', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockNetworkStore.networkInfo = {
      id: 'algorand-mainnet',
      displayName: 'Algorand Mainnet',
      isTestnet: false,
      chainType: 'AVM',
      algodUrl: 'https://algod.example.com',
    }
    // Re-apply implementations after clearAllMocks.
    // MUST use regular functions (not arrow functions) for MockAlgodv2Class
    // because vitest v4 uses Reflect.construct when calling `new vi.fn()`,
    // and arrow functions cannot be constructors.
    MockAlgodv2Class.mockImplementation(function () {
      return { getAssetByID: mockGetAssetByID }
    })
    mockGetAssetByID.mockImplementation(function () {
      return { do: mockDo }
    })
    makeAlgodReturn({ ...BASE_PARAMS })
  })

  describe('getVerificationBadge', () => {
    it('returns green label for ARC3', () => {
      expect(useTokenMetadata().getVerificationBadge('ARC3')).toEqual({ color: 'green', label: 'ARC3 Verified' })
    })

    it('returns blue label for ARC19', () => {
      expect(useTokenMetadata().getVerificationBadge('ARC19')).toEqual({ color: 'blue', label: 'ARC19' })
    })

    it('returns gray label for ASA', () => {
      expect(useTokenMetadata().getVerificationBadge('ASA')).toEqual({ color: 'gray', label: 'Standard ASA' })
    })

    it('returns gray label for unknown standard', () => {
      expect(useTokenMetadata().getVerificationBadge('')).toEqual({ color: 'gray', label: 'Standard ASA' })
    })
  })

  describe('clearCache', () => {
    it('clears all entries from the metadata cache', async () => {
      const { fetchMetadata, metadataCache, clearCache } = useTokenMetadata()
      await fetchMetadata(12345)
      expect(metadataCache.value.size).toBe(1)
      clearCache()
      expect(metadataCache.value.size).toBe(0)
    })
  })

  describe('fetchMetadata — standard ASA', () => {
    it('fetches and returns asset metadata', async () => {
      const meta = await useTokenMetadata().fetchMetadata(100)
      expect(meta.assetId).toBe(100)
      expect(meta.isLoading).toBe(false)
      expect(meta.standard).toBe('ASA')
    })

    it('caches result after fetching', async () => {
      const { fetchMetadata, metadataCache } = useTokenMetadata()
      await fetchMetadata(200)
      expect(metadataCache.value.has(200)).toBe(true)
    })

    it('does not call algod again for cached item', async () => {
      const { fetchMetadata } = useTokenMetadata()
      await fetchMetadata(300)
      const calls = mockGetAssetByID.mock.calls.length
      await fetchMetadata(300)
      expect(mockGetAssetByID.mock.calls.length).toBe(calls)
    })

    it('sets creator from params', async () => {
      const meta = await useTokenMetadata().fetchMetadata(400)
      expect(meta.creator).toBe('CREATOR_ADDR')
    })

    it('sets total from params', async () => {
      const meta = await useTokenMetadata().fetchMetadata(500)
      expect(meta.total).toBe(1000000)
    })

    it('sets isVerified false for plain ASA', async () => {
      const meta = await useTokenMetadata().fetchMetadata(600)
      expect(meta.isVerified).toBe(false)
    })
  })

  describe('fetchMetadata — ARC3 standard', () => {
    beforeEach(() => {
      makeAlgodReturn({ ...BASE_PARAMS, url: 'https://example.com/metadata.json#arc3' })
      mockAxiosGet.mockResolvedValue({ data: { name: 'ARC3 Meta', description: 'desc', properties: {} } })
    })

    it('identifies ARC3 standard from #arc3 suffix', async () => {
      const meta = await useTokenMetadata().fetchMetadata(1001)
      expect(meta.standard).toBe('ARC3')
    })

    it('fetches ARC3 metadata via axios', async () => {
      await useTokenMetadata().fetchMetadata(1002)
      expect(mockAxiosGet).toHaveBeenCalled()
    })

    it('uses ARC3 metadata name', async () => {
      const meta = await useTokenMetadata().fetchMetadata(1003)
      expect(meta.name).toBe('ARC3 Meta')
    })

    it('sets isVerified when ARC3 metadata is present', async () => {
      const meta = await useTokenMetadata().fetchMetadata(1004)
      expect(meta.isVerified).toBe(true)
    })

    it('handles ARC3 metadata fetch failure gracefully', async () => {
      mockAxiosGet.mockRejectedValue(new Error('IPFS timeout'))
      const meta = await useTokenMetadata().fetchMetadata(1005)
      expect(meta.standard).toBe('ARC3')
      expect(meta.isLoading).toBe(false)
    })
  })

  describe('fetchMetadata — ARC19 standard', () => {
    it('identifies ARC19 from template-ipfs:// URL', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, url: 'template-ipfs://Qm.../metadata.json' })
      const meta = await useTokenMetadata().fetchMetadata(2001)
      expect(meta.standard).toBe('ARC19')
    })
  })

  describe('fetchMetadata — compliance flags', () => {
    it('sets transferRestricted when freeze is present', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, freeze: 'FREEZE_ADDR', clawback: null })
      const meta = await useTokenMetadata().fetchMetadata(3001)
      expect(meta.complianceFlags?.transferRestricted).toBe(true)
    })

    it('sets whitelistRequired when freeze is present', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, freeze: 'FREEZE_ADDR', clawback: null })
      const meta = await useTokenMetadata().fetchMetadata(3002)
      expect(meta.complianceFlags?.whitelistRequired).toBe(true)
    })

    it('sets no compliance notes when no freeze or clawback', async () => {
      const meta = await useTokenMetadata().fetchMetadata(3003)
      expect(meta.complianceFlags?.notes).toBeUndefined()
    })

    it('sets compliance notes when freeze is present', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, freeze: 'FREEZE_ADDR', clawback: null })
      const meta = await useTokenMetadata().fetchMetadata(3004)
      expect(meta.complianceFlags?.notes).toBeTruthy()
    })

    it('sets jurisdictionRestricted when clawback + compliance keywords in description', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, url: 'https://example.com/meta.json#arc3', clawback: 'CLAWBACK_ADDR', freeze: null })
      mockAxiosGet.mockResolvedValue({
        data: { name: 'Regulated', description: 'mica compliant kyc whitelist token', properties: {} },
      })
      const meta = await useTokenMetadata().fetchMetadata(3005)
      expect(meta.complianceFlags?.jurisdictionRestricted).toBe(true)
    })

    it('sets micaReady via explicit micaCompliant property', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, url: 'https://example.com/meta.json#arc3', freeze: 'F', clawback: 'C' })
      mockAxiosGet.mockResolvedValue({
        data: { name: 'MICA', description: '', properties: { micaCompliant: true } },
      })
      const meta = await useTokenMetadata().fetchMetadata(3006)
      expect(meta.complianceFlags?.micaReady).toBe(true)
    })

    it('sets kycRequired via explicit kycRequired property', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, url: 'https://example.com/meta.json#arc3', freeze: null, clawback: null })
      mockAxiosGet.mockResolvedValue({
        data: { name: 'KYC', description: '', properties: { kycRequired: true } },
      })
      const meta = await useTokenMetadata().fetchMetadata(3007)
      expect(meta.complianceFlags?.kycRequired).toBe(true)
    })

    it('sets whitelistRequired via explicit property', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, url: 'https://example.com/meta.json#arc3', freeze: null, clawback: null })
      mockAxiosGet.mockResolvedValue({
        data: { name: 'WL', description: '', properties: { whitelistRequired: true } },
      })
      const meta = await useTokenMetadata().fetchMetadata(3008)
      expect(meta.complianceFlags?.whitelistRequired).toBe(true)
    })

    it('supports kyc_required snake_case', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, url: 'https://example.com/meta.json#arc3', freeze: null, clawback: null })
      mockAxiosGet.mockResolvedValue({
        data: { name: 'KYC2', description: '', properties: { kyc_required: true } },
      })
      const meta = await useTokenMetadata().fetchMetadata(3009)
      expect(meta.complianceFlags?.kycRequired).toBe(true)
    })

    it('supports mica_compliant snake_case', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, url: 'https://example.com/meta.json#arc3', freeze: 'F', clawback: 'C' })
      mockAxiosGet.mockResolvedValue({
        data: { name: 'MICA2', description: '', properties: { mica_compliant: true } },
      })
      const meta = await useTokenMetadata().fetchMetadata(3010)
      expect(meta.complianceFlags?.micaReady).toBe(true)
    })
  })

  describe('fetchMetadata — error handling', () => {
    it('returns error metadata when algod call fails', async () => {
      mockDo.mockRejectedValue(new Error('Asset not found'))
      const meta = await useTokenMetadata().fetchMetadata(9001)
      expect(meta.error).toBe('Asset not found')
      expect(meta.isLoading).toBe(false)
      expect(meta.isVerified).toBe(false)
    })

    it('returns error metadata when network is EVM (not AVM)', async () => {
      mockNetworkStore.networkInfo = { ...mockNetworkStore.networkInfo, chainType: 'EVM' }
      const meta = await useTokenMetadata().fetchMetadata(9002)
      expect(meta.error).toContain('AVM')
    })

    it('returns error metadata when networkInfo is null', async () => {
      mockNetworkStore.networkInfo = null
      const meta = await useTokenMetadata().fetchMetadata(9003)
      expect(meta.error).toContain('Network information')
    })
  })

  describe('getMetadata', () => {
    it('fetches when not cached', async () => {
      const meta = await useTokenMetadata().getMetadata(5001)
      expect(meta.assetId).toBe(5001)
    })

    it('uses cache on second call without error', async () => {
      const { getMetadata } = useTokenMetadata()
      await getMetadata(5001)
      const calls = mockGetAssetByID.mock.calls.length
      await getMetadata(5001)
      expect(mockGetAssetByID.mock.calls.length).toBe(calls)
    })

    it('returns cached error on subsequent call (fetchMetadata always returns cache)', async () => {
      // getMetadata calls fetchMetadata again when error is cached, but fetchMetadata
      // itself returns the cached entry regardless of error state, so the error persists.
      const { getMetadata } = useTokenMetadata()
      mockDo.mockRejectedValueOnce(new Error('temp error'))
      const meta1 = await getMetadata(5002)
      expect(meta1.error).toBe('temp error')
      const meta2 = await getMetadata(5002)
      expect(meta2.error).toBe('temp error')
    })
  })

  describe('fetchBatchMetadata', () => {
    it('returns empty array for empty input', async () => {
      const results = await useTokenMetadata().fetchBatchMetadata([])
      expect(results).toHaveLength(0)
    })

    it('fetches metadata for multiple asset IDs', async () => {
      const results = await useTokenMetadata().fetchBatchMetadata([100, 101])
      expect(results).toHaveLength(2)
    })
  })

  describe('resolveIpfsUrl', () => {
    it('converts ipfs:// URLs to HTTPS gateway', async () => {
      makeAlgodReturn({ ...BASE_PARAMS, url: 'ipfs://QmTestCID/metadata.json#arc3' })
      mockAxiosGet.mockResolvedValue({ data: { name: 'IPFS Meta', properties: {} } })
      await useTokenMetadata().fetchMetadata(6001)
      const calledUrl = mockAxiosGet.mock.calls[0][0]
      expect(calledUrl).toContain('QmTestCID')
      expect(calledUrl).not.toMatch(/^ipfs:\/\//)
    })
  })
})
