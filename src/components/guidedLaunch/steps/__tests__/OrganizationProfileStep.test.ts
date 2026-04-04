/**
 * Unit tests for OrganizationProfileStep component
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import OrganizationProfileStep from '../OrganizationProfileStep.vue'
import { useGuidedLaunchStore } from '../../../../stores/guidedLaunch'

describe('OrganizationProfileStep', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render the component with heading', () => {
    const wrapper = mount(OrganizationProfileStep)
    expect(wrapper.find('h2').text()).toBe('Organization Profile')
  })

  it('should render all required fields', () => {
    const wrapper = mount(OrganizationProfileStep)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.findAll('select').length).toBeGreaterThan(0)
  })

  it('should display info box', () => {
    const wrapper = mount(OrganizationProfileStep)
    const infoBox = wrapper.text()
    expect(infoBox).toContain('Why we need this information')
  })

  it('should start with disabled submit button', () => {
    const wrapper = mount(OrganizationProfileStep)
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('should validate email format', async () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    vm.formData.contactEmail = 'invalid-email'
    await wrapper.vm.$nextTick()
    vm.validateField('contactEmail')
    await wrapper.vm.$nextTick()
    expect(vm.fieldErrors.contactEmail).toBeDefined()
  })

  it('should clear email error when valid email entered', async () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    // First set invalid email to create error
    vm.formData.contactEmail = 'invalid'
    vm.validateField('contactEmail')
    expect(vm.fieldErrors.contactEmail).toBeDefined()
    // Now set valid email and validate
    vm.formData.contactEmail = 'valid@test.com'
    vm.validateField('contactEmail')
    await wrapper.vm.$nextTick()
    expect(vm.fieldErrors.contactEmail).toBeUndefined()
  })

  it('should set error when organizationName is empty', async () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    vm.formData.organizationName = ''
    vm.validateField('organizationName')
    await wrapper.vm.$nextTick()
    expect(vm.fieldErrors.organizationName).toBeDefined()
  })

  it('should clear organizationName error when name is provided', async () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    // Set error first
    vm.formData.organizationName = ''
    vm.validateField('organizationName')
    expect(vm.fieldErrors.organizationName).toBeDefined()
    // Clear by providing a valid name
    vm.formData.organizationName = 'Test Corp'
    vm.validateField('organizationName')
    await wrapper.vm.$nextTick()
    expect(vm.fieldErrors.organizationName).toBeUndefined()
  })

  it('should show warning for missing registration number', () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    vm.formData.organizationName = 'Test'
    vm.formData.organizationType = 'company'
    vm.formData.jurisdiction = 'US'
    vm.formData.contactName = 'John'
    vm.formData.contactEmail = 'john@test.com'
    vm.formData.role = 'business_owner'
    const validation = vm.validateForm()
    expect(validation.isValid).toBe(true)
    expect(validation.warnings.length).toBeGreaterThan(0)
  })

  it('should return errors when organizationName is missing', () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    vm.formData.organizationName = ''
    vm.formData.jurisdiction = 'US'
    vm.formData.contactName = 'John'
    vm.formData.contactEmail = 'john@test.com'
    vm.formData.role = 'business_owner'
    const validation = vm.validateForm()
    expect(validation.isValid).toBe(false)
    expect(validation.errors).toContain('Organization name is required')
  })

  it('should return errors when contactEmail format is invalid', () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    vm.formData.organizationName = 'Test'
    vm.formData.organizationType = 'company'
    vm.formData.jurisdiction = 'US'
    vm.formData.contactName = 'John'
    vm.formData.contactEmail = 'not-a-valid-email'
    vm.formData.role = 'business_owner'
    const validation = vm.validateForm()
    expect(validation.isValid).toBe(false)
    expect(validation.errors).toContain('Invalid email format')
  })

  it('should return error when contactEmail is empty', () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    vm.formData.organizationName = 'Test'
    vm.formData.organizationType = 'company'
    vm.formData.jurisdiction = 'US'
    vm.formData.contactName = 'John'
    vm.formData.contactEmail = ''
    vm.formData.role = 'business_owner'
    const validation = vm.validateForm()
    expect(validation.isValid).toBe(false)
    expect(validation.errors).toContain('Contact email is required')
  })

  it('handleSubmit emits complete and update events when form is valid', async () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    // Fill in valid form data
    vm.formData.organizationName = 'Valid Corp'
    vm.formData.organizationType = 'company'
    vm.formData.jurisdiction = 'US'
    vm.formData.contactName = 'Jane Doe'
    vm.formData.contactEmail = 'jane@validcorp.com'
    vm.formData.role = 'business_owner'
    await wrapper.vm.$nextTick()
    // Call handleSubmit
    vm.handleSubmit()
    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted()
    expect(emitted.complete).toBeDefined()
    expect(emitted.update).toBeDefined()
  })

  it('handleSubmit does not emit complete when form is invalid', async () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    // Leave form in invalid state (empty required fields)
    vm.handleSubmit()
    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted()
    expect(emitted.complete).toBeUndefined()
  })

  it('should emit update when form data changes (watch)', async () => {
    const wrapper = mount(OrganizationProfileStep)
    const vm = wrapper.vm as any
    // Change formData to trigger watch
    vm.formData.organizationName = 'Updated Name'
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted()
    expect(emitted.update).toBeDefined()
  })

  it('should load existing data from store', async () => {
    const store = useGuidedLaunchStore()
    store.setOrganizationProfile({
      organizationName: 'Existing Company',
      organizationType: 'company',
      jurisdiction: 'US',
      contactName: 'Jane',
      contactEmail: 'jane@test.com',
      role: 'cfo_finance',
    })
    const wrapper = mount(OrganizationProfileStep)
    await wrapper.vm.$nextTick()
    const vm = wrapper.vm as any
    expect(vm.formData.organizationName).toBe('Existing Company')
  })

  it('should have accessibility labels', () => {
    const wrapper = mount(OrganizationProfileStep)
    const labels = wrapper.findAll('label')
    expect(labels.length).toBeGreaterThan(0)
  })

  describe('validateField', () => {
    it('sets organizationName error when name is empty', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = ''
      vm.validateField('organizationName')
      expect(vm.fieldErrors.organizationName).toBeTruthy()
    })

    it('clears organizationName error when name is provided', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = ''
      vm.validateField('organizationName')
      vm.formData.organizationName = 'Valid Corp'
      vm.validateField('organizationName')
      expect(vm.fieldErrors.organizationName).toBeUndefined()
    })

    it('ignores unhandled field in switch', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      // Should not throw for unhandled fields
      expect(() => vm.validateField('website')).not.toThrow()
    })
  })

  describe('validateForm - warnings', () => {
    it('includes warning when registrationNumber is missing', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = 'Corp'
      vm.formData.organizationType = 'company'
      vm.formData.jurisdiction = 'US'
      vm.formData.contactName = 'Jane'
      vm.formData.contactEmail = 'jane@corp.com'
      vm.formData.role = 'business_owner'
      vm.formData.registrationNumber = ''
      vm.formData.website = ''
      const result = vm.validateForm()
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('Registration number recommended for compliance')
      expect(result.warnings).toContain('Website recommended for credibility')
    })

    it('no warnings when registrationNumber and website are provided', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = 'Corp'
      vm.formData.organizationType = 'company'
      vm.formData.jurisdiction = 'US'
      vm.formData.contactName = 'Jane'
      vm.formData.contactEmail = 'jane@corp.com'
      vm.formData.role = 'business_owner'
      vm.formData.registrationNumber = 'REG123'
      vm.formData.website = 'https://corp.com'
      const result = vm.validateForm()
      expect(result.isValid).toBe(true)
      expect(result.warnings.length).toBe(0)
    })
  })

  describe('isFormValid computed', () => {
    it('returns false when required fields are empty', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      expect(vm.isFormValid).toBe(false)
    })

    it('returns true when all required fields are filled', async () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = 'Corp'
      vm.formData.organizationType = 'company'
      vm.formData.jurisdiction = 'EU'
      vm.formData.contactName = 'Alice'
      vm.formData.contactEmail = 'alice@corp.com'
      vm.formData.role = 'compliance_officer'
      await wrapper.vm.$nextTick()
      expect(vm.isFormValid).toBe(true)
    })
  })

  describe('handleSubmit - invalid form', () => {
    it('does not emit complete when role is missing', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = 'Corp'
      vm.formData.organizationType = 'company'
      vm.formData.jurisdiction = 'EU'
      vm.formData.contactName = 'Alice'
      vm.formData.contactEmail = 'alice@corp.com'
      vm.formData.role = ''
      vm.handleSubmit()
      expect(wrapper.emitted('complete')).toBeUndefined()
    })
  })
})

  describe('validateForm - missing required fields', () => {
    it('returns error when organizationType is missing', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = 'Test'
      vm.formData.organizationType = '' // missing
      vm.formData.jurisdiction = 'US'
      vm.formData.contactName = 'John'
      vm.formData.contactEmail = 'john@test.com'
      vm.formData.role = 'business_owner'
      const validation = vm.validateForm()
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('Organization type is required')
    })

    it('returns error when jurisdiction is missing', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = 'Test'
      vm.formData.organizationType = 'company'
      vm.formData.jurisdiction = '' // missing
      vm.formData.contactName = 'John'
      vm.formData.contactEmail = 'john@test.com'
      vm.formData.role = 'business_owner'
      const validation = vm.validateForm()
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('Jurisdiction is required')
    })

    it('returns error when contactName is missing', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = 'Test'
      vm.formData.organizationType = 'company'
      vm.formData.jurisdiction = 'US'
      vm.formData.contactName = '' // missing
      vm.formData.contactEmail = 'john@test.com'
      vm.formData.role = 'business_owner'
      const validation = vm.validateForm()
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('Contact name is required')
    })

    it('returns error when role is missing', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = 'Test'
      vm.formData.organizationType = 'company'
      vm.formData.jurisdiction = 'US'
      vm.formData.contactName = 'John'
      vm.formData.contactEmail = 'john@test.com'
      vm.formData.role = '' // missing
      const validation = vm.validateForm()
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('Your role is required')
    })

    it('returns website warning when website is missing', () => {
      const wrapper = mount(OrganizationProfileStep)
      const vm = wrapper.vm as any
      vm.formData.organizationName = 'Test'
      vm.formData.organizationType = 'company'
      vm.formData.jurisdiction = 'US'
      vm.formData.contactName = 'John'
      vm.formData.contactEmail = 'john@test.com'
      vm.formData.role = 'business_owner'
      vm.formData.website = '' // missing
      const validation = vm.validateForm()
      expect(validation.isValid).toBe(true)
      expect(validation.warnings.some((w: string) => w.includes('Website'))).toBe(true)
    })
  })
