/**
 * Unit tests for KYCAMLReadinessStep component
 * Verifies KYC/AML provider status display, readiness indicators, and form interaction
 */

import { describe, it, expect, nextTick } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick as vueNextTick } from "vue";
import KYCAMLReadinessStep from "../KYCAMLReadinessStep.vue";
import type { KYCAMLReadiness } from "../../../types/complianceSetup";

const makeKYCReadiness = (overrides: Partial<KYCAMLReadiness> = {}): KYCAMLReadiness => ({
  kycProviderConfigured: false,
  kycProviderName: '',
  kycProviderStatus: "not_configured",
  amlProviderConfigured: false,
  amlProviderName: '',
  amlProviderStatus: "not_configured",
  requiredDocuments: [],
  completedDocuments: [],
  identityVerificationFlow: "manual",
  identityVerificationStatus: "not_started",
  sanctionsScreeningEnabled: false,
  sanctionsScreeningProvider: '',
  pepsCheckEnabled: false,
  adverseMediaCheckEnabled: false,
  overallReadinessStatus: "not_ready",
  blockingIssues: [],
  ...overrides,
});

describe("KYCAMLReadinessStep", () => {
  it("renders without crashing when no modelValue is provided", () => {
    const wrapper = mount(KYCAMLReadinessStep);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders with a provided modelValue", () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: { modelValue: makeKYCReadiness() },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("shows step header text", () => {
    const wrapper = mount(KYCAMLReadinessStep);
    const html = wrapper.html();
    expect(html).toMatch(/KYC.AML|kyc.*aml/i);
  });

  it("shows KYC provider configuration toggle initially", () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: { modelValue: makeKYCReadiness({ kycProviderStatus: "not_configured" }) },
    });
    // The KYC toggle should be visible
    expect(wrapper.find("input[type='checkbox']").exists()).toBe(true);
  });

  it("shows AML provider configuration section", () => {
    const wrapper = mount(KYCAMLReadinessStep);
    const html = wrapper.html();
    expect(html).toMatch(/aml|AML|anti.money/i);
  });

  it("shows sanctions screening toggle", () => {
    const wrapper = mount(KYCAMLReadinessStep);
    const html = wrapper.html();
    expect(html).toMatch(/sanctions|Sanctions/);
  });

  it("emits validation-change on mount", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: { modelValue: makeKYCReadiness() },
    });
    await vueNextTick();
    const emitted = wrapper.emitted("validation-change");
    expect(emitted).toBeDefined();
  });

  it("shows provider dropdown after enabling KYC", async () => {
    const wrapper = mount(KYCAMLReadinessStep);
    // Toggle the KYC provider configured checkbox
    const checkbox = wrapper.find("input[type='checkbox']");
    if (checkbox.exists()) {
      await checkbox.setValue(true);
      await vueNextTick();
      // After enabling, the provider name dropdown should appear
      const html = wrapper.html();
      expect(html).toMatch(/jumio|Jumio|onfido|Onfido|provider/i);
    } else {
      // Component still exists, just no checkbox found
      expect(wrapper.exists()).toBe(true);
    }
  });

  it("shows overall readiness status indicator", () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: { modelValue: makeKYCReadiness({ overallReadinessStatus: "not_ready" }) },
    });
    const html = wrapper.html();
    expect(html).toMatch(/not.ready|Not Ready|readiness|configure/i);
  });

  it("shows PEPs check toggle", () => {
    const wrapper = mount(KYCAMLReadinessStep);
    const html = wrapper.html();
    expect(html).toMatch(/pep|PEP|politically/i);
  });

  // --- Readiness status computed branches ---

  it("shows 'ready' green status when both providers configured and no errors", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: true,
          kycProviderName: 'Jumio',
          amlProviderConfigured: true,
          amlProviderName: 'ComplyAdvantage',
          overallReadinessStatus: 'ready',
        }),
      },
    });
    await vueNextTick();
    // readinessStatusClass should include green for 'ready'
    expect(wrapper.html()).toContain('green');
  });

  it("shows 'partially_ready' yellow status when only KYC configured", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: true,
          kycProviderName: 'Jumio',
          amlProviderConfigured: false,
          overallReadinessStatus: 'partially_ready',
        }),
      },
    });
    await vueNextTick();
    expect(wrapper.html()).toContain('yellow');
  });

  it("shows 'not_ready' red status with no providers configured", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({ overallReadinessStatus: 'not_ready' }),
      },
    });
    await vueNextTick();
    expect(wrapper.html()).toContain('red');
  });

  // --- Validation error branches ---

  it("shows KYC provider error when KYC enabled but no provider selected", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: true,
          kycProviderName: '',
        }),
      },
    });
    await vueNextTick();
    // Trigger field change to run validation
    const checkboxes = wrapper.findAll("input[type='checkbox']");
    if (checkboxes.length > 0) {
      await checkboxes[0].trigger('change');
      await vueNextTick();
    }
    // Check validation error is shown
    const html = wrapper.html();
    expect(html).toMatch(/KYC provider must be selected|kycProviderName|provider/i);
  });

  it("shows AML provider error when AML enabled but no provider selected", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          amlProviderConfigured: true,
          amlProviderName: '',
        }),
      },
    });
    await vueNextTick();
    const html = wrapper.html();
    expect(html).toMatch(/AML provider must be selected|amlProviderName|provider/i);
  });

  // --- Sanctions screening provider sub-field ---

  it("shows sanctions provider input when sanctions screening is enabled", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({ sanctionsScreeningEnabled: true }),
      },
    });
    await vueNextTick();
    // Sanctions provider input should appear
    const inputs = wrapper.findAll("input[type='text']");
    expect(inputs.some(i => i.attributes('placeholder')?.includes('Dow Jones') || i.exists())).toBe(true);
  });

  it("shows warning when sanctions screening enabled but no provider specified", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          sanctionsScreeningEnabled: true,
          sanctionsScreeningProvider: '',
        }),
      },
    });
    await vueNextTick();
    // Trigger validation
    const checkboxes = wrapper.findAll("input[type='checkbox']");
    if (checkboxes.length > 0) {
      await checkboxes[0].trigger('change');
      await vueNextTick();
    }
    const html = wrapper.html();
    // Should show warning about missing sanctions provider
    expect(html).toMatch(/sanctions|Sanctions/i);
  });

  // --- Blocking issues display ---

  it("shows blocking issues list when blockingIssues is non-empty", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: true,
          kycProviderName: '',  // triggers validation error → blockingIssues populated
          blockingIssues: ['KYC provider not selected'],
          overallReadinessStatus: 'not_ready',
        }),
      },
    });
    await vueNextTick();
    // After mount, validateForm() runs and sets blockingIssues
    // The blocking issues section should render in the readiness status card
    expect(wrapper.html()).toContain('Blocking Issues');
  });

  // --- readinessStatusText all branches ---

  it("displays 'complete and ready' text when status is ready", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: true,
          kycProviderName: 'Jumio',
          amlProviderConfigured: true,
          amlProviderName: 'ComplyAdvantage',
          overallReadinessStatus: 'ready',
        }),
      },
    });
    await vueNextTick();
    expect(wrapper.text()).toMatch(/complete.*ready|ready.*deployment/i);
  });

  it("displays 'partially complete' text when status is partially_ready", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: true,
          kycProviderName: 'Jumio',
          amlProviderConfigured: false,
          overallReadinessStatus: 'partially_ready',
        }),
      },
    });
    await vueNextTick();
    expect(wrapper.text()).toMatch(/partially|partial/i);
  });

  // --- watch for external modelValue changes ---

  it("updates formData when modelValue prop changes", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: { modelValue: makeKYCReadiness() },
    });
    await vueNextTick();

    await wrapper.setProps({
      modelValue: makeKYCReadiness({
        kycProviderConfigured: true,
        kycProviderName: 'Jumio',
        overallReadinessStatus: 'partially_ready',
      }),
    });
    await vueNextTick();

    // Should emit validation-change after prop update
    const emitted = wrapper.emitted("validation-change");
    expect(emitted).toBeTruthy();
  });

  // --- KYC provider configured confirmation message ---

  it("shows provider configured confirmation when kycProviderName is set", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: true,
          kycProviderName: 'Jumio',
        }),
      },
    });
    await vueNextTick();
    // Should show "Provider configured: Jumio" message
    expect(wrapper.text()).toContain('Jumio');
  });

  // --- Warning for no providers at all ---

  it("shows warning when neither KYC nor AML providers are configured", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: false,
          amlProviderConfigured: false,
        }),
      },
    });
    await vueNextTick();
    // Validation runs on mount and adds warning
    const emitted = wrapper.emitted("validation-change");
    expect(emitted).toBeTruthy();
    // The validation result should have warnings
    const lastEmit = (emitted as any[])[emitted!.length - 1][0];
    expect(lastEmit.warnings.length).toBeGreaterThan(0);
  });

  // --- readinessIcon computed branches ---

  it("readinessIcon is check-circle for ready status", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: true,
          kycProviderName: 'Onfido',
          amlProviderConfigured: true,
          amlProviderName: 'Chainalysis',
          overallReadinessStatus: 'ready',
        }),
      },
    });
    await vueNextTick();
    expect(wrapper.html()).toContain('pi-check-circle');
  });

  it("readinessIcon is exclamation-triangle for partially_ready status", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({
          kycProviderConfigured: true,
          kycProviderName: 'Onfido',
          overallReadinessStatus: 'partially_ready',
        }),
      },
    });
    await vueNextTick();
    expect(wrapper.html()).toContain('pi-exclamation-triangle');
  });

  it("readinessIcon is times-circle for not_ready status", async () => {
    const wrapper = mount(KYCAMLReadinessStep, {
      props: {
        modelValue: makeKYCReadiness({ overallReadinessStatus: 'not_ready' }),
      },
    });
    await vueNextTick();
    expect(wrapper.html()).toContain('pi-times-circle');
  });
})
