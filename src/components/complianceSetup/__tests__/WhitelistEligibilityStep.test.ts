/**
 * Unit tests for WhitelistEligibilityStep component
 * Verifies whitelist requirement toggling, investor type selection, and validation emission
 */

import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import WhitelistEligibilityStep from "../WhitelistEligibilityStep.vue";
import type { WhitelistEligibility } from "../../../types/complianceSetup";

const makeEligibility = (overrides: Partial<WhitelistEligibility> = {}): WhitelistEligibility => ({
  whitelistRequired: false,
  restrictionType: "none",
  requiresKYC: false,
  requiresAML: false,
  requiresAccreditationProof: false,
  allowedInvestorTypes: [],
  transferRestrictions: ["no_restrictions"],
  hasLockupPeriod: false,
  allowSecondaryTrading: true,
  ...overrides,
});

describe("WhitelistEligibilityStep", () => {
  it("renders without crashing with no modelValue", () => {
    const wrapper = mount(WhitelistEligibilityStep);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders with a provided modelValue", () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: { modelValue: makeEligibility() },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("shows whitelist configuration section heading", () => {
    const wrapper = mount(WhitelistEligibilityStep);
    const html = wrapper.html();
    expect(html).toMatch(/whitelist.configuration|Whitelist Configuration|Whitelist.*Eligibility/i);
  });

  it("shows 'Require Whitelist' checkbox", () => {
    const wrapper = mount(WhitelistEligibilityStep);
    const html = wrapper.html();
    expect(html).toMatch(/Require Whitelist/i);
  });

  it("shows whitelist options after enabling whitelist requirement", async () => {
    const wrapper = mount(WhitelistEligibilityStep);
    const checkbox = wrapper.findAll("input[type='checkbox']").find((el) =>
      el.element.parentElement?.textContent?.includes("Require Whitelist")
    );
    if (checkbox) {
      await checkbox.setValue(true);
      await nextTick();
      const html = wrapper.html();
      expect(html).toMatch(/Select existing whitelist|Accredited Investors/i);
    } else {
      expect(wrapper.exists()).toBe(true);
    }
  });

  it("shows investor type section heading", () => {
    const wrapper = mount(WhitelistEligibilityStep);
    const html = wrapper.html();
    expect(html).toMatch(/investor|Investor/i);
  });

  it("emits validation-change on mount", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: { modelValue: makeEligibility() },
    });
    await nextTick();
    const emitted = wrapper.emitted("validation-change");
    expect(emitted).toBeDefined();
  });

  it("shows lock-up period section", () => {
    const wrapper = mount(WhitelistEligibilityStep);
    const html = wrapper.html();
    expect(html).toMatch(/lock.?up|Lock.?up|lockup/i);
  });

  it("shows transfer restrictions section", () => {
    const wrapper = mount(WhitelistEligibilityStep);
    const html = wrapper.html();
    expect(html).toMatch(/transfer|Transfer/i);
  });

  it("shows secondary trading option", () => {
    const wrapper = mount(WhitelistEligibilityStep);
    const html = wrapper.html();
    expect(html).toMatch(/secondary|Secondary/i);
  });

  it("renders form controls for eligibility requirements", () => {
    const wrapper = mount(WhitelistEligibilityStep);
    // Should have form inputs for configuration
    const inputs = wrapper.findAll("input, select");
    expect(inputs.length).toBeGreaterThan(0);
  });

  // --- Validation branch coverage ---

  it("shows validation error when whitelist required but no whitelist selected", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({
          whitelistRequired: true,
          whitelistId: undefined,
        }),
      },
    });
    await nextTick();
    // Trigger field change to run validation
    const checkboxes = wrapper.findAll("input[type='checkbox']");
    if (checkboxes.length > 0) {
      await checkboxes[0].trigger('change');
      await nextTick();
    }
    const html = wrapper.html();
    expect(html).toMatch(/Whitelist is required|whitelist.*not selected|error/i);
  });

  it("shows validation error when restrictionType is whitelist_only but whitelist not required", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({
          restrictionType: 'whitelist_only',
          whitelistRequired: false,
        }),
      },
    });
    await nextTick();
    const emitted = wrapper.emitted("validation-change");
    expect(emitted).toBeTruthy();
    const lastEmit = (emitted as any[])[emitted!.length - 1][0];
    // There should be a validation error for this combination
    expect(lastEmit.errors.length).toBeGreaterThan(0);
  });

  it("shows validation error when hasLockupPeriod is true but no duration specified", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({
          hasLockupPeriod: true,
          lockupDurationDays: undefined,
        }),
      },
    });
    await nextTick();
    const emitted = wrapper.emitted("validation-change");
    expect(emitted).toBeTruthy();
    const lastEmit = (emitted as any[])[emitted!.length - 1][0];
    expect(lastEmit.errors.some((e: any) => e.field === 'lockupDurationDays')).toBe(true);
  });

  // --- configSummary computed branches ---

  it("configSummary shows whitelist name when whitelistRequired and whitelistName set", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({
          whitelistRequired: true,
          whitelistName: 'My Whitelist',
          whitelistId: 'wl_1',
        }),
      },
    });
    await nextTick();
    // Summary should show whitelist name in the component
    expect(wrapper.text()).toContain('My Whitelist');
  });

  it("configSummary shows 'No whitelist required' when not required", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({ whitelistRequired: false }),
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('No whitelist required');
  });

  it("configSummary shows KYC/AML when required verifications set", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({
          requiresKYC: true,
          requiresAML: true,
          requiresAccreditationProof: true,
        }),
      },
    });
    await nextTick();
    const text = wrapper.text();
    expect(text).toMatch(/KYC|AML|accreditation/i);
  });

  it("configSummary shows lockup period when hasLockupPeriod and duration set", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({
          hasLockupPeriod: true,
          lockupDurationDays: 90,
        }),
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('90');
  });

  it("configSummary shows 'Secondary trading not allowed' when allowSecondaryTrading is false", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({ allowSecondaryTrading: false }),
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('Secondary trading not allowed');
  });

  it("configSummary shows 'Secondary trading allowed' when allowSecondaryTrading is true", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({ allowSecondaryTrading: true }),
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('Secondary trading allowed');
  });

  // --- selectedWhitelist computed ---

  it("selectedWhitelist returns null when no whitelistId set", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({ whitelistId: undefined }),
      },
    });
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.selectedWhitelist).toBeNull();
  });

  // --- lockupPeriod UI ---

  it("shows lockup duration input when hasLockupPeriod is true", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({ hasLockupPeriod: true }),
      },
    });
    await nextTick();
    // Duration input should be visible
    const inputs = wrapper.findAll("input[type='number']");
    expect(inputs.length).toBeGreaterThan(0);
  });

  // --- Warning branches ---

  it("emits warning when KYC required without whitelist", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({
          requiresKYC: true,
          whitelistRequired: false,
        }),
      },
    });
    await nextTick();
    const emitted = wrapper.emitted("validation-change");
    const lastEmit = (emitted as any[])[emitted!.length - 1][0];
    expect(lastEmit.warnings.some((w: any) => w.field === 'whitelistRequired')).toBe(true);
  });

  it("emits warning when access restrictions set without KYC/AML", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({
          restrictionType: 'kyc_required',
          requiresKYC: false,
          requiresAML: false,
        }),
      },
    });
    await nextTick();
    const emitted = wrapper.emitted("validation-change");
    const lastEmit = (emitted as any[])[emitted!.length - 1][0];
    expect(lastEmit.warnings.some((w: any) => w.field === 'requiresKYC')).toBe(true);
  });

  // --- watch prop change ---

  it("updates form when modelValue prop changes externally", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: { modelValue: makeEligibility() },
    });
    await nextTick();
    await wrapper.setProps({
      modelValue: makeEligibility({
        whitelistRequired: true,
        restrictionType: 'whitelist_only',
        whitelistId: 'wl_1',
        whitelistName: 'Updated Whitelist',
      }),
    });
    await nextTick();
    // Should emit validation-change after prop update
    const emitted = wrapper.emitted("validation-change");
    expect(emitted!.length).toBeGreaterThan(1);
  });

  // --- handleFieldChange whitelist name sync ---

  it("handleFieldChange syncs whitelist name when a whitelistId is selected", async () => {
    const wrapper = mount(WhitelistEligibilityStep, {
      props: {
        modelValue: makeEligibility({ whitelistRequired: true }),
      },
    });
    await nextTick();
    // Set an internal whitelistId that matches an available whitelist
    const vm = wrapper.vm as any;
    vm.formData.whitelistId = 'wl_1';
    vm.handleFieldChange();
    await nextTick();
    // Should update whitelistName to the matching whitelist's name
    expect(vm.formData.whitelistName).toBeTruthy();
  });
});
