import { describe, it, expect, afterEach } from 'vitest'
import { generateAlgorandAccount } from '../arc76Account'

describe('arc76Account', () => {
  it('generateAlgorandAccount returns a valid Algorand account', async () => {
    const account = await generateAlgorandAccount('password123', 'user@example.com', 0)
    expect(account).toBeDefined()
    expect(account.addr).toBeTruthy()
    expect(account.sk).toBeDefined()
  })

  it('generateAlgorandAccount is deterministic for same inputs', async () => {
    const account1 = await generateAlgorandAccount('password123', 'user@example.com', 0)
    const account2 = await generateAlgorandAccount('password123', 'user@example.com', 0)
    expect(account1.addr.toString()).toBe(account2.addr.toString())
  })

  it('generateAlgorandAccount produces different accounts for different indices', async () => {
    const account0 = await generateAlgorandAccount('password123', 'user@example.com', 0)
    const account1 = await generateAlgorandAccount('password123', 'user@example.com', 1)
    expect(account0.addr.toString()).not.toBe(account1.addr.toString())
  })

  it('generateAlgorandAccount produces different accounts for different emails', async () => {
    const account1 = await generateAlgorandAccount('password123', 'user1@example.com', 0)
    const account2 = await generateAlgorandAccount('password123', 'user2@example.com', 0)
    expect(account1.addr.toString()).not.toBe(account2.addr.toString())
  })

  it('generateAlgorandAccount produces different accounts for different passwords', async () => {
    const account1 = await generateAlgorandAccount('password1', 'user@example.com', 0)
    const account2 = await generateAlgorandAccount('password2', 'user@example.com', 0)
    expect(account1.addr.toString()).not.toBe(account2.addr.toString())
  })

  it('generateAlgorandAccount returns account with valid address string length', async () => {
    const account = await generateAlgorandAccount('test', 'test@test.com', 0)
    // Algorand addresses are 58 characters
    expect(account.addr.toString().length).toBe(58)
  })

  // getCryptoProvider error branch (line 8 in arc76Account.ts)
  describe('getCryptoProvider — unavailable crypto error branch', () => {
    afterEach(() => {
      // crypto is restored inline in the test
    })

    it('throws when crypto.subtle is not available', async () => {
      // Temporarily mock crypto.subtle as undefined to trigger the error branch
      const originalCrypto = globalThis.crypto
      Object.defineProperty(globalThis, 'crypto', {
        value: { subtle: undefined },
        writable: true,
        configurable: true,
      })

      await expect(
        generateAlgorandAccount('password', 'test@test.com', 0),
      ).rejects.toThrow('Web Crypto API is unavailable')

      // Restore original crypto
      Object.defineProperty(globalThis, 'crypto', {
        value: originalCrypto,
        writable: true,
        configurable: true,
      })
    })
  })
})
