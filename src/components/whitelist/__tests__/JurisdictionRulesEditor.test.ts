import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import JurisdictionRulesEditor from '../JurisdictionRulesEditor.vue'
import type { JurisdictionRule } from '../../../types/whitelist'

const BASE_RULE: JurisdictionRule = {
  id: 'rule-1',
  countryCode: 'US',
  countryName: 'United States',
  status: 'allowed',
  kycRequired: true,
  accreditationRequired: false,
  effectiveDate: '2024-01-01T00:00:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-02-01T00:00:00.000Z',
  createdBy: 'admin',
  tokenPrograms: [],
}

function mountEditor(rules: JurisdictionRule[] = [], isLoading = false) {
  return mount(JurisdictionRulesEditor, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            whitelist: {
              jurisdictionRules: rules,
              isLoadingJurisdictions: isLoading,
            },
          },
          stubActions: false,
        }),
      ],
      stubs: {
        Modal: {
          template: `<div v-if="show"><slot name="header"/><slot/><slot name="footer"/></div>`,
          props: ['show'],
          emits: ['close'],
        },
        Badge: { template: '<span><slot/></span>', props: ['variant'] },
        Button: { template: '<button type="button" @click="$emit(\'click\')"><slot/></button>', props: ['variant', 'size', 'loading'], emits: ['click'] },
        Input: { template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />', props: ['modelValue', 'label', 'placeholder', 'required', 'error', 'hint', 'type'], emits: ['update:modelValue'] },
        Select: { template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="o in options" :key="o.value" :value="o.value">{{o.label}}</option></select>', props: ['modelValue', 'options', 'label', 'required', 'error'], emits: ['update:modelValue'] },
      },
    },
  })
}

describe('JurisdictionRulesEditor', () => {
  describe('getStatusVariant', () => {
    it('returns success for allowed', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      expect(vm.getStatusVariant('allowed')).toBe('success')
    })

    it('returns warning for restricted', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      expect(vm.getStatusVariant('restricted')).toBe('warning')
    })

    it('returns error for blocked', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      expect(vm.getStatusVariant('blocked')).toBe('error')
    })

    it('returns info for pending_review', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      expect(vm.getStatusVariant('pending_review')).toBe('info')
    })

    it('returns info for unknown status', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      expect(vm.getStatusVariant('other')).toBe('info')
    })
  })

  describe('formatStatus', () => {
    it('converts underscores to spaces and capitalises words', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      expect(vm.formatStatus('pending_review')).toBe('Pending Review')
    })

    it('capitalises single word', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      expect(vm.formatStatus('allowed')).toBe('Allowed')
    })
  })

  describe('formatDate', () => {
    it('returns a formatted date string', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      const result = vm.formatDate('2024-01-15T00:00:00.000Z')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('openCreateModal', () => {
    it('clears editingRule and opens the form modal', async () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.openCreateModal()
      await nextTick()
      expect(vm.showFormModal).toBe(true)
      expect(vm.editingRule).toBeNull()
    })
  })

  describe('openEditModal', () => {
    it('populates form with rule data and opens modal', async () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.openEditModal(BASE_RULE)
      await nextTick()
      expect(vm.showFormModal).toBe(true)
      expect(vm.editingRule).toStrictEqual(BASE_RULE)
      expect(vm.ruleForm.countryCode).toBe('US')
      expect(vm.ruleForm.countryName).toBe('United States')
      expect(vm.ruleForm.status).toBe('allowed')
      expect(vm.ruleForm.kycRequired).toBe(true)
      expect(vm.ruleForm.accreditationRequired).toBe(false)
    })

    it('copies restrictionReason and notes when present', async () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.openEditModal({ ...BASE_RULE, restrictionReason: 'OFAC', notes: 'Watch list' })
      await nextTick()
      expect(vm.ruleForm.restrictionReason).toBe('OFAC')
      expect(vm.ruleForm.notes).toBe('Watch list')
    })
  })

  describe('closeFormModal', () => {
    it('closes modal and resets editingRule', async () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.openEditModal(BASE_RULE)
      await nextTick()
      vm.closeFormModal()
      await nextTick()
      expect(vm.showFormModal).toBe(false)
      expect(vm.editingRule).toBeNull()
    })
  })

  describe('validateForm', () => {
    it('fails when countryCode is empty', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = ''
      vm.ruleForm.countryName = 'United States'
      vm.ruleForm.status = 'allowed'
      vm.ruleForm.effectiveDate = '2024-01-01'
      const result = vm.validateForm()
      expect(result).toBe(false)
      expect(vm.formErrors.countryCode).toContain('required')
    })

    it('fails when countryCode is invalid format', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = 'us'
      vm.ruleForm.countryName = 'United States'
      vm.ruleForm.status = 'allowed'
      vm.ruleForm.effectiveDate = '2024-01-01'
      const result = vm.validateForm()
      expect(result).toBe(false)
      expect(vm.formErrors.countryCode).toContain('Invalid country code')
    })

    it('fails when countryName is empty', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = 'US'
      vm.ruleForm.countryName = ''
      vm.ruleForm.status = 'allowed'
      vm.ruleForm.effectiveDate = '2024-01-01'
      const result = vm.validateForm()
      expect(result).toBe(false)
      expect(vm.formErrors.countryName).toContain('required')
    })

    it('fails when status is empty', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = 'US'
      vm.ruleForm.countryName = 'United States'
      vm.ruleForm.status = ''
      vm.ruleForm.effectiveDate = '2024-01-01'
      const result = vm.validateForm()
      expect(result).toBe(false)
    })

    it('fails when restricted without restrictionReason', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = 'US'
      vm.ruleForm.countryName = 'United States'
      vm.ruleForm.status = 'restricted'
      vm.ruleForm.restrictionReason = ''
      vm.ruleForm.effectiveDate = '2024-01-01'
      const result = vm.validateForm()
      expect(result).toBe(false)
      expect(vm.formErrors.restrictionReason).toContain('required')
    })

    it('fails when blocked without restrictionReason', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = 'US'
      vm.ruleForm.countryName = 'United States'
      vm.ruleForm.status = 'blocked'
      vm.ruleForm.restrictionReason = ''
      vm.ruleForm.effectiveDate = '2024-01-01'
      const result = vm.validateForm()
      expect(result).toBe(false)
    })

    it('fails when effectiveDate is empty', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = 'US'
      vm.ruleForm.countryName = 'United States'
      vm.ruleForm.status = 'allowed'
      vm.ruleForm.effectiveDate = ''
      const result = vm.validateForm()
      expect(result).toBe(false)
      expect(vm.formErrors.effectiveDate).toContain('required')
    })

    it('passes with valid data for allowed status', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = 'US'
      vm.ruleForm.countryName = 'United States'
      vm.ruleForm.status = 'allowed'
      vm.ruleForm.effectiveDate = '2024-01-01'
      const result = vm.validateForm()
      expect(result).toBe(true)
    })

    it('passes restricted status when restrictionReason provided', () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = 'US'
      vm.ruleForm.countryName = 'United States'
      vm.ruleForm.status = 'restricted'
      vm.ruleForm.restrictionReason = 'OFAC sanctions'
      vm.ruleForm.effectiveDate = '2024-01-01'
      const result = vm.validateForm()
      expect(result).toBe(true)
    })
  })

  describe('confirmDelete', () => {
    it('sets deletingRule and shows delete modal', async () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.confirmDelete(BASE_RULE)
      await nextTick()
      expect(vm.showDeleteModal).toBe(true)
      expect(vm.deletingRule).toStrictEqual(BASE_RULE)
    })
  })

  describe('handleDelete with no deletingRule', () => {
    it('returns early when deletingRule is null', async () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.deletingRule = null
      await vm.handleDelete()
      expect(vm.isDeleting).toBe(false)
    })
  })

  describe('handleSubmit validation failure', () => {
    it('returns without submitting when validation fails', async () => {
      const wrapper = mountEditor()
      const vm = wrapper.vm as any
      vm.ruleForm.countryCode = ''
      await vm.handleSubmit()
      expect(vm.isSubmitting).toBe(false)
    })
  })

  describe('empty state rendering', () => {
    it('shows empty state when no rules', () => {
      const wrapper = mountEditor([])
      expect(wrapper.html()).toContain('No jurisdiction rules found')
    })

    it('renders rules when present', () => {
      const wrapper = mountEditor([BASE_RULE])
      expect(wrapper.html()).toContain('United States')
    })
  })
})
