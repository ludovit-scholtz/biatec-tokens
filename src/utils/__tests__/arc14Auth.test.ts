import { describe, it, expect, vi } from 'vitest'
import { makeArc14AuthHeader, makeArc14TxWithSuggestedParams } from '../arc14Auth'

vi.mock('algosdk', async () => {
  const actual = await vi.importActual<typeof import('algosdk')>('algosdk')
  return {
    ...actual,
    default: {
      ...actual.default,
      makePaymentTxnWithSuggestedParamsFromObject: vi.fn(),
    },
  }
})

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

  it('makeArc14AuthHeader produces correct base64 value matching known encoding', () => {
    // [72, 101, 108, 108, 111] = "Hello" in ASCII → base64 "SGVsbG8="
    const bytes = new Uint8Array([72, 101, 108, 108, 111])
    const header = makeArc14AuthHeader(bytes)
    expect(header).toBe('SigTx SGVsbG8=')
  })

  it('makeArc14AuthHeader encodes all-zero bytes correctly', () => {
    const bytes = new Uint8Array([0, 0, 0])
    const header = makeArc14AuthHeader(bytes)
    expect(header).toBe('SigTx AAAA')
  })
})

describe('makeArc14TxWithSuggestedParams', () => {
  it('calls makePaymentTxnWithSuggestedParamsFromObject with correct fields', async () => {
    const algosdk = await import('algosdk')
    const mockFn = algosdk.default
      .makePaymentTxnWithSuggestedParamsFromObject as ReturnType<typeof vi.fn>
    const mockTx = { txID: () => 'mock-txid' }
    mockFn.mockReturnValue(mockTx)

    const params = {
      fee: 1000,
      firstValid: 100,
      lastValid: 200,
      genesisHash: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      genesisID: 'testnet-v1.0',
      minFee: 1000,
    }
    const realm = 'biatec.io'
    const address = 'TESTADDRESS7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

    const result = await makeArc14TxWithSuggestedParams(realm, address, params)

    expect(mockFn).toHaveBeenCalledOnce()
    const callArg = mockFn.mock.calls[0][0]
    expect(callArg.sender).toBe(address)
    expect(callArg.receiver).toBe(address)
    expect(callArg.amount).toBe(0)
    expect(callArg.suggestedParams).toBe(params)
    const expectedNote = new TextEncoder().encode(`ARC14:${realm}:${address}`)
    expect(callArg.note).toEqual(expectedNote)
    expect(result).toBe(mockTx)
  })

  it('embeds the realm and address in the note bytes', async () => {
    const algosdk = await import('algosdk')
    const mockFn = algosdk.default
      .makePaymentTxnWithSuggestedParamsFromObject as ReturnType<typeof vi.fn>
    mockFn.mockReturnValue({})

    const params = {
      fee: 0,
      firstValid: 1,
      lastValid: 1001,
      genesisHash: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      genesisID: 'mainnet-v1.0',
      minFee: 1000,
    }

    await makeArc14TxWithSuggestedParams('example.com', 'ADDR123', params)

    const note = mockFn.mock.calls[mockFn.mock.calls.length - 1][0].note as Uint8Array
    const decoded = new TextDecoder().decode(note)
    expect(decoded).toBe('ARC14:example.com:ADDR123')
  })
})
