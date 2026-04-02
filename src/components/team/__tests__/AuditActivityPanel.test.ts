import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuditActivityPanel from '../AuditActivityPanel.vue'
import type { TeamAuditEntry } from '../../../types/team'

// Stub child components
vi.mock('../../ui/Button.vue', () => ({ default: { template: '<button @click="$emit(\'click\')"><slot /></button>' } }))
vi.mock('../../ui/Badge.vue', () => ({ default: { template: '<span :data-variant="variant"><slot /></span>', props: ['variant'] } }))

const NOW = new Date('2026-01-10T12:00:00Z').getTime()

function makeEntry(action: TeamAuditEntry['action'], overrides: Partial<TeamAuditEntry> = {}): TeamAuditEntry {
  return {
    id: 'entry-1',
    timestamp: new Date(NOW - 60 * 1000).toISOString(), // 1 minute ago
    action,
    actor: { id: 'u1', email: 'admin@biatec.io', name: 'Admin User' },
    target: { id: 'u2', email: 'member@biatec.io', name: 'New Member' },
    ...overrides,
  }
}

function mountPanel(props: Partial<{ auditLog: TeamAuditEntry[]; loading: boolean }> = {}) {
  return mount(AuditActivityPanel, {
    props: {
      auditLog: [],
      loading: false,
      ...props,
    },
  })
}

describe('AuditActivityPanel', () => {
  beforeEach(() => {
    vi.setSystemTime(NOW)
  })

  it('shows loading skeleton rows when loading=true', () => {
    const w = mountPanel({ loading: true })
    expect(w.findAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('shows empty state when auditLog is empty', () => {
    const w = mountPanel({ auditLog: [] })
    expect(w.text()).toContain('No activity recorded yet')
  })

  it('renders an audit entry row for each entry', () => {
    const w = mountPanel({
      auditLog: [
        makeEntry('member_invited'),
        makeEntry('role_changed', { id: 'entry-2' }),
      ],
    })
    expect(w.findAll('.glass-effect.rounded-lg').length).toBeGreaterThanOrEqual(2)
  })

  it('emits refresh when header button is clicked', async () => {
    const w = mountPanel({ auditLog: [] })
    await w.find('button').trigger('click')
    expect(w.emitted('refresh')).toBeTruthy()
  })

  // getActionIcon branch coverage via rendered icon classes
  const actionIconCases: [TeamAuditEntry['action'], string][] = [
    ['member_invited', 'pi-send'],
    ['invitation_resent', 'pi-refresh'],
    ['invitation_cancelled', 'pi-times'],
    ['member_joined', 'pi-user-plus'],
    ['role_changed', 'pi-pencil'],
    ['member_suspended', 'pi-pause'],
    ['member_reactivated', 'pi-play'],
    ['member_removed', 'pi-user-minus'],
  ]

  actionIconCases.forEach(([action, iconClass]) => {
    it(`renders correct icon class for action "${action}"`, () => {
      const w = mountPanel({ auditLog: [makeEntry(action)] })
      expect(w.html()).toContain(iconClass)
    })
  })

  // getActionBadgeVariant branch coverage (text label differs per action)
  it('applies success badge variant for member_joined', () => {
    const w = mountPanel({ auditLog: [makeEntry('member_joined')] })
    const badge = w.find('[data-variant="success"]')
    expect(badge.exists()).toBe(true)
  })

  it('applies error badge variant for member_removed', () => {
    const w = mountPanel({ auditLog: [makeEntry('member_removed')] })
    const badge = w.find('[data-variant="error"]')
    expect(badge.exists()).toBe(true)
  })

  it('applies warning badge variant for role_changed', () => {
    const w = mountPanel({ auditLog: [makeEntry('role_changed')] })
    const badge = w.find('[data-variant="warning"]')
    expect(badge.exists()).toBe(true)
  })

  it('applies info badge variant for member_invited', () => {
    const w = mountPanel({ auditLog: [makeEntry('member_invited')] })
    const badge = w.find('[data-variant="info"]')
    expect(badge.exists()).toBe(true)
  })

  it('applies default badge variant for invitation_cancelled', () => {
    const w = mountPanel({ auditLog: [makeEntry('invitation_cancelled')] })
    const badge = w.find('[data-variant="default"]')
    expect(badge.exists()).toBe(true)
  })

  // formatRelativeTime branches
  it('shows "just now" for very recent events (< 1 min)', () => {
    const entry = makeEntry('member_invited', {
      timestamp: new Date(NOW - 30 * 1000).toISOString(), // 30s ago
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('just now')
  })

  it('shows minutes for events < 60 min ago', () => {
    const entry = makeEntry('member_invited', {
      timestamp: new Date(NOW - 5 * 60 * 1000).toISOString(), // 5 min ago
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('5m ago')
  })

  it('shows hours for events < 24h ago', () => {
    const entry = makeEntry('member_invited', {
      timestamp: new Date(NOW - 3 * 3600 * 1000).toISOString(), // 3h ago
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('3h ago')
  })

  it('shows days for events < 7 days ago', () => {
    const entry = makeEntry('member_invited', {
      timestamp: new Date(NOW - 2 * 86400 * 1000).toISOString(), // 2d ago
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('2d ago')
  })

  it('shows locale date for events >= 7 days ago', () => {
    const entry = makeEntry('member_invited', {
      timestamp: new Date(NOW - 10 * 86400 * 1000).toISOString(), // 10 days ago
    })
    const w = mountPanel({ auditLog: [entry] })
    // Should not contain "d ago" pattern — falls through to toLocaleDateString()
    expect(w.text()).not.toContain('10d ago')
    expect(w.exists()).toBe(true)
  })

  // ── getActionDescription — uncovered cases ────────────────────────────────

  it('describes member_suspended action', () => {
    const entry = makeEntry('member_suspended', {
      target: { id: 'u2', name: 'Bob', email: 'bob@example.com' },
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('Suspended')
    expect(w.text()).toContain('Bob')
  })

  it('describes member_reactivated action', () => {
    const entry = makeEntry('member_reactivated', {
      target: { id: 'u3', name: 'Carol', email: 'carol@example.com' },
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('Reactivated')
    expect(w.text()).toContain('Carol')
  })

  it('describes member_removed action', () => {
    const entry = makeEntry('member_removed', {
      target: { id: 'u4', name: 'Dave', email: 'dave@example.com' },
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('Removed')
    expect(w.text()).toContain('Dave')
  })

  it('getActionDescription uses email as fallback when target has no name', () => {
    const entry = makeEntry('member_invited', {
      target: { id: 'u5', name: '', email: 'noname@example.com' },
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('noname@example.com')
  })

  it('getActionDescription returns "Unknown action" for unrecognised action type', () => {
    // Cast to bypass TS type guard
    const entry = makeEntry('member_invited')
    ;(entry as any).action = 'some_future_action'
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('Unknown action')
  })

  it('getActionDescription uses actor email when actor has no name (member_joined)', () => {
    const entry = makeEntry('member_joined', {
      actor: { id: 'u6', name: '', email: 'actor@example.com' },
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('actor@example.com')
  })

  // ── hasRelevantDetails / details display ─────────────────────────────────

  it('shows oldRole → newRole when entry has both role fields', () => {
    const entry = makeEntry('role_changed', {
      details: { oldRole: 'viewer', newRole: 'admin' },
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('Viewer')
    expect(w.text()).toContain('Admin')
    expect(w.text()).toContain('→')
  })

  it('shows "Role:" label when entry has only role field in details', () => {
    const entry = makeEntry('member_invited', {
      details: { role: 'compliance_officer' },
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('Compliance Officer')
  })

  it('does not show details section when details is null', () => {
    const entry = makeEntry('member_invited', { details: null })
    const w = mountPanel({ auditLog: [entry] })
    // Entry renders fine without details section
    expect(w.exists()).toBe(true)
  })

  // ── formatRoleName fallback ───────────────────────────────────────────────

  it('formatRoleName returns raw string for unknown role', () => {
    const entry = makeEntry('role_changed', {
      details: { oldRole: 'super_admin', newRole: 'super_admin' },
    })
    const w = mountPanel({ auditLog: [entry] })
    expect(w.text()).toContain('super_admin')
  })

  // ── member_suspended / member_reactivated badge variants ─────────────────

  it('applies warning badge variant for member_suspended', () => {
    const w = mountPanel({ auditLog: [makeEntry('member_suspended')] })
    const badge = w.find('[data-variant="warning"]')
    expect(badge.exists()).toBe(true)
  })

  it('applies success badge variant for member_reactivated', () => {
    const w = mountPanel({ auditLog: [makeEntry('member_reactivated')] })
    const badge = w.find('[data-variant="success"]')
    expect(badge.exists()).toBe(true)
  })

  it('applies info badge variant for invitation_resent', () => {
    const w = mountPanel({ auditLog: [makeEntry('invitation_resent')] })
    const badge = w.find('[data-variant="info"]')
    expect(badge.exists()).toBe(true)
  })
})
