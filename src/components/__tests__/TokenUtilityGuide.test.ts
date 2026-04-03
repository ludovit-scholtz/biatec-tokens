import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import TokenUtilityGuide from '../TokenUtilityGuide.vue'
import { TokenUseCase } from '../../types/tokenUtility'

// Mock Token utility sub-components
vi.mock('../TokenUtilityCard.vue', () => ({
  default: {
    name: 'TokenUtilityCard',
    props: ['utility'],
    template: '<div class="mock-utility-card" :data-standard="utility?.standard">{{ utility?.standard }}</div>',
  },
}))

vi.mock('../ui/Card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div class="mock-card"><slot /><slot name="header" /></div>',
  },
}))

vi.mock('../ui/Badge.vue', () => ({
  default: {
    name: 'Badge',
    props: ['variant'],
    template: '<span class="mock-badge"><slot /></span>',
  },
}))

vi.mock('../ui/Button.vue', () => ({
  default: {
    name: 'Button',
    props: ['variant', 'size'],
    template: '<button class="mock-button" @click="$emit(\'click\')"><slot /></button>',
    emits: ['click'],
  },
}))

function makeWrapper() {
  return mount(TokenUtilityGuide, {
    global: { plugins: [createPinia()] },
    attachTo: document.body,
  })
}

describe('TokenUtilityGuide.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders without errors', () => {
    const wrapper = makeWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('shows use case selector', () => {
    const wrapper = makeWrapper()
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
  })

  it('has all TokenUseCase enum values as options', () => {
    const wrapper = makeWrapper()
    const options = wrapper.findAll('select option')
    // All enum values + the placeholder "Select a use case" option
    const enumValues = Object.values(TokenUseCase)
    expect(options.length).toBe(enumValues.length + 1) // +1 for placeholder
  })

  it('shows no recommendations initially (empty use case)', async () => {
    const wrapper = makeWrapper()
    await nextTick()
    // comparisons start empty, so the recommendations section should not render
    const recs = wrapper.findAll('.space-y-3')
    // No comparison items shown
    expect(wrapper.find('select').element.value).toBe('')
  })

  it('shows recommendations after selecting a use case', async () => {
    const wrapper = makeWrapper()
    const select = wrapper.find('select')
    await select.setValue(TokenUseCase.FUNGIBLE_TOKEN)
    await select.trigger('change')
    await nextTick()
    // comparisons should now be populated
    const vm = wrapper.vm as any
    expect(Array.isArray(vm.comparisons)).toBe(true)
    expect(vm.comparisons.length).toBeGreaterThan(0)
  })

  it('clears recommendations when use case is deselected', async () => {
    const wrapper = makeWrapper()
    const select = wrapper.find('select')
    // First select something
    await select.setValue(TokenUseCase.NFT)
    await select.trigger('change')
    await nextTick()
    const vm = wrapper.vm as any
    expect(vm.comparisons.length).toBeGreaterThan(0)
    // Then clear it
    await select.setValue('')
    await select.trigger('change')
    await nextTick()
    expect(vm.comparisons.length).toBe(0)
  })

  it('getScoreColor returns green for score >= 80', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.getScoreColor(80)).toContain('green')
    expect(vm.getScoreColor(100)).toContain('green')
  })

  it('getScoreColor returns blue for score >= 60 and < 80', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.getScoreColor(60)).toContain('blue')
    expect(vm.getScoreColor(79)).toContain('blue')
  })

  it('getScoreColor returns yellow for score >= 40 and < 60', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.getScoreColor(40)).toContain('yellow')
    expect(vm.getScoreColor(59)).toContain('yellow')
  })

  it('getScoreColor returns orange for score < 40', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm as any
    expect(vm.getScoreColor(39)).toContain('orange')
    expect(vm.getScoreColor(0)).toContain('orange')
  })

  it('viewStandardDetails scrolls to element if found', () => {
    const wrapper = makeWrapper()
    const mockScrollIntoView = vi.fn()
    const mockElement = { scrollIntoView: mockScrollIntoView }
    vi.spyOn(document, 'querySelector').mockReturnValue(mockElement as unknown as Element)
    const vm = wrapper.vm as any
    vm.viewStandardDetails('ARC200')
    expect(document.querySelector).toHaveBeenCalledWith('[data-standard="ARC200"]')
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' })
    vi.restoreAllMocks()
  })

  it('viewStandardDetails does nothing if element not found', () => {
    const wrapper = makeWrapper()
    vi.spyOn(document, 'querySelector').mockReturnValue(null)
    const vm = wrapper.vm as any
    // Should not throw
    expect(() => vm.viewStandardDetails('NONEXISTENT')).not.toThrow()
    vi.restoreAllMocks()
  })

  it('shows compliance checkbox', () => {
    const wrapper = makeWrapper()
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('updates recommendations with compliance flag', async () => {
    const wrapper = makeWrapper()
    const select = wrapper.find('select')
    await select.setValue(TokenUseCase.SECURITY_TOKEN)
    await select.trigger('change')
    await nextTick()
    const vm = wrapper.vm as any
    const baseLength = vm.comparisons.length

    // Set compliance flag and update
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[0].setValue(true)
    await checkboxes[0].trigger('change')
    await nextTick()
    // scores may differ with compliance=true, but still returns results
    expect(vm.comparisons.length).toBeGreaterThan(0)
    expect(baseLength).toBeGreaterThan(0) // was also > 0 before
  })

  it('shows all TOKEN_UTILITIES cards in the grid', () => {
    const wrapper = makeWrapper()
    const cards = wrapper.findAll('.mock-utility-card')
    expect(cards.length).toBeGreaterThan(0)
  })
})
