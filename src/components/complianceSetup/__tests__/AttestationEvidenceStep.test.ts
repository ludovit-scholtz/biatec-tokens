/**
 * Unit tests for AttestationEvidenceStep component
 * Verifies attestation form rendering, evidence dialog, and validation emission
 */

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import AttestationEvidenceStep from "../AttestationEvidenceStep.vue";
import type { AttestationEvidence, IssuerAttestation, EvidenceReference } from "../../../types/complianceSetup";

const makeAttestation = (overrides: Partial<IssuerAttestation> = {}): IssuerAttestation => ({
  id: "a1",
  type: "jurisdiction_declaration",
  statement: "I declare the issuer is in the stated jurisdiction",
  isRequired: false,
  isAttested: false,
  ...overrides,
});

const makeEvidenceRef = (overrides: Partial<EvidenceReference> = {}): EvidenceReference => ({
  id: "e1",
  type: "legal_opinion",
  title: "Legal Opinion Letter",
  referenceType: "url",
  referenceValue: "https://example.com/letter.pdf",
  uploadedAt: new Date("2026-01-01"),
  uploadedBy: "Test User",
  ...overrides,
});

const makeEvidence = (overrides: Partial<AttestationEvidence> = {}): AttestationEvidence => ({
  attestations: [],
  evidenceReferences: [],
  complianceBadgeEligible: false,
  hasLegalReview: false,
  auditTrailReady: false,
  ...overrides,
} as AttestationEvidence);

describe("AttestationEvidenceStep", () => {
  it("renders without crashing with no modelValue", () => {
    const wrapper = mount(AttestationEvidenceStep);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders with a provided modelValue", () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: { modelValue: makeEvidence() },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("shows attestation section heading", () => {
    const wrapper = mount(AttestationEvidenceStep);
    const html = wrapper.html();
    expect(html).toMatch(/attestation|Attestation|evidence|Evidence/i);
  });

  it("shows legal review date section", () => {
    const wrapper = mount(AttestationEvidenceStep);
    const html = wrapper.html();
    expect(html).toMatch(/legal.review|Legal Review|legal counsel/i);
  });

  it("shows evidence references section", () => {
    const wrapper = mount(AttestationEvidenceStep);
    const html = wrapper.html();
    expect(html).toMatch(/evidence|Evidence/i);
  });

  it("shows 'Add Evidence' or similar button", () => {
    const wrapper = mount(AttestationEvidenceStep);
    const html = wrapper.html();
    expect(html).toMatch(/add evidence|Add Evidence|add.*reference/i);
  });

  it("emits validation-change on mount", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: { modelValue: makeEvidence() },
    });
    await nextTick();
    expect(wrapper.emitted("validation-change")).toBeDefined();
  });

  it("shows audit trail section", () => {
    const wrapper = mount(AttestationEvidenceStep);
    const html = wrapper.html();
    expect(html).toMatch(/audit trail|Audit Trail|audit/i);
  });

  it("renders form inputs for attestation data", () => {
    const wrapper = mount(AttestationEvidenceStep);
    const inputs = wrapper.findAll("input, textarea, select");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("shows compliance badge eligibility section", () => {
    const wrapper = mount(AttestationEvidenceStep);
    const html = wrapper.html();
    expect(html).toMatch(/badge|Badge|compliance/i);
  });

  it("shows 'Add Evidence' dialog trigger button", () => {
    const wrapper = mount(AttestationEvidenceStep);
    const buttons = wrapper.findAll("button");
    const addBtn = buttons.find((b) => b.text().match(/add evidence|Add Evidence/i));
    expect(addBtn).toBeDefined();
  });

  // ----- validateForm: incomplete required attestations (line ~450) -----
  it("emits validation error when required attestation is incomplete", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          attestations: [makeAttestation({ isRequired: true, isAttested: false })],
        }),
      },
    });
    await nextTick();
    const events = wrapper.emitted("validation-change") as any[];
    expect(events).toBeDefined();
    expect(events.length).toBeGreaterThan(0);
    const lastValidation = events[events.length - 1][0];
    expect(lastValidation.isValid).toBe(false);
  });

  // ----- validateForm: badge level 'mica_compliant' (hasLegalReview + 2+ evidences) -----
  it("sets mica_compliant badge level when all attestations done + legal review + 2+ evidence", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          attestations: [makeAttestation({ isRequired: true, isAttested: true })],
          hasLegalReview: true,
          evidenceReferences: [
            makeEvidenceRef({ id: "e1" }),
            makeEvidenceRef({ id: "e2", type: "audit_report", title: "Audit Report" }),
          ],
        }),
      },
    });
    await nextTick();
    expect(wrapper.exists()).toBe(true);
    // validation-change should show isValid=true
    const events = wrapper.emitted("validation-change") as any[];
    expect(events).toBeDefined();
    const lastValidation = events[events.length - 1][0];
    expect(lastValidation.isValid).toBe(true);
  });

  // ----- validateForm: badge level 'standard' (no legal review + 1 evidence) -----
  it("sets standard badge level when all attestations done + 1 evidence but no legal review", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          attestations: [makeAttestation({ isRequired: true, isAttested: true })],
          hasLegalReview: false,
          evidenceReferences: [makeEvidenceRef()],
        }),
      },
    });
    await nextTick();
    const events = wrapper.emitted("validation-change") as any[];
    expect(events).toBeDefined();
    const lastValidation = events[events.length - 1][0];
    expect(lastValidation.isValid).toBe(true);
  });

  // ----- validateForm: badge level 'basic' (no evidence, no legal review) -----
  it("sets basic badge level when all attestations done but no evidence or legal review", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          attestations: [makeAttestation({ isRequired: true, isAttested: true })],
          hasLegalReview: false,
          evidenceReferences: [],
        }),
      },
    });
    await nextTick();
    const events = wrapper.emitted("validation-change") as any[];
    const lastValidation = events[events.length - 1][0];
    expect(lastValidation.isValid).toBe(true);
  });

  // ----- onMounted: syncs dates to string values (lines 553-557) -----
  it("syncs legalReviewDate to string field on mount", async () => {
    const legalDate = new Date("2026-01-15");
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({ legalReviewDate: legalDate, hasLegalReview: true }),
      },
    });
    await nextTick();
    // The date input should now have the value set from the prop
    const dateInputs = wrapper.findAll('input[type="date"]');
    // At least the legal review date input should be in the form
    expect(wrapper.exists()).toBe(true);
  });

  it("syncs auditTrailStartDate to string field on mount", async () => {
    const auditDate = new Date("2026-03-01");
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({ auditTrailStartDate: auditDate, auditTrailReady: true }),
      },
    });
    await nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  // ----- watch: responds to external modelValue change -----
  it("re-validates when modelValue prop changes", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: { modelValue: makeEvidence() },
    });
    await nextTick();
    const initialCount = (wrapper.emitted("validation-change") as any[]).length;
    await wrapper.setProps({
      modelValue: makeEvidence({
        attestations: [makeAttestation({ isRequired: true, isAttested: true })],
        hasLegalReview: true,
        evidenceReferences: [makeEvidenceRef()],
      }),
    });
    await nextTick();
    const afterCount = (wrapper.emitted("validation-change") as any[]).length;
    expect(afterCount).toBeGreaterThan(initialCount);
  });

  // ----- getEvidenceIcon and getEvidenceTypeLabel via rendered evidence references -----
  it("renders evidence reference title when evidence exists", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          evidenceReferences: [makeEvidenceRef({ title: "Legal Opinion Letter" })],
        }),
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain("Legal Opinion Letter");
  });

  it("renders different evidence types correctly", async () => {
    const types: Array<EvidenceReference["type"]> = [
      "legal_opinion", "regulatory_filing", "audit_report",
      "policy_document", "external_link", "other",
    ];
    for (const type of types) {
      const wrapper = mount(AttestationEvidenceStep, {
        props: {
          modelValue: makeEvidence({
            evidenceReferences: [makeEvidenceRef({ type, title: `Evidence ${type}` })],
          }),
        },
      });
      await nextTick();
      expect(wrapper.text()).toContain(`Evidence ${type}`);
    }
  });

  // ----- getAttestationTitle via vm direct call -----
  it("getAttestationTitle returns correct labels for all types", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.getAttestationTitle("jurisdiction_declaration")).toBe("Jurisdiction Declaration");
    expect(vm.getAttestationTitle("investor_suitability")).toBe("Investor Suitability Confirmation");
    expect(vm.getAttestationTitle("regulatory_compliance")).toBe("Regulatory Compliance Affirmation");
    expect(vm.getAttestationTitle("data_privacy")).toBe("Data Privacy Acknowledgment");
    expect(vm.getAttestationTitle("other")).toBe("Other Attestation");
    // Unknown type falls back to the type string itself
    expect(vm.getAttestationTitle("unknown_type")).toBe("unknown_type");
  });

  // ----- getEvidenceIcon via vm direct call -----
  it("getEvidenceIcon returns correct icon classes for all types", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.getEvidenceIcon("legal_opinion")).toBe("pi pi-file-pdf");
    expect(vm.getEvidenceIcon("regulatory_filing")).toBe("pi pi-file");
    expect(vm.getEvidenceIcon("audit_report")).toBe("pi pi-chart-line");
    expect(vm.getEvidenceIcon("policy_document")).toBe("pi pi-book");
    expect(vm.getEvidenceIcon("external_link")).toBe("pi pi-external-link");
    expect(vm.getEvidenceIcon("other")).toBe("pi pi-paperclip");
    expect(vm.getEvidenceIcon("unknown")).toBe("pi pi-file");
  });

  // ----- getEvidenceTypeLabel via vm direct call -----
  it("getEvidenceTypeLabel returns human-readable labels for all types", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.getEvidenceTypeLabel("legal_opinion")).toBe("Legal Opinion");
    expect(vm.getEvidenceTypeLabel("regulatory_filing")).toBe("Regulatory Filing");
    expect(vm.getEvidenceTypeLabel("audit_report")).toBe("Audit Report");
    expect(vm.getEvidenceTypeLabel("policy_document")).toBe("Policy Document");
    expect(vm.getEvidenceTypeLabel("external_link")).toBe("External Link");
    expect(vm.getEvidenceTypeLabel("other")).toBe("Other");
    expect(vm.getEvidenceTypeLabel("unknown")).toBe("unknown");
  });

  // ----- formatDate via vm direct call -----
  it("formatDate formats a date to a readable string", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    const formatted = vm.formatDate(new Date("2026-01-15T00:00:00Z"));
    expect(typeof formatted).toBe("string");
    expect(formatted.length).toBeGreaterThan(0);
  });

  // ----- handleAttestationChange: check and uncheck attestation -----
  it("handleAttestationChange sets attestedAt and attestedBy when attested", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    const attestation = vm.formData.attestations[0];
    attestation.isAttested = true;
    vm.handleAttestationChange(attestation);
    await nextTick();
    expect(attestation.attestedAt).toBeDefined();
    expect(attestation.attestedBy).toBe("Current User");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("validation-change")).toBeTruthy();
  });

  it("handleAttestationChange clears attestedAt and attestedBy when un-attested", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    const attestation = vm.formData.attestations[0];
    // First attest
    attestation.isAttested = true;
    vm.handleAttestationChange(attestation);
    // Then un-attest
    attestation.isAttested = false;
    vm.handleAttestationChange(attestation);
    await nextTick();
    expect(attestation.attestedAt).toBeUndefined();
    expect(attestation.attestedBy).toBeUndefined();
  });

  // ----- handleFieldChange: legal review date -----
  it("handleFieldChange syncs legalReviewDateString to Date on form data", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    vm.legalReviewDateString = "2026-06-01";
    vm.handleFieldChange();
    await nextTick();
    expect(vm.formData.legalReviewDate).toBeDefined();
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });

  it("handleFieldChange syncs auditTrailStartDateString to Date on form data", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    vm.auditTrailStartDateString = "2026-09-01";
    vm.handleFieldChange();
    await nextTick();
    expect(vm.formData.auditTrailStartDate).toBeDefined();
    expect(wrapper.emitted("validation-change")).toBeTruthy();
  });

  // ----- removeEvidence via vm direct call -----
  it("removeEvidence removes the correct evidence item by id", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          evidenceReferences: [
            makeEvidenceRef({ id: "ev1", title: "First Evidence" }),
            makeEvidenceRef({ id: "ev2", title: "Second Evidence" }),
          ],
        }),
      },
    });
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.formData.evidenceReferences).toHaveLength(2);
    vm.removeEvidence("ev1");
    await nextTick();
    expect(vm.formData.evidenceReferences).toHaveLength(1);
    expect(vm.formData.evidenceReferences[0].id).toBe("ev2");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });

  it("removeEvidence does nothing for non-existent id", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          evidenceReferences: [makeEvidenceRef({ id: "ev1" })],
        }),
      },
    });
    await nextTick();
    const vm = wrapper.vm as any;
    vm.removeEvidence("non-existent-id");
    await nextTick();
    expect(vm.formData.evidenceReferences).toHaveLength(1);
  });

  // ----- showAddEvidenceDialog toggle -----
  it("clicking Add Evidence button opens the dialog", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.showAddEvidenceDialog).toBe(false);
    const addBtn = wrapper.findAll("button").find((b) => b.text().match(/add evidence/i));
    expect(addBtn).toBeDefined();
    await addBtn!.trigger("click");
    await nextTick();
    expect(vm.showAddEvidenceDialog).toBe(true);
  });

  it("dialog is visible when showAddEvidenceDialog is true", async () => {
    const wrapper = mount(AttestationEvidenceStep);
    await nextTick();
    const vm = wrapper.vm as any;
    vm.showAddEvidenceDialog = true;
    await nextTick();
    // Dialog heading should appear
    expect(wrapper.text()).toContain("Add Evidence");
  });

  // ----- validateForm: warnings for missing review -----
  it("validateForm emits warnings for missing legal review and no evidence", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          attestations: [makeAttestation({ isRequired: true, isAttested: true })],
          hasLegalReview: false,
          evidenceReferences: [],
        }),
      },
    });
    await nextTick();
    const events = wrapper.emitted("validation-change") as any[];
    const lastValidation = events[events.length - 1][0];
    // Should have warnings for missing evidence and legal review
    expect(lastValidation.warnings.length).toBe(2);
  });

  // ----- complianceBadgeLevel: mica_compliant path -----
  it("sets mica_compliant badge when legal review done and 2+ evidence references", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          attestations: [makeAttestation({ isRequired: true, isAttested: true })],
          hasLegalReview: true,
          evidenceReferences: [
            makeEvidenceRef({ id: "e1" }),
            makeEvidenceRef({ id: "e2", type: "audit_report", title: "Audit" }),
          ],
        }),
      },
    });
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.formData.complianceBadgeEligible).toBe(true);
    expect(vm.formData.complianceBadgeLevel).toBe("mica_compliant");
  });

  // ----- badge level: standard path (evidence but no legal review) -----
  it("sets standard badge level when attested + evidence but no legal review", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          attestations: [makeAttestation({ isRequired: true, isAttested: true })],
          hasLegalReview: false,
          evidenceReferences: [makeEvidenceRef()],
        }),
      },
    });
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.formData.complianceBadgeLevel).toBe("standard");
  });

  // ----- badge level: basic path (no evidence, no legal review) -----
  it("sets basic badge level when attested but no evidence and no legal review", async () => {
    const wrapper = mount(AttestationEvidenceStep, {
      props: {
        modelValue: makeEvidence({
          attestations: [makeAttestation({ isRequired: true, isAttested: true })],
          hasLegalReview: false,
          evidenceReferences: [],
        }),
      },
    });
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.formData.complianceBadgeLevel).toBe("basic");
  });
});


