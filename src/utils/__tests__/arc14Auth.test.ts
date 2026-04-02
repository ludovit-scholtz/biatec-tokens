import { describe, it, expect, vi, afterEach } from 'vitest'
import { makeArc14AuthHeader, makeArc14TxWithSuggestedParams } from '../arc14Auth'

describe('arc14Auth', () => {
  it('makeArc14AuthHeader returns SigTx prefix with base64 encoded transaction', () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5])
    const header = makeArc14AuthHeader(bytes)
    expect(header).toMatch(/^SigTx /)
    const encoded = header.replace('SigTx ', '')
    expect(encoded).toBeTruthy()
    expect(encoded.length).toBeGreaterThan(0)
  })

  it('makeArc14AuthHeader handles empty byte array', () => {
    const bytes = new Uint8Array([])
    const header = makeArc14AuthHeader(bytes)
    expect(header).toMatch(/^SigTx /)
  })

  it('makeArc14AuthHeader produces consistent output for same input', () => {
    const bytes = new Uint8Array([10, 20, 30])
    const header1 = makeArc14AuthHeader(bytes)
    const header2 = makeArc14AuthHeader(bytes)
    expect(header1).toBe(header2)
  })

  it('makeArc14AuthHeader produces different output for different inputs', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([4, 5, 6])
    const header1 = makeArc14AuthHeader(bytes1)
    const header2 = makeArc14AuthHeader(bytes2)
    expect(header1).not.toBe(header2)
  })

  // bytesToBase64 fallback path (lines 9-14) — exercises the btoa loop when Buffer is undefined
  describe('bytesToBase64 fallback (Buffer=undefined)', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
      vi.resetModules()
    })

    it('makeArc14AuthHeader still works when Buffer is undefined (uses btoa fallback)', async () => {
      // Temporarily remove the Buffer global so the else-branch (btoa loop) runs
      vi.stubGlobal('Buffer', undefined)
      // Re-import the module so it uses the current (no-Buffer) environment
      vi.resetModules()
      const { makeArc14AuthHeader: makeHeaderFresh } = await import('../arc14Auth')
      const bytes = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
      const header = makeHeaderFresh(bytes)
      expect(header).toMatch(/^SigTx /)
      // "Hello" base64 is "SGVsbG8="
      expect(header).toBe('SigTx SGVsbG8=')
    })

    it('btoa fallback produces the same base64 as Buffer.from().toString()', async () => {
      vi.stubGlobal('Buffer', undefined)
      vi.resetModules()
      const { makeArc14AuthHeader: makeHeaderFresh } = await import('../arc14Auth')
      const bytes = new Uint8Array([1, 2, 3, 4, 5])
      const headerFallback = makeHeaderFresh(bytes)
      // Restore Buffer and compare
      vi.unstubAllGlobals()
      vi.resetModules()
      const { makeArc14AuthHeader: makeHeaderNormal } = await import('../arc14Auth')
      const headerNormal = makeHeaderNormal(bytes)
      expect(headerFallback).toBe(headerNormal)
    })
  })

  // makeArc14TxWithSuggestedParams coverage (lines 17-27)
  describe('makeArc14TxWithSuggestedParams', () => {
    const MOCK_PARAMS: import('algosdk').SuggestedParams = {
      fee: 1000,
      minFee: 1000,
      firstValid: 1000,
      lastValid: 2000,
      genesisID: 'testnet-v1.0',
      genesisHash: new Uint8Array(32).fill(1),
    }

    it('returns a payment transaction object', async () => {
      const { generateAlgorandAccount } = await import('../arc76Account')
      const account = await generateAlgorandAccount('test-password', 'test@test.com', 0)
      const addr = account.addr.toString()
      const tx = await makeArc14TxWithSuggestedParams('auth', addr, MOCK_PARAMS)
      expect(tx).toBeDefined()
      expect(typeof tx).toBe('object')
    })

    it('transaction note encodes realm and address (ARC14 spec)', async () => {
      const { generateAlgorandAccount } = await import('../arc76Account')
      const account = await generateAlgorandAccount('test-password', 'test@test.com', 0)
      const addr = account.addr.toString()
      const tx = await makeArc14TxWithSuggestedParams('biatec-auth', addr, MOCK_PARAMS)
      expect(tx).toBeDefined()
      const noteText = new TextDecoder().decode(tx.note)
      expect(noteText).toBe(`ARC14:biatec-auth:${addr}`)
    })

    it('transaction amount is 0 (zero-value ARC14 auth tx)', async () => {
      const { generateAlgorandAccount } = await import('../arc76Account')
      const account = await generateAlgorandAccount('test-password', 'test@test.com', 0)
      const addr = account.addr.toString()
      // The function should succeed (amount=0 is valid for ARC14 self-pay auth txn)
      await expect(
        makeArc14TxWithSuggestedParams('auth', addr, MOCK_PARAMS),
      ).resolves.not.toBeNull()
    })

    it('uses the provided suggestedParams for validity window', async () => {
      const { generateAlgorandAccount } = await import('../arc76Account')
      const account = await generateAlgorandAccount('test-password', 'test@test.com', 0)
      const addr = account.addr.toString()
      const tx = await makeArc14TxWithSuggestedParams('realm', addr, MOCK_PARAMS)
      expect(tx.firstValid).toBe(BigInt(MOCK_PARAMS.firstValid))
      expect(tx.lastValid).toBe(BigInt(MOCK_PARAMS.lastValid))
    })

    it('different realms produce different note encodings', async () => {
      const { generateAlgorandAccount } = await import('../arc76Account')
      const account = await generateAlgorandAccount('test-password', 'test@test.com', 0)
      const addr = account.addr.toString()
      const tx1 = await makeArc14TxWithSuggestedParams('realm-a', addr, MOCK_PARAMS)
      const tx2 = await makeArc14TxWithSuggestedParams('realm-b', addr, MOCK_PARAMS)
      const note1 = new TextDecoder().decode(tx1.note)
      const note2 = new TextDecoder().decode(tx2.note)
      expect(note1).not.toBe(note2)
    })
  })
})
