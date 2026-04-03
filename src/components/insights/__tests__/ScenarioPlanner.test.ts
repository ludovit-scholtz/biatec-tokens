/**
 * Tests for ScenarioPlanner.vue
 * Covers: isValidInput computed, formatNumber, handleRunScenario, handleReset, watch(inputs)
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ScenarioPlanner from '../ScenarioPlanner.vue'
import type { ScenarioInput, ScenarioOutput } from '../../../stores/insights'

vi.mock('../../ui/Card.vue', () => ({ default: { template: '<div><slot /></div>' } }))
vi.mock('../../ui/Button.vue', () => ({
  default: { template: '<button @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
}))

const defaultInputs: ScenarioInput = { campaignLift: 10, liquidityContribution: 5000, retentionChange: 2 }

const mountPlanner = (inputs = defaultInputs, outputs: ScenarioOutput | null = null, loading = false) =>
  mount(ScenarioPlanner, {
    props: { inputs, outputs, loading },
    global: {
      stubs: {
        Card: { template: '<div><slot /></div>' },
        Button: { template: '<button @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
      },
    },
  })

describe('ScenarioPlanner — isValidInput computed', () => {
  it('returns true for valid inputs in range', () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    expect(vm.isValidInput).toBe(true)
  })

  it('returns false when campaignLift > 100', () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    vm.localInputs.campaignLift = 150
    expect(vm.isValidInput).toBe(false)
  })

  it('returns false when campaignLift < 0', () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    vm.localInputs.campaignLift = -1
    expect(vm.isValidInput).toBe(false)
  })

  it('returns false when retentionChange > 100', () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    vm.localInputs.retentionChange = 101
    expect(vm.isValidInput).toBe(false)
  })

  it('returns false when retentionChange < -100', () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    vm.localInputs.retentionChange = -101
    expect(vm.isValidInput).toBe(false)
  })

  it('returns false when liquidityContribution < 0', () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    vm.localInputs.liquidityContribution = -1
    expect(vm.isValidInput).toBe(false)
  })

  it('returns false when campaignLift is NaN', () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    vm.localInputs.campaignLift = NaN
    expect(vm.isValidInput).toBe(false)
  })
})

describe('ScenarioPlanner — formatNumber', () => {
  it('formats a whole number with locale separators', () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    const result = vm.formatNumber(1000000)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('formats 0 as "0"', () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    expect(vm.formatNumber(0)).toBe('0')
  })
})

describe('ScenarioPlanner — handleRunScenario', () => {
  it('emits "run" event with current localInputs when valid', async () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    vm.handleRunScenario()
    await nextTick()
    const emitted = wrapper.emitted('run')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual(defaultInputs)
  })

  it('does not emit "run" when inputs are invalid', async () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    vm.localInputs.campaignLift = 999 // invalid
    vm.handleRunScenario()
    await nextTick()
    expect(wrapper.emitted('run')).toBeFalsy()
  })
})

describe('ScenarioPlanner — handleReset', () => {
  it('resets localInputs to zero values', async () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    vm.localInputs.campaignLift = 50
    vm.handleReset()
    await nextTick()
    expect(vm.localInputs.campaignLift).toBe(0)
    expect(vm.localInputs.liquidityContribution).toBe(0)
    expect(vm.localInputs.retentionChange).toBe(0)
  })
})

describe('ScenarioPlanner — watch(inputs)', () => {
  it('updates localInputs when props.inputs changes', async () => {
    const wrapper = mountPlanner()
    const vm = wrapper.vm as any
    await wrapper.setProps({ inputs: { campaignLift: 99, liquidityContribution: 1, retentionChange: -5 } })
    await nextTick()
    expect(vm.localInputs.campaignLift).toBe(99)
    expect(vm.localInputs.liquidityContribution).toBe(1)
    expect(vm.localInputs.retentionChange).toBe(-5)
  })
})
