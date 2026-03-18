/**
 * Unit Tests: Settings — Logic Coverage
 *
 * Covers the 4 script-setup functions in Settings.vue that have no test coverage:
 *  - testConnection: simulates algod connectivity check (success + failure paths)
 *  - exportSettings: triggers JSON blob download via anchor click
 *  - importSettings: reads a File via FileReader and delegates to the store
 *  - saveSettings: persists custom headers JSON to the current network config
 *
 * Coverage target: raise Settings.vue function coverage from 20% → 80%+
 *
 * Roadmap: https://raw.githubusercontent.com/scholtz/biatec-tokens/refs/heads/main/business-owner-roadmap.md
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import Settings from '../Settings.vue'
import { useSettingsStore } from '../../stores/settings'

// ── Helpers ────────────────────────────────────────────────────────────────

const makeRouter = () =>
  createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: { template: '<div />' } },
      { path: '/settings', name: 'Settings', component: { template: '<div />' } },
    ],
  })

const mountSettings = (storeOverrides: Record<string, unknown> = {}) => {
  const router = makeRouter()
  return mount(Settings, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            settings: {
              settings: {
                network: 'testnet',
                networkConfigs: {
                  testnet: {
                    algodUrl: 'https://testnet-api.algonode.cloud',
                    algodToken: '',
                    indexerUrl: 'https://testnet-idx.algonode.cloud',
                    indexerToken: '',
                  },
                  mainnet: {
                    algodUrl: 'https://mainnet-api.algonode.cloud',
                    algodToken: '',
                    indexerUrl: 'https://mainnet-idx.algonode.cloud',
                    indexerToken: '',
                  },
                  dockernet: {
                    algodUrl: 'http://localhost:4001',
                    algodToken: 'test-token',
                    indexerUrl: 'http://localhost:8980',
                    indexerToken: 'test-token',
                  },
                },
                evmRpcUrl: 'https://example.rpc',
                evmChainId: 11155111,
                demoMode: false,
              },
              ...storeOverrides,
            },
          },
        }),
        router,
      ],
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        Navbar: { template: '<nav aria-label="Main navigation"></nav>' },
        Sidebar: { template: '<aside></aside>' },
      },
    },
  })
}

// ── testConnection ─────────────────────────────────────────────────────────

describe('Settings — testConnection', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('sets isTestingConnection to true while test is in flight', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9) // > 0.3 → success path
    const wrapper = mountSettings()
    const vm = wrapper.vm as any

    // Start the test — don't await it yet
    const testPromise = vm.testConnection()

    // isTestingConnection should be true immediately
    expect(vm.isTestingConnection).toBe(true)

    // Advance the fake timer by 2000ms (the setTimeout inside testConnection)
    await vi.advanceTimersByTimeAsync(2000)
    await testPromise

    expect(vm.isTestingConnection).toBe(false)
  })

  it('sets connectionStatus.success=true when Math.random > 0.3', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9) // > 0.3 → success
    const wrapper = mountSettings()
    const vm = wrapper.vm as any

    const testPromise = vm.testConnection()
    await vi.advanceTimersByTimeAsync(2000)
    await testPromise

    expect(vm.connectionStatus).not.toBeNull()
    expect(vm.connectionStatus!.success).toBe(true)
    expect(vm.connectionStatus!.message).toMatch(/successful/i)
  })

  it('sets connectionStatus.success=false when Math.random <= 0.3', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1) // <= 0.3 → failure
    const wrapper = mountSettings()
    const vm = wrapper.vm as any

    const testPromise = vm.testConnection()
    await vi.advanceTimersByTimeAsync(2000)
    await testPromise

    expect(vm.connectionStatus).not.toBeNull()
    expect(vm.connectionStatus!.success).toBe(false)
    expect(vm.connectionStatus!.message).toMatch(/failed/i)
  })

  it('resets connectionStatus to null when called again', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9)
    const wrapper = mountSettings()
    const vm = wrapper.vm as any

    // First call
    let p = vm.testConnection()
    await vi.advanceTimersByTimeAsync(2000)
    await p
    expect(vm.connectionStatus).not.toBeNull()

    // Second call — connectionStatus should reset to null during the pending phase
    p = vm.testConnection()
    // connectionStatus is set to null at the START of testConnection
    expect(vm.connectionStatus).toBeNull()
    await vi.advanceTimersByTimeAsync(2000)
    await p
  })
})

// ── exportSettings ─────────────────────────────────────────────────────────

describe('Settings — exportSettings', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates an object URL and triggers a download anchor click', () => {
    const mockUrl = 'blob:mock-url'
    const clickSpy = vi.fn()
    const revokeSpy = vi.fn()

    // Stub browser APIs not available in happy-dom
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue(mockUrl),
      revokeObjectURL: revokeSpy,
    })

    // Intercept anchor creation so we can capture its click
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        const anchor = originalCreateElement('a')
        anchor.click = clickSpy
        return anchor
      }
      return originalCreateElement(tag)
    })

    const wrapper = mountSettings()
    const vm = wrapper.vm as any

    vm.exportSettings()

    expect(URL.createObjectURL).toHaveBeenCalledOnce()
    expect(clickSpy).toHaveBeenCalledOnce()
    expect(revokeSpy).toHaveBeenCalledWith(mockUrl)
  })

  it('sets download attribute to biatec-tokens-settings.json', () => {
    const mockUrl = 'blob:mock-url'
    let capturedAnchor: HTMLAnchorElement | null = null

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue(mockUrl),
      revokeObjectURL: vi.fn(),
    })

    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        const anchor = originalCreateElement('a')
        anchor.click = vi.fn()
        capturedAnchor = anchor
        return anchor
      }
      return originalCreateElement(tag)
    })

    const wrapper = mountSettings()
    const vm = wrapper.vm as any
    vm.exportSettings()

    expect(capturedAnchor).not.toBeNull()
    expect(capturedAnchor!.download).toBe('biatec-tokens-settings.json')
  })
})

// ── importSettings ─────────────────────────────────────────────────────────

describe('Settings — importSettings', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does nothing when no file is selected (empty FileList)', async () => {
    mountSettings() // ensures pinia is active for useSettingsStore()
    const store = useSettingsStore()

    // Simulate event with no file — importSettings should return early without
    // calling the store
    // We call the component function directly via a fresh instance
    const wrapper = mountSettings()
    const vm = wrapper.vm as any
    const event = { target: { files: null } } as unknown as Event
    vm.importSettings(event)

    // Store should NOT have been called when no file was selected
    expect(store.importSettings).not.toHaveBeenCalled()
  })

  it('calls store.importSettings with file content on successful read', async () => {
    const wrapper = mountSettings()
    const store = useSettingsStore()
    // Make the testing-pinia stub return `true` (success) so the success branch fires
    ;(store.importSettings as ReturnType<typeof vi.fn>).mockReturnValue(true)

    const vm = wrapper.vm as any
    const fileContent = JSON.stringify({ network: 'mainnet' })
    const mockFile = new File([fileContent], 'settings.json', { type: 'application/json' })

    // Capture the FileReader onload callback
    let capturedOnload: ((e: ProgressEvent<FileReader>) => void) | null = null
    class MockFileReader {
      onload: ((e: ProgressEvent<FileReader>) => void) | null = null
      readAsText(_file: File) { capturedOnload = this.onload }
    }
    vi.stubGlobal('FileReader', MockFileReader)

    const event = { target: { files: [mockFile] } } as unknown as Event
    vm.importSettings(event)

    // Simulate the FileReader completing the read
    expect(capturedOnload).not.toBeNull()
    capturedOnload!({ target: { result: fileContent } } as unknown as ProgressEvent<FileReader>)

    // The store's importSettings should have been invoked with the raw JSON string
    expect(store.importSettings).toHaveBeenCalledWith(fileContent)
    // Success branch: console.log is called
    expect(console.log).toHaveBeenCalledWith('Settings imported successfully')
  })
})

// ── saveSettings ──────────────────────────────────────────────────────────

describe('Settings — saveSettings', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('saves settings without custom headers (empty string)', () => {
    const wrapper = mountSettings()
    const vm = wrapper.vm as any

    // Default: customHeaders is ''
    expect(vm.customHeaders).toBe('')
    vm.saveSettings()

    // Verify console.log called with success message
    expect(console.log).toHaveBeenCalledWith('Settings saved successfully')
  })

  it('parses valid JSON custom headers and assigns to currentNetworkConfig', () => {
    const wrapper = mountSettings()
    const vm = wrapper.vm as any

    vm.customHeaders = '{"X-Custom-Header": "my-value"}'
    vm.saveSettings()

    expect(vm.currentNetworkConfig.headers).toEqual({ 'X-Custom-Header': 'my-value' })
    expect(console.log).toHaveBeenCalledWith('Settings saved successfully')
  })

  it('logs error for invalid JSON in custom headers and still saves', () => {
    const wrapper = mountSettings()
    const vm = wrapper.vm as any

    vm.customHeaders = 'NOT_VALID_JSON'
    vm.saveSettings()

    expect(console.error).toHaveBeenCalledWith('Invalid JSON in custom headers:', expect.any(SyntaxError))
    // Still saves (no throw)
    expect(console.log).toHaveBeenCalledWith('Settings saved successfully')
  })

  it('saves empty object headers when customHeaders is a valid empty object', () => {
    const wrapper = mountSettings()
    const vm = wrapper.vm as any

    vm.customHeaders = '{}'
    vm.saveSettings()

    expect(vm.currentNetworkConfig.headers).toEqual({})
  })
})
