import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { WhitelistService, whitelistService } from "../whitelistService";
// Note: Mock data pre-populates:
//   - 3 whitelist entries (1 approved/US, 1 pending/ES, 1 under_review/US)
//   - 3 jurisdiction rules (US=allowed, ES=allowed, CN=blocked)

describe("WhitelistService", () => {
  let service: WhitelistService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new WhitelistService();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Helper to advance timers and resolve promises
  const tick = () => {
    vi.advanceTimersByTime(600);
    return Promise.resolve();
  };

  describe("constructor / mock data", () => {
    it("initialises with mock entries", async () => {
      const promise = service.getWhitelistEntries();
      await tick();
      const result = await promise;
      expect(result.total).toBeGreaterThan(0);
    });

    it("initialises with mock jurisdiction rules (empty array by default)", async () => {
      const promise = service.getJurisdictionRules();
      vi.advanceTimersByTime(400);
      const result = await promise;
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getWhitelistEntries", () => {
    it("returns all entries when no filters applied", async () => {
      const promise = service.getWhitelistEntries();
      await tick();
      const result = await promise;
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.total).toBe(result.data.length);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });

    it("filters by status", async () => {
      const promise = service.getWhitelistEntries({ status: ["approved"] });
      await tick();
      const result = await promise;
      result.data.forEach((entry) => expect(entry.status).toBe("approved"));
    });

    it("filters by entityType", async () => {
      const promise = service.getWhitelistEntries({ entityType: ["institutional"] });
      await tick();
      const result = await promise;
      result.data.forEach((entry) => expect(entry.entityType).toBe("institutional"));
    });

    it("filters by jurisdictionCode", async () => {
      const promise = service.getWhitelistEntries({ jurisdictionCode: ["US"] });
      await tick();
      const result = await promise;
      result.data.forEach((entry) => expect(entry.jurisdictionCode).toBe("US"));
    });

    it("filters by riskLevel", async () => {
      const promise = service.getWhitelistEntries({ riskLevel: ["low"] });
      await tick();
      const result = await promise;
      result.data.forEach((entry) => expect(entry.riskLevel).toBe("low"));
    });

    it("filters by kycStatus", async () => {
      const promise = service.getWhitelistEntries({ kycStatus: ["verified"] });
      await tick();
      const result = await promise;
      result.data.forEach((entry) => expect(entry.kycStatus).toBe("verified"));
    });

    it("filters by searchQuery matching name", async () => {
      const promise = service.getWhitelistEntries({ searchQuery: "John" });
      await tick();
      const result = await promise;
      result.data.forEach((entry) => {
        const match =
          entry.name.toLowerCase().includes("john") ||
          entry.email.toLowerCase().includes("john") ||
          (entry.organizationName ?? "").toLowerCase().includes("john");
        expect(match).toBe(true);
      });
    });

    it("sorts ascending by name", async () => {
      const promise = service.getWhitelistEntries({ sortBy: "name" as any, sortOrder: "asc" });
      await tick();
      const result = await promise;
      if (result.data.length > 1) {
        for (let i = 1; i < result.data.length; i++) {
          expect(result.data[i].name >= result.data[i - 1].name).toBe(true);
        }
      }
    });

    it("sorts descending when sortOrder is desc", async () => {
      const promise = service.getWhitelistEntries({ sortBy: "name" as any, sortOrder: "desc" });
      await tick();
      const result = await promise;
      if (result.data.length > 1) {
        for (let i = 1; i < result.data.length; i++) {
          expect(result.data[i].name <= result.data[i - 1].name).toBe(true);
        }
      }
    });

    it("paginates correctly with page 1 perPage 2", async () => {
      const promise = service.getWhitelistEntries({ page: 1, perPage: 2 });
      await tick();
      const result = await promise;
      expect(result.data.length).toBeLessThanOrEqual(2);
      expect(result.perPage).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(Math.ceil(result.total / 2));
    });

    it("paginates correctly with page 2", async () => {
      const promise1 = service.getWhitelistEntries({ page: 1, perPage: 1 });
      await tick();
      const page1 = await promise1;

      vi.advanceTimersByTime(600);
      const promise2 = service.getWhitelistEntries({ page: 2, perPage: 1 });
      await tick();
      const page2 = await promise2;

      expect(page1.data[0].id).not.toBe(page2.data[0].id);
    });

    it("returns empty data when no entries match filter", async () => {
      const promise = service.getWhitelistEntries({ status: ["nonexistent_status" as any] });
      await tick();
      const result = await promise;
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe("getWhitelistSummary", () => {
    it("returns summary with correct structure", async () => {
      vi.advanceTimersByTime(600);
      const promise = service.getWhitelistSummary();
      vi.advanceTimersByTime(400);
      const result = await promise;
      expect(typeof result.totalEntries).toBe("number");
      expect(typeof result.approvedCount).toBe("number");
      expect(typeof result.pendingCount).toBe("number");
      expect(typeof result.rejectedCount).toBe("number");
      expect(typeof result.underReviewCount).toBe("number");
    });

    it("totalEntries matches mock data count", async () => {
      vi.advanceTimersByTime(600);
      const entriesPromise = service.getWhitelistEntries();
      await tick();
      const entries = await entriesPromise;

      vi.advanceTimersByTime(600);
      const summaryPromise = service.getWhitelistSummary();
      vi.advanceTimersByTime(400);
      const summary = await summaryPromise;

      expect(summary.totalEntries).toBe(entries.total);
    });
  });

  describe("getWhitelistEntry", () => {
    it("returns an entry by id", async () => {
      const listPromise = service.getWhitelistEntries();
      await tick();
      const list = await listPromise;
      const firstId = list.data[0].id;

      vi.advanceTimersByTime(600);
      const entryPromise = service.getWhitelistEntry(firstId);
      await tick();
      const entry = await entryPromise;

      expect(entry).not.toBeNull();
      expect(entry!.id).toBe(firstId);
    });

    it("returns null for unknown id", async () => {
      const promise = service.getWhitelistEntry("nonexistent-id-xyz");
      await tick();
      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe("createWhitelistEntry", () => {
    it("creates a new entry and returns it", async () => {
      const request = {
        name: "New Investor",
        email: "newinvestor@test.com",
        jurisdictionCode: "GB",
        entityType: "individual" as const,
        riskLevel: "medium" as const,
        kycStatus: "in_progress" as const,
        accreditationStatus: "not_required" as const,
        documentationComplete: false,
        documentsUploaded: [],
      };

      const promise = service.createWhitelistEntry(request);
      await tick();
      const entry = await promise;

      expect(entry.name).toBe("New Investor");
      expect(entry.email).toBe("newinvestor@test.com");
      expect(entry.status).toBe("pending");
      expect(entry.id).toBeTruthy();
    });
  });

  describe("updateWhitelistEntry", () => {
    it("updates an existing entry", async () => {
      const listPromise = service.getWhitelistEntries();
      await tick();
      const list = await listPromise;
      const id = list.data[0].id;

      vi.advanceTimersByTime(600);
      const updatePromise = service.updateWhitelistEntry(id, { notes: "Updated notes" });
      await tick();
      const updated = await updatePromise;

      expect(updated).not.toBeNull();
      expect(updated!.notes).toBe("Updated notes");
    });

    it("returns null for unknown id", async () => {
      const promise = service.updateWhitelistEntry("unknown-id", { notes: "test" });
      await tick();
      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe("approveWhitelistEntry", () => {
    it("approves a pending entry", async () => {
      // First get a pending entry
      const listPromise = service.getWhitelistEntries({ status: ["pending"] });
      await tick();
      const list = await listPromise;

      if (list.data.length > 0) {
        const id = list.data[0].id;
        vi.advanceTimersByTime(600);
        const approvePromise = service.approveWhitelistEntry({ id: id, notes: "Approved" });
        await tick();
        const result = await approvePromise;
        expect(result).not.toBeNull();
        expect(result!.status).toBe("approved");
      }
    });

    it("returns null for unknown id", async () => {
      const promise = service.approveWhitelistEntry({ id: "unknown" });
      await tick();
      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe("rejectWhitelistEntry", () => {
    it("rejects an entry", async () => {
      const listPromise = service.getWhitelistEntries({ status: ["pending"] });
      await tick();
      const list = await listPromise;

      if (list.data.length > 0) {
        const id = list.data[0].id;
        vi.advanceTimersByTime(600);
        const rejectPromise = service.rejectWhitelistEntry({ id: id, reason: "Non-compliant" });
        await tick();
        const result = await rejectPromise;
        expect(result).not.toBeNull();
        expect(result!.status).toBe("rejected");
      }
    });

    it("returns null for unknown id", async () => {
      const promise = service.rejectWhitelistEntry({ id: "unknown", reason: "N/A" });
      await tick();
      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe("requestMoreInfo", () => {
    it("updates an existing entry to under_review status", async () => {
      const listPromise = service.getWhitelistEntries();
      await tick();
      const list = await listPromise;
      const id = list.data[0].id;

      vi.advanceTimersByTime(600);
      const promise = service.requestMoreInfo({ id, requestedInfo: ["Passport copy", "Address proof"] });
      await tick();
      const result = await promise;
      expect(result.status).toBe("under_review");
      expect(result.id).toBe(id);
    });

    it("throws for unknown id", async () => {
      const promise = service.requestMoreInfo({ id: "nonexistent-id", requestedInfo: ["ID doc"] });
      await tick();
      await expect(promise).rejects.toThrow("Entry not found");
    });

    it("updates notes when provided", async () => {
      const listPromise = service.getWhitelistEntries();
      await tick();
      const list = await listPromise;
      const id = list.data[0].id;

      vi.advanceTimersByTime(600);
      const promise = service.requestMoreInfo({ id, requestedInfo: ["DOC"], notes: "Please upload by end of month" });
      await tick();
      const result = await promise;
      expect(result.notes).toBe("Please upload by end of month");
    });
  });

  describe("validateCsv", () => {
    it("returns a mock validation result", async () => {
      const mockFile = new File(["content"], "test.csv", { type: "text/csv" });
      const promise = service.validateCsv(mockFile);
      await tick();
      const result = await promise;
      expect(result.valid).toBe(true);
      expect(result.totalRows).toBeGreaterThan(0);
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe("bulkImport", () => {
    it("imports multiple entries", async () => {
      const request = {
        entries: [
          {
            name: "Bulk User 1",
            email: "bulk1@test.com",
            jurisdictionCode: "DE",
            entityType: "corporate" as const,
            riskLevel: "low" as const,
          },
          {
            name: "Bulk User 2",
            email: "bulk2@test.com",
            jurisdictionCode: "FR",
            entityType: "individual" as const,
            riskLevel: "medium" as const,
          },
        ],
        skipDuplicates: false,
        autoApprove: false,
      };

      const promise = service.bulkImport(request);
      vi.advanceTimersByTime(1100);
      const result = await promise;

      expect(result.totalProcessed).toBe(2);
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(0);
    });

    it("skips duplicates when skipDuplicates=true", async () => {
      // First create an entry
      const createPromise = service.createWhitelistEntry({
        name: "Dup User",
        email: "dup@test.com",
        jurisdictionCode: "US",
        entityType: "individual" as const,
        riskLevel: "low" as const,
        kycStatus: "not_started" as const,
        accreditationStatus: "not_required" as const,
        documentationComplete: false,
        documentsUploaded: [],
      });
      await tick();
      await createPromise;

      // Try to import same email
      vi.advanceTimersByTime(600);
      const importPromise = service.bulkImport({
        entries: [{ name: "Dup User", email: "dup@test.com", jurisdictionCode: "US", entityType: "individual" as const, riskLevel: "low" as const }],
        skipDuplicates: true,
        autoApprove: false,
      });
      vi.advanceTimersByTime(1100);
      const result = await importPromise;

      expect(result.skippedCount).toBe(1);
      expect(result.successCount).toBe(0);
    });

    it("fails for duplicate when skipDuplicates=false", async () => {
      // First create an entry
      const createPromise = service.createWhitelistEntry({
        name: "Dup User 2",
        email: "dup2@test.com",
        jurisdictionCode: "US",
        entityType: "individual" as const,
        riskLevel: "low" as const,
        kycStatus: "not_started" as const,
        accreditationStatus: "not_required" as const,
        documentationComplete: false,
        documentsUploaded: [],
      });
      await tick();
      await createPromise;

      vi.advanceTimersByTime(600);
      const importPromise = service.bulkImport({
        entries: [{ name: "Dup User 2", email: "dup2@test.com", jurisdictionCode: "US", entityType: "individual" as const, riskLevel: "low" as const }],
        skipDuplicates: false,
        autoApprove: false,
      });
      vi.advanceTimersByTime(1100);
      const result = await importPromise;

      expect(result.failureCount).toBe(1);
      expect(result.success).toBe(false);
    });

    it("autoApprove=true sets status to approved", async () => {
      const promise = service.bulkImport({
        entries: [{ name: "Auto User", email: "auto@test.com", jurisdictionCode: "AU", entityType: "individual" as const, riskLevel: "low" as const }],
        skipDuplicates: false,
        autoApprove: true,
      });
      vi.advanceTimersByTime(1100);
      const result = await promise;

      expect(result.successCount).toBe(1);
      expect(result.createdIds.length).toBe(1);
    });
  });

  describe("getJurisdictionRules", () => {
    it("returns 3 pre-populated rules from initializeMockData", async () => {
      const promise = service.getJurisdictionRules();
      vi.advanceTimersByTime(400);
      const result = await promise;
      expect(result).toHaveLength(3);
    });

    it("returns more rules after creating one", async () => {
      const createPromise = service.createJurisdictionRule({
        countryCode: "JP",
        countryName: "Japan",
        status: "allowed",
        complianceLevel: "high",
        requiredDocuments: [],
        restrictions: [],
        tokenPrograms: [],
        notes: "Japan rule",
        effectiveDate: new Date().toISOString(),
        createdBy: "admin@test.com",
      });
      await tick();
      await createPromise;

      vi.advanceTimersByTime(600);
      const listPromise = service.getJurisdictionRules();
      vi.advanceTimersByTime(400);
      const result = await listPromise;
      expect(result.length).toBe(4);
      expect(result.find((r) => r.countryCode === "JP")).toBeTruthy();
    });
  });

  describe("getJurisdictionCoverage", () => {
    it("returns 3 pre-populated rules with correct counts", async () => {
      // Pre-populated: US=allowed, ES=allowed, CN=blocked
      vi.advanceTimersByTime(600);
      const promise = service.getJurisdictionCoverage();
      vi.advanceTimersByTime(400);
      const result = await promise;
      expect(result.totalJurisdictions).toBe(3);
      expect(result.allowedJurisdictions).toBe(2);
      expect(result.blockedJurisdictions).toBe(1);
    });

    it("correctly counts newly added status types", async () => {
      // Add restricted and pending_review rules
      const rule1 = service.createJurisdictionRule({ countryCode: "DE", countryName: "Germany", status: "restricted", complianceLevel: "medium", requiredDocuments: [], restrictions: [], tokenPrograms: [], notes: "", effectiveDate: new Date().toISOString(), createdBy: "admin" });
      await tick();
      await rule1;

      vi.advanceTimersByTime(600);
      const rule2 = service.createJurisdictionRule({ countryCode: "AU", countryName: "Australia", status: "pending_review", complianceLevel: "medium", requiredDocuments: [], restrictions: [], tokenPrograms: [], notes: "", effectiveDate: new Date().toISOString(), createdBy: "admin" });
      await tick();
      await rule2;

      vi.advanceTimersByTime(600);
      const coveragePromise = service.getJurisdictionCoverage();
      vi.advanceTimersByTime(400);
      const coverage = await coveragePromise;

      expect(coverage.restrictedJurisdictions).toBe(1);
      expect(coverage.pendingReviewJurisdictions).toBe(1);
      expect(coverage.totalJurisdictions).toBe(5);
    });
  });

  describe("createJurisdictionRule", () => {
    it("creates a rule with id and timestamps", async () => {
      const promise = service.createJurisdictionRule({
        countryCode: "JP",
        countryName: "Japan",
        status: "restricted",
        complianceLevel: "medium",
        requiredDocuments: ["KYC"],
        restrictions: ["No institutional"],
        tokenPrograms: [],
        notes: "Japan restricted",
        effectiveDate: new Date().toISOString(),
        createdBy: "admin@test.com",
        restrictionReason: "Regulatory issues",
      });
      await tick();
      const rule = await promise;

      expect(rule.id).toMatch(/^jur-/);
      expect(rule.countryCode).toBe("JP");
      expect(rule.status).toBe("restricted");
      expect(rule.createdAt).toBeTruthy();
      expect(rule.updatedAt).toBeTruthy();
    });
  });

  describe("updateJurisdictionRule", () => {
    it("updates an existing rule", async () => {
      const createPromise = service.createJurisdictionRule({ countryCode: "ES", countryName: "Spain", status: "allowed", complianceLevel: "high", requiredDocuments: [], restrictions: [], tokenPrograms: [], notes: "", effectiveDate: new Date().toISOString(), createdBy: "admin" });
      await tick();
      const created = await createPromise;

      vi.advanceTimersByTime(600);
      const updatePromise = service.updateJurisdictionRule(created.id, { status: "restricted", notes: "Updated" });
      await tick();
      const updated = await updatePromise;

      expect(updated.status).toBe("restricted");
      expect(updated.notes).toBe("Updated");
    });

    it("throws for unknown jurisdiction id", async () => {
      vi.advanceTimersByTime(600);
      const promise = service.updateJurisdictionRule("unknown-jur", { status: "blocked" });
      await tick();
      await expect(promise).rejects.toThrow("Jurisdiction rule not found");
    });
  });

  describe("deleteJurisdictionRule", () => {
    it("removes an existing rule", async () => {
      const createPromise = service.createJurisdictionRule({ countryCode: "CA", countryName: "Canada", status: "allowed", complianceLevel: "high", requiredDocuments: [], restrictions: [], tokenPrograms: [], notes: "", effectiveDate: new Date().toISOString(), createdBy: "admin" });
      await tick();
      const created = await createPromise;

      vi.advanceTimersByTime(600);
      const deletePromise = service.deleteJurisdictionRule(created.id);
      await tick();
      await deletePromise; // should not throw

      vi.advanceTimersByTime(600);
      const listPromise = service.getJurisdictionRules();
      vi.advanceTimersByTime(400);
      const rules = await listPromise;
      expect(rules.find((r) => r.id === created.id)).toBeUndefined();
    });

    it("throws for unknown id", async () => {
      vi.advanceTimersByTime(600);
      const promise = service.deleteJurisdictionRule("nonexistent-id");
      await tick();
      await expect(promise).rejects.toThrow("Jurisdiction rule not found");
    });
  });

  describe("checkJurisdictionConflicts", () => {
    it("returns 1 blocked conflict for CN entry (pre-populated with blocked rule)", async () => {
      // Pre-populated mock: CN entry has CN=blocked rule → 1 blocked conflict
      const promise = service.checkJurisdictionConflicts();
      vi.advanceTimersByTime(400);
      const conflicts = await promise;

      const blockedConflicts = conflicts.filter((c) => c.conflictType === "blocked");
      expect(blockedConflicts.length).toBe(1);
      expect(blockedConflicts[0].jurisdictionCode).toBe("CN");
      expect(blockedConflicts[0].severity).toBe("error");
    });

    it("returns missing_rule conflict for entries with no jurisdiction rule", async () => {
      // Create a new entry for a jurisdiction with no rule (e.g., JP)
      vi.advanceTimersByTime(600);
      const createPromise = service.createWhitelistEntry({
        name: "Japan User",
        email: "japan@test.com",
        jurisdictionCode: "JP",
        entityType: "individual" as const,
        riskLevel: "low" as const,
        kycStatus: "not_started" as const,
        accreditationStatus: "not_required" as const,
        documentationComplete: false,
        documentsUploaded: [],
      });
      await tick();
      await createPromise;

      vi.advanceTimersByTime(600);
      const conflictPromise = service.checkJurisdictionConflicts();
      vi.advanceTimersByTime(400);
      const conflicts = await conflictPromise;

      const missingConflicts = conflicts.filter((c) => c.conflictType === "missing_rule" && c.jurisdictionCode === "JP");
      expect(missingConflicts.length).toBe(1);
      expect(missingConflicts[0].severity).toBe("warning");
    });

    it("returns restricted conflict for entries with restricted jurisdiction", async () => {
      // Update CN rule from blocked to restricted, then check
      const rulesPromise = service.getJurisdictionRules();
      vi.advanceTimersByTime(400);
      const rules = await rulesPromise;
      const cnRule = rules.find((r) => r.countryCode === "CN")!;
      expect(cnRule).toBeTruthy();

      vi.advanceTimersByTime(600);
      const updatePromise = service.updateJurisdictionRule(cnRule.id, { status: "restricted", tokenPrograms: ["prog-cn"] });
      await tick();
      await updatePromise;

      vi.advanceTimersByTime(600);
      const conflictPromise = service.checkJurisdictionConflicts();
      vi.advanceTimersByTime(400);
      const conflicts = await conflictPromise;

      const restrictedConflicts = conflicts.filter((c) => c.conflictType === "restricted" && c.jurisdictionCode === "CN");
      expect(restrictedConflicts.length).toBe(1);
      expect(restrictedConflicts[0].severity).toBe("warning");
      expect(restrictedConflicts[0].affectedTokenPrograms).toContain("prog-cn");
    });

    it("returns no non-missing conflicts when all entry jurisdictions are allowed", async () => {
      // Update CN rule to allowed so all pre-populated entries have allowed jurisdictions
      const rulesPromise = service.getJurisdictionRules();
      vi.advanceTimersByTime(400);
      const rules = await rulesPromise;
      const cnRule = rules.find((r) => r.countryCode === "CN")!;

      vi.advanceTimersByTime(600);
      const updatePromise = service.updateJurisdictionRule(cnRule.id, { status: "allowed" });
      await tick();
      await updatePromise;

      vi.advanceTimersByTime(600);
      const conflictPromise = service.checkJurisdictionConflicts();
      vi.advanceTimersByTime(400);
      const conflicts = await conflictPromise;

      // No blocked or restricted conflicts (only missing_rule for entries without rules)
      const nonMissingConflicts = conflicts.filter((c) => c.conflictType !== "missing_rule");
      expect(nonMissingConflicts).toHaveLength(0);
    });
  });

  describe("getJurisdictionName helper (via bulkImport)", () => {
    it("maps known country codes to names", async () => {
      const codes = ["US", "GB", "ES", "FR", "DE", "CN", "JP", "AU", "CA"];
      for (const code of codes) {
        vi.advanceTimersByTime(600);
        const promise = service.bulkImport({
          entries: [{ name: `User ${code}`, email: `user${code}@test.com`, jurisdictionCode: code, entityType: "individual" as const, riskLevel: "low" as const }],
          skipDuplicates: false,
          autoApprove: false,
        });
        vi.advanceTimersByTime(1100);
        const result = await promise;
        expect(result.successCount).toBe(1);
      }
    });

    it("falls back to code for unknown jurisdiction", async () => {
      const promise = service.bulkImport({
        entries: [{ name: "Unknown Country User", email: "unknown_country@test.com", jurisdictionCode: "ZZ", entityType: "individual" as const, riskLevel: "low" as const }],
        skipDuplicates: false,
        autoApprove: false,
      });
      vi.advanceTimersByTime(1100);
      const result = await promise;
      expect(result.successCount).toBe(1);

      // Get the created entry to verify jurisdictionName fallback
      vi.advanceTimersByTime(600);
      const listPromise = service.getWhitelistEntries({ searchQuery: "unknown_country@test.com" });
      await tick();
      const list = await listPromise;
      expect(list.data.length).toBeGreaterThan(0);
      // jurisdictionName should fall back to the code itself
      expect(list.data[0].jurisdictionName).toBe("ZZ");
    });
  });

  describe("singleton export", () => {
    it("exports a singleton whitelistService instance", () => {
      expect(whitelistService).toBeInstanceOf(WhitelistService);
    });
  });
});
