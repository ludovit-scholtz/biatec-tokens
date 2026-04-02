import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionExplainer from '../ActionExplainer.vue'

function mountExplainer(props: Record<string, unknown> = {}) {
  return mount(ActionExplainer, {
    props: {
      actionTitle: 'Deploy Token',
      whatHappens: 'Your token will be deployed to the network.',
      steps: ['Validate input', 'Sign transaction', 'Confirm on chain'],
      ...props,
    },
  })
}

describe('ActionExplainer', () => {
  describe('initial state', () => {
    it('is collapsed by default when defaultExpanded is false', () => {
      const wrapper = mountExplainer({ defaultExpanded: false })
      const vm = wrapper.vm as any
      expect(vm.isExpanded).toBe(false)
    })

    it('is expanded when defaultExpanded is true', () => {
      const wrapper = mountExplainer({ defaultExpanded: true })
      const vm = wrapper.vm as any
      expect(vm.isExpanded).toBe(true)
    })
  })

  describe('toggleLabel computed', () => {
    it('shows "Hide details" when expanded', () => {
      const wrapper = mountExplainer({ defaultExpanded: true })
      const vm = wrapper.vm as any
      expect(vm.toggleLabel).toContain('Hide details')
    })

    it('shows "Learn what happens" when collapsed', () => {
      const wrapper = mountExplainer({ defaultExpanded: false })
      const vm = wrapper.vm as any
      expect(vm.toggleLabel).toContain('Learn what happens')
    })
  })

  describe('toggle function', () => {
    it('expands when collapsed', () => {
      const wrapper = mountExplainer({ defaultExpanded: false })
      const vm = wrapper.vm as any
      vm.toggle()
      expect(vm.isExpanded).toBe(true)
    })

    it('collapses when expanded', () => {
      const wrapper = mountExplainer({ defaultExpanded: true })
      const vm = wrapper.vm as any
      vm.toggle()
      expect(vm.isExpanded).toBe(false)
    })

    it('emits toggle event with new state', () => {
      const wrapper = mountExplainer({ defaultExpanded: false })
      const vm = wrapper.vm as any
      vm.toggle()
      const emitted = wrapper.emitted('toggle')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toBe(true)
    })

    it('emits toggle with false when collapsing', () => {
      const wrapper = mountExplainer({ defaultExpanded: true })
      const vm = wrapper.vm as any
      vm.toggle()
      expect(wrapper.emitted('toggle')![0][0]).toBe(false)
    })
  })

  describe('getOutcomeIcon function', () => {
    it('returns ✓ for success', () => {
      const wrapper = mountExplainer()
      const vm = wrapper.vm as any
      expect(vm.getOutcomeIcon('success')).toBe('✓')
    })

    it('returns ⚠ for partial', () => {
      const wrapper = mountExplainer()
      const vm = wrapper.vm as any
      expect(vm.getOutcomeIcon('partial')).toBe('⚠')
    })

    it('returns ✗ for error', () => {
      const wrapper = mountExplainer()
      const vm = wrapper.vm as any
      expect(vm.getOutcomeIcon('error')).toBe('✗')
    })

    it('returns • for unknown type', () => {
      const wrapper = mountExplainer()
      const vm = wrapper.vm as any
      expect(vm.getOutcomeIcon('unknown')).toBe('•')
    })
  })

  describe('explainerId', () => {
    it('generates a unique id starting with "explainer-"', () => {
      const wrapper = mountExplainer()
      const vm = wrapper.vm as any
      expect(vm.explainerId).toMatch(/^explainer-[a-z0-9]+$/)
    })
  })
})
