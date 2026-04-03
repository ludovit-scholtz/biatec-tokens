/**
 * Tests for PortfolioOnboardingWalkthrough.vue
 * Covers: showWalkthrough computed, onMounted replay emit, handleComplete, handleSkip
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PortfolioOnboardingWalkthrough from '../PortfolioOnboardingWalkthrough.vue'

vi.mock('../../ui/Button.vue', () => ({
  default: { template: '<button @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
}))

beforeEach(() => {
  localStorage.clear()
})

const mountWalkthrough = (isFirstVisit = true, hasCompletedOnboarding = false) =>
  mount(PortfolioOnboardingWalkthrough, {
    props: { isFirstVisit, hasCompletedOnboarding },
    global: {
      stubs: {
        Button: { template: '<button @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
      },
    },
  })

describe('PortfolioOnboardingWalkthrough — showWalkthrough computed', () => {
  it('showWalkthrough is true when isFirstVisit=true and hasCompletedOnboarding=false', () => {
    const wrapper = mountWalkthrough(true, false)
    const vm = wrapper.vm as any
    expect(vm.showWalkthrough).toBe(true)
  })

  it('showWalkthrough is false when isFirstVisit=false', () => {
    const wrapper = mountWalkthrough(false, false)
    const vm = wrapper.vm as any
    expect(vm.showWalkthrough).toBe(false)
  })

  it('showWalkthrough is false when hasCompletedOnboarding=true', () => {
    const wrapper = mountWalkthrough(true, true)
    const vm = wrapper.vm as any
    expect(vm.showWalkthrough).toBe(false)
  })
})

describe('PortfolioOnboardingWalkthrough — onMounted replay emit', () => {
  it('emits "replay" on mount when showWalkthrough is true', async () => {
    const wrapper = mountWalkthrough(true, false)
    await nextTick()
    expect(wrapper.emitted('replay')).toBeTruthy()
  })

  it('does NOT emit "replay" when showWalkthrough is false', async () => {
    const wrapper = mountWalkthrough(false, false)
    await nextTick()
    expect(wrapper.emitted('replay')).toBeFalsy()
  })
})

describe('PortfolioOnboardingWalkthrough — handleComplete', () => {
  it('saves completed state to localStorage and emits "completed"', async () => {
    const wrapper = mountWalkthrough()
    const vm = wrapper.vm as any
    vm.handleComplete()
    await nextTick()
    expect(localStorage.getItem('portfolio_onboarding_completed_v1')).toBe('true')
    expect(wrapper.emitted('completed')).toBeTruthy()
  })
})

describe('PortfolioOnboardingWalkthrough — handleSkip', () => {
  it('saves skipped state to localStorage and emits "skipped"', async () => {
    const wrapper = mountWalkthrough()
    const vm = wrapper.vm as any
    vm.handleSkip()
    await nextTick()
    expect(localStorage.getItem('portfolio_onboarding_completed_v1')).toBe('skipped')
    expect(wrapper.emitted('skipped')).toBeTruthy()
  })
})
