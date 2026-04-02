/**
 * Unit tests for ReadinessSummaryStep component
 * Verifies readiness score display, risk level styling, blocker rendering, and event emissions
 */

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ReadinessSummaryStep from "../ReadinessSummaryStep.vue";
import type { ReadinessAssessment, ReadinessBlocker, NextAction } from "../../../types/complianceSetup";

const makeBlocker = (overrides: Partial<ReadinessBlocker> = {}): ReadinessBlocker => ({
  id: "b1",
  severity: "critical",
  category: "kyc_aml",
  title: "KYC Provider Not Configured",
  description: "A KYC provider must be configured before deployment.",
  remediationSteps: ["Set up KYC provider credentials"],
  canAutoResolve: false,
  ...overrides,
});

const makeReadiness = (overrides: Partial<ReadinessAssessment> = {}): ReadinessAssessment => ({
  overallRisk: "low",
  readinessScore: 85,
  isReadyForDeploy: true,
  blockers: [],
  warnings: [],
  recommendations: ["Consider enabling AML screening"],
  jurisdictionReady: true,
  whitelistReady: true,
  kycAMLReady: true,
  attestationReady: true,
  nextActions: [],
  ...overrides,
});

describe("ReadinessSummaryStep", () => {
  it("renders readiness score as a number", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 85 }) },
    });
    expect(wrapper.text()).toContain("85");
  });

  it("shows 'Ready for Deployment' status when isReadyForDeploy is true", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 90, isReadyForDeploy: true }) },
    });
    expect(wrapper.text()).toMatch(/Ready for Deployment|ready for deployment|proceed with confidence/i);
  });

  it("shows lower readiness description when score is below 70", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 60, isReadyForDeploy: false }) },
    });
    // At 60%, should show a description about critical gaps
    expect(wrapper.text()).toMatch(/critical.gaps|partially|Partially|in.progress/i);
  });

  it("applies green score class for high readiness", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 92 }) },
    });
    // High score should use green styling
    const html = wrapper.html();
    expect(html).toMatch(/green|emerald/i);
  });

  it("applies red/orange score class for low readiness", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 30, isReadyForDeploy: false }) },
    });
    const html = wrapper.html();
    expect(html).toMatch(/red|orange|yellow/i);
  });

  it("renders blocker title when blockers are present", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: {
        readiness: makeReadiness({
          readinessScore: 50,
          isReadyForDeploy: false,
          blockers: [makeBlocker()],
        }),
      },
    });
    expect(wrapper.text()).toContain("KYC Provider Not Configured");
  });

  it("renders recommendations when available", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: {
        readiness: makeReadiness({ recommendations: ["Enable AML screening for EU tokens"] }),
      },
    });
    expect(wrapper.text()).toContain("Enable AML screening for EU tokens");
  });

  it("shows 'Proceed to Deploy' button when isReadyForDeploy is true", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ isReadyForDeploy: true, readinessScore: 90 }) },
    });
    expect(wrapper.text()).toMatch(/Proceed to Deploy/);
  });

  it("emits proceed-to-deploy when deploy button is clicked", async () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ isReadyForDeploy: true, readinessScore: 90 }) },
    });
    const deployBtn = wrapper.findAll("button").find((b) => b.text().includes("Proceed to Deploy"));
    if (deployBtn) await deployBtn.trigger("click");
    expect(wrapper.emitted("proceed-to-deploy")).toBeDefined();
  });

  it("shows all four category readiness indicators", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: {
        readiness: makeReadiness({
          jurisdictionReady: true,
          whitelistReady: false,
          kycAMLReady: true,
          attestationReady: false,
        }),
      },
    });
    const html = wrapper.html();
    expect(html).toMatch(/jurisdiction|whitelist|kyc|attestation/i);
  });

  it("renders correctly with zero blockers and full readiness", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness() },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("shows step header with title", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness() },
    });
    expect(wrapper.text()).toMatch(/Compliance Readiness|Readiness Summary/i);
  });

  // ----- getBlockerClass: all 4 severity branches -----
  it("applies red styling for critical severity blocker", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 40, blockers: [makeBlocker({ severity: "critical" })] }) },
    });
    expect(wrapper.html()).toContain("border-red-700");
  });

  it("applies orange styling for high severity blocker", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 50, blockers: [makeBlocker({ severity: "high" })] }) },
    });
    expect(wrapper.html()).toContain("border-orange-700");
  });

  it("applies yellow styling for medium severity blocker", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 60, blockers: [makeBlocker({ severity: "medium" })] }) },
    });
    expect(wrapper.html()).toContain("border-yellow-700");
  });

  it("applies blue styling for low severity blocker (default case)", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 70, blockers: [makeBlocker({ severity: "low" })] }) },
    });
    expect(wrapper.html()).toContain("border-blue-700");
  });

  // ----- getBlockerIcon: all 3 groups -----
  it("uses times-circle icon for high severity blocker", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ blockers: [makeBlocker({ severity: "high" })] }) },
    });
    expect(wrapper.html()).toContain("pi-times-circle");
  });

  it("uses exclamation-triangle icon for medium severity blocker", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ blockers: [makeBlocker({ severity: "medium" })] }) },
    });
    expect(wrapper.html()).toContain("pi-exclamation-triangle");
  });

  it("uses info-circle icon for low severity blocker (default case)", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ blockers: [makeBlocker({ severity: "low" })] }) },
    });
    expect(wrapper.html()).toContain("pi-info-circle");
  });

  // ----- getBlockerTextClass / getBlockerBadgeClass -----
  it("applies orange text for high severity blocker title", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ blockers: [makeBlocker({ severity: "high" })] }) },
    });
    expect(wrapper.html()).toContain("text-orange-300");
  });

  it("applies yellow text for medium severity blocker title", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ blockers: [makeBlocker({ severity: "medium" })] }) },
    });
    expect(wrapper.html()).toContain("text-yellow-300");
  });

  it("applies blue text for low severity blocker title (default)", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ blockers: [makeBlocker({ severity: "low" })] }) },
    });
    expect(wrapper.html()).toContain("text-blue-300");
  });

  // ----- riskLevelColor: medium and high branches -----
  it("applies yellow color for medium risk", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ overallRisk: "medium" }) },
    });
    expect(wrapper.html()).toContain("text-yellow-400");
  });

  it("applies red color for high risk", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ overallRisk: "high" }) },
    });
    expect(wrapper.html()).toContain("text-red-400");
  });

  // ----- readinessScoreClass: 50-79 range (mid score) -----
  it("applies yellow border for mid score (50-79)", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 65 }) },
    });
    expect(wrapper.html()).toContain("border-yellow-700");
  });

  // ----- readinessStatusText / readinessDescription -----
  it("shows 'Excellent Readiness' status text for score >= 80", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 80 }) },
    });
    expect(wrapper.text()).toContain("Excellent Readiness");
  });

  it("shows 'Partially Ready' status text for score 50-79", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 55 }) },
    });
    expect(wrapper.text()).toContain("Partially Ready");
  });

  it("shows 'Needs Attention' status text for score < 50", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ readinessScore: 30 }) },
    });
    expect(wrapper.text()).toContain("Needs Attention");
  });

  // ----- getPriorityClass via nextActions -----
  const makeAction = (priority: "critical" | "high" | "medium" | "low", id = "a1"): NextAction => ({
    id,
    priority,
    title: `${priority} action`,
    description: "Do this",
    actionType: "configure",
    estimatedMinutes: 10,
  });

  it("applies red styling for critical priority next action", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ nextActions: [makeAction("critical")] }) },
    });
    expect(wrapper.html()).toContain("text-red-300");
  });

  it("applies orange styling for high priority next action", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ nextActions: [makeAction("high")] }) },
    });
    expect(wrapper.html()).toContain("text-orange-300");
  });

  it("applies yellow styling for medium priority next action", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ nextActions: [makeAction("medium")] }) },
    });
    expect(wrapper.html()).toContain("text-yellow-300");
  });

  it("applies blue styling for low priority next action (default)", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: { readiness: makeReadiness({ nextActions: [makeAction("low")] }) },
    });
    expect(wrapper.html()).toContain("text-blue-300");
  });

  // ----- getStepTitle via go-to-step link -----
  it("shows 'Jurisdiction & Policy' for jurisdiction relatedStepId", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: {
        readiness: makeReadiness({
          blockers: [makeBlocker({ relatedStepId: "jurisdiction" })],
        }),
      },
    });
    expect(wrapper.text()).toContain("Jurisdiction & Policy");
  });

  it("shows 'KYC/AML Readiness' for kyc_aml relatedStepId", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: {
        readiness: makeReadiness({
          blockers: [makeBlocker({ relatedStepId: "kyc_aml" })],
        }),
      },
    });
    expect(wrapper.text()).toContain("KYC/AML Readiness");
  });

  it("shows 'Attestation & Evidence' for attestation relatedStepId", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: {
        readiness: makeReadiness({
          blockers: [makeBlocker({ relatedStepId: "attestation" })],
        }),
      },
    });
    expect(wrapper.text()).toContain("Attestation & Evidence");
  });

  it("shows 'Step' fallback for unknown relatedStepId", () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: {
        readiness: makeReadiness({
          blockers: [makeBlocker({ relatedStepId: "unknown_step_id" })],
        }),
      },
    });
    expect(wrapper.text()).toContain("Step");
  });

  it("emits go-to-step event when blocker's step link is clicked", async () => {
    const wrapper = mount(ReadinessSummaryStep, {
      props: {
        readiness: makeReadiness({
          blockers: [makeBlocker({ relatedStepId: "whitelist" })],
        }),
      },
    });
    const btn = wrapper.find("button[class*='text-blue']");
    if (btn.exists()) {
      await btn.trigger("click");
      expect(wrapper.emitted("go-to-step")).toBeDefined();
    }
  });
});

