/**
 * Tests for Tooltip.vue (ui component)
 * Covers: showTooltip (delayed visibility + position calc), hideTooltip, positionClass, arrowClass, onUnmounted
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Tooltip from '../Tooltip.vue'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const mountTooltip = (props = {}) =>
  mount(Tooltip, {
    props: {
      content: 'Tooltip content',
      position: 'top',
      delay: 0,
      maxWidth: '200px',
      ...props,
    },
    slots: {
      default: '<button>Hover me</button>',
    },
  })

describe('Tooltip — positionClass and arrowClass', () => {
  it('positionClass returns tooltip-{position}', () => {
    const wrapper = mountTooltip({ position: 'bottom' })
    const vm = wrapper.vm as any
    expect(vm.positionClass).toBe('tooltip-bottom')
  })

  it('arrowClass returns arrow-{position}', () => {
    const wrapper = mountTooltip({ position: 'left' })
    const vm = wrapper.vm as any
    expect(vm.arrowClass).toBe('arrow-left')
  })
})

describe('Tooltip — showTooltip / hideTooltip', () => {
  it('visible is false by default', () => {
    const wrapper = mountTooltip()
    const vm = wrapper.vm as any
    expect(vm.visible).toBe(false)
  })

  it('showTooltip sets visible=true after delay', async () => {
    vi.useFakeTimers()
    const wrapper = mountTooltip({ delay: 100 })
    const vm = wrapper.vm as any
    const trigger = wrapper.find('.tooltip-container')
    // Mock getBoundingClientRect to prevent test-env null ref error
    const mockElement = { getBoundingClientRect: () => ({ top: 100, bottom: 120, left: 50, right: 200, width: 150, height: 20 }) }
    const mouseEvent = new MouseEvent('mouseenter')
    Object.defineProperty(mouseEvent, 'currentTarget', { get: () => mockElement })
    vm.showTooltip(mouseEvent)
    expect(vm.visible).toBe(false) // not yet (delay=100)
    vi.advanceTimersByTime(150)
    await nextTick()
    expect(vm.visible).toBe(true)
  })

  it('hideTooltip sets visible=false', async () => {
    vi.useFakeTimers()
    const wrapper = mountTooltip({ delay: 0 })
    const vm = wrapper.vm as any
    const mockElement = { getBoundingClientRect: () => ({ top: 100, bottom: 120, left: 50, right: 200, width: 150, height: 20 }) }
    const mouseEvent = new MouseEvent('mouseenter')
    Object.defineProperty(mouseEvent, 'currentTarget', { get: () => mockElement })
    vm.showTooltip(mouseEvent)
    vi.runAllTimers()
    await nextTick()
    vm.hideTooltip()
    await nextTick()
    expect(vm.visible).toBe(false)
  })

  it('hideTooltip clears pending timer before tooltip shows', async () => {
    vi.useFakeTimers()
    const wrapper = mountTooltip({ delay: 500 })
    const vm = wrapper.vm as any
    const mockElement = { getBoundingClientRect: () => ({ top: 0, bottom: 20, left: 0, right: 100, width: 100, height: 20 }) }
    const mouseEvent = new MouseEvent('mouseenter')
    Object.defineProperty(mouseEvent, 'currentTarget', { get: () => mockElement })
    vm.showTooltip(mouseEvent)
    vm.hideTooltip()
    vi.advanceTimersByTime(600)
    await nextTick()
    // tooltip should NOT be visible because hideTooltip cleared the timer
    expect(vm.visible).toBe(false)
  })
})

describe('Tooltip — positions top/bottom/left/right', () => {
  it('all positions render without error', async () => {
    for (const position of ['top', 'bottom', 'left', 'right'] as const) {
      const wrapper = mountTooltip({ position })
      expect(wrapper.exists()).toBe(true)
    }
  })
})

describe('Tooltip — onUnmounted cleanup', () => {
  it('unmounts without throwing when timer is pending', async () => {
    vi.useFakeTimers()
    const wrapper = mountTooltip({ delay: 500 })
    await wrapper.find('.tooltip-container').trigger('mouseenter')
    expect(() => wrapper.unmount()).not.toThrow()
  })

  it('unmounts without throwing when no timer is pending', () => {
    const wrapper = mountTooltip()
    expect(() => wrapper.unmount()).not.toThrow()
  })
})
