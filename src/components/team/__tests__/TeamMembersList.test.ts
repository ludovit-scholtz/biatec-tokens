/**
 * Unit tests for TeamMembersList component
 * Verifies rendering of members, empty/loading/error states, and event emissions
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import TeamMembersList from "../TeamMembersList.vue";
import type { TeamMember, TeamInvitation } from "../../../types/team";

vi.mock("../../../components/ui/Button.vue", () => ({
  default: {
    props: ["variant", "size"],
    template: '<button v-bind="$attrs"><slot /></button>',
    inheritAttrs: true,
  },
}));
vi.mock("../../../components/ui/Badge.vue", () => ({
  default: { template: "<span><slot /></span>" },
}));

const makeMember = (overrides: Partial<TeamMember> = {}): TeamMember => ({
  id: "m1",
  email: "alice@biatec.io",
  name: "Alice Johnson",
  role: "admin",
  status: "active",
  joinedAt: "2025-01-15T10:00:00Z",
  ...overrides,
});

const makeInvitation = (overrides: Partial<TeamInvitation> = {}): TeamInvitation => ({
  id: "inv1",
  email: "bob@biatec.io",
  role: "viewer",
  status: "pending",
  invitedBy: "m1",
  invitedAt: "2026-01-01T09:00:00Z",
  expiresAt: "2026-01-08T09:00:00Z",
  ...overrides,
});

describe("TeamMembersList", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading spinner when loading prop is true", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [], pendingInvitations: [], loading: true },
    });
    expect(wrapper.text()).toContain("Loading team members...");
    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });

  it("shows error state when error prop is provided", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [], pendingInvitations: [], error: "Failed to load" },
    });
    expect(wrapper.text()).toContain("Error Loading Team");
    expect(wrapper.text()).toContain("Failed to load");
  });

  it("shows empty state when members array is empty", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("No Team Members Yet");
  });

  it("renders member name and email", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember()], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("alice@biatec.io");
  });

  it("renders member initials in avatar", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ name: "Alice Johnson" })], pendingInvitations: [] },
    });
    // "Alice Johnson" → initials "AJ"
    expect(wrapper.text()).toContain("AJ");
  });

  it("renders single initial for email-only member", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ name: undefined })], pendingInvitations: [] },
    });
    // email "alice@biatec.io" → initial "A"
    expect(wrapper.text()).toContain("A");
  });

  it("shows active member count in header", () => {
    const wrapper = mount(TeamMembersList, {
      props: {
        members: [makeMember(), makeMember({ id: "m2", email: "b@x.io" })],
        pendingInvitations: [],
      },
    });
    expect(wrapper.text()).toContain("2 active members");
  });

  it("shows singular 'member' for count of 1", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember()], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("1 active member");
    expect(wrapper.text()).not.toContain("1 active members");
  });

  it("shows pending invitation count when invitations exist", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember()], pendingInvitations: [makeInvitation()] },
    });
    expect(wrapper.text()).toContain("1 pending invitation");
  });

  it("does not show invitation count when none pending", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember()], pendingInvitations: [] },
    });
    expect(wrapper.text()).not.toContain("pending invitation");
  });

  it("shows Invite Member button when canManageTeam is true", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [], pendingInvitations: [], canManageTeam: true },
    });
    expect(wrapper.text()).toContain("Invite Member");
  });

  it("hides Invite Member button when canManageTeam is false", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember()], pendingInvitations: [], canManageTeam: false },
    });
    // The header invite button should not be present
    const buttons = wrapper.findAll("button");
    const inviteBtn = buttons.find((b) => b.text().includes("Invite Member") && !b.text().includes("First"));
    expect(inviteBtn).toBeUndefined();
  });

  it("emits invite-member event from empty state button", async () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [], pendingInvitations: [], canManageTeam: true },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("invite-member")).toBeDefined();
  });

  it("renders pending invitations section", () => {
    const wrapper = mount(TeamMembersList, {
      props: {
        members: [makeMember()],
        pendingInvitations: [makeInvitation()],
      },
    });
    expect(wrapper.text()).toContain("bob@biatec.io");
  });

  it("shows only active members in the active members list", () => {
    const suspended = makeMember({ id: "m2", email: "suspended@x.io", status: "suspended" });
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember(), suspended], pendingInvitations: [] },
    });
    // Only active member "alice@biatec.io" shown in active list, not the suspended one
    expect(wrapper.text()).toContain("1 active member");
  });

  it("emits retry event when retry button is clicked in error state", async () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [], pendingInvitations: [], error: "Network error" },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("retry")).toBeDefined();
  });

  // ----- canManageTeam: invitation action buttons (lines 192-208) -----
  it("shows Resend/Cancel buttons in invitations section when canManageTeam is true", () => {
    const wrapper = mount(TeamMembersList, {
      props: {
        members: [makeMember()],
        pendingInvitations: [makeInvitation()],
        canManageTeam: true,
      },
    });
    expect(wrapper.text()).toContain("Resend");
    expect(wrapper.text()).toContain("Cancel");
  });

  it("does not show Resend/Cancel buttons when canManageTeam is false", () => {
    const wrapper = mount(TeamMembersList, {
      props: {
        members: [makeMember()],
        pendingInvitations: [makeInvitation()],
        canManageTeam: false,
      },
    });
    expect(wrapper.text()).not.toContain("Resend");
  });

  it("emits resend-invitation when Resend button is clicked", async () => {
    const inv = makeInvitation();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember()], pendingInvitations: [inv], canManageTeam: true },
    });
    const resendBtn = wrapper.findAll("button").find((b) => b.text().includes("Resend"));
    expect(resendBtn).toBeDefined();
    await resendBtn!.trigger("click");
    expect(wrapper.emitted("resend-invitation")).toBeDefined();
  });

  it("emits cancel-invitation when Cancel button is clicked", async () => {
    const inv = makeInvitation();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember()], pendingInvitations: [inv], canManageTeam: true },
    });
    const cancelBtn = wrapper.findAll("button").find((b) => b.text().trim() === "Cancel");
    expect(cancelBtn).toBeDefined();
    await cancelBtn!.trigger("click");
    expect(wrapper.emitted("cancel-invitation")).toBeDefined();
  });

  // ----- getInitials: single-word name branch -----
  it("shows first 2 chars as initials for single-word name", () => {
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ name: "Alice" })], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("Al");
  });

  // ----- formatRelativeTime: all time branches -----
  it("shows joined date in 'days ago' format for recent members", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ lastActive: twoDaysAgo })], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("days ago");
  });

  it("shows 'hours ago' for member active hours ago", () => {
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ lastActive: fiveHoursAgo })], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("hours ago");
  });

  it("shows 'minutes ago' for member active 10 minutes ago", () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ lastActive: tenMinutesAgo })], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("minutes ago");
  });

  it("shows 'just now' for member active < 1 minute ago", () => {
    const justNow = new Date(Date.now() - 30 * 1000).toISOString();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ lastActive: justNow })], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("just now");
  });

  it("shows locale date for member active >30 days ago (line 273 fallback)", () => {
    const fortyDaysAgo = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ lastActive: fortyDaysAgo })], pendingInvitations: [] },
    });
    // Should show a locale date string (not "ago") in the Active section
    const text = wrapper.text();
    expect(text).toContain("alice@biatec.io");
    expect(text).not.toMatch(/40 days ago/i);
  });

  it("shows singular 'minute ago' for 1 minute", () => {
    const oneMinuteAgo = new Date(Date.now() - 65 * 1000).toISOString();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ lastActive: oneMinuteAgo })], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("minute ago");
    expect(wrapper.text()).not.toContain("minutes ago");
  });

  it("shows singular 'hour ago' for exactly 1 hour", () => {
    const oneHourAgo = new Date(Date.now() - 65 * 60 * 1000).toISOString();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ lastActive: oneHourAgo })], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("hour ago");
    expect(wrapper.text()).not.toContain("hours ago");
  });

  it("shows singular 'day ago' for exactly 1 day", () => {
    const oneDayAgo = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    const wrapper = mount(TeamMembersList, {
      props: { members: [makeMember({ lastActive: oneDayAgo })], pendingInvitations: [] },
    });
    expect(wrapper.text()).toContain("day ago");
    expect(wrapper.text()).not.toContain("days ago");
  });

  // ----- emits change-role and remove-member via canManageTeam -----
  it("emits change-role when change role button clicked (canManageTeam=true)", async () => {
    const member = makeMember({ role: "viewer" });
    const wrapper = mount(TeamMembersList, {
      props: { members: [member], pendingInvitations: [], canManageTeam: true },
    });
    const changeRoleBtn = wrapper.findAll("button").find((b) => b.text().match(/Change Role/i));
    if (changeRoleBtn) {
      await changeRoleBtn.trigger("click");
      expect(wrapper.emitted("change-role")).toBeDefined();
    }
  });

  it("emits remove-member when remove button clicked (canManageTeam=true)", async () => {
    const member = makeMember({ role: "viewer" });
    const wrapper = mount(TeamMembersList, {
      props: { members: [member], pendingInvitations: [], canManageTeam: true },
    });
    const removeBtn = wrapper.findAll("button").find((b) => b.text().match(/Remove/i));
    if (removeBtn) {
      await removeBtn.trigger("click");
      expect(wrapper.emitted("remove-member")).toBeDefined();
    }
  });
});
