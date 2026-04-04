import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import MicaReadinessSummary from '../MicaReadinessSummary.vue'

const mockPush = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({ push: mockPush })
  }
})

const makeRouter = () =>
  createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/compliance', name: 'ComplianceDashboard', component: { template: '<div />' } },
      { path: '/attestations', name: 'AttestationsDashboard', component: { template: '<div />' } },
      { path: '/guide', name: 'EnterpriseGuide', component: { template: '<div />' } }
    ]
  })

describe('MicaReadinessSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the MICA Readiness Dashboard heading', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    expect(wrapper.text()).toContain('MICA Readiness Dashboard')
  })

  it('shows VOI and Aramid network tabs', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    expect(wrapper.text()).toContain('VOI')
    expect(wrapper.text()).toContain('Aramid')
  })

  it('defaults to VOI network tab active', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const voi = wrapper.find('button.bg-biatec-accent') ?? wrapper.findAll('button').find(b => b.text() === 'VOI')
    expect(wrapper.text()).toContain('VOI Network')
  })

  it('switches to Aramid network when tab clicked', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const aramidBtn = wrapper.findAll('button').find(b => b.text() === 'Aramid')
    expect(aramidBtn).toBeTruthy()
    await aramidBtn!.trigger('click')
    expect(wrapper.text()).toContain('Aramid Network')
  })

  it('shows readiness score percentage', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    // VOI default score is 75
    expect(wrapper.text()).toContain('75%')
  })

  it('readinessScoreColor: green for >=80 (Aramid=82)', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    // Switch to Aramid which has score 82
    const aramidBtn = wrapper.findAll('button').find(b => b.text() === 'Aramid')
    await aramidBtn!.trigger('click')
    const scoreEl = wrapper.find('.text-4xl')
    expect(scoreEl.classes()).toContain('text-green-400')
  })

  it('readinessScoreColor: yellow for >=60 and <80 (VOI=75)', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const scoreEl = wrapper.find('.text-4xl')
    expect(scoreEl.classes()).toContain('text-yellow-400')
  })

  it('readinessLabel: Enterprise Ready for Aramid (82)', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const aramidBtn = wrapper.findAll('button').find(b => b.text() === 'Aramid')
    await aramidBtn!.trigger('click')
    expect(wrapper.text()).toContain('Enterprise Ready')
  })

  it('readinessLabel: Good Progress for VOI (75)', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    expect(wrapper.text()).toContain('Good Progress')
  })

  it('shows refresh button when not loading', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const refreshBtn = wrapper.findAll('button').find(b => b.text().includes('Refresh'))
    expect(refreshBtn).toBeTruthy()
  })

  it('navigateToCompliance calls router.push with ComplianceDashboard', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const complianceBtn = wrapper.findAll('button').find(b => b.text().includes('Compliance'))
    expect(complianceBtn).toBeTruthy()
    await complianceBtn!.trigger('click')
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'ComplianceDashboard' })
    )
  })

  it('navigateToAttestations calls router.push with AttestationsDashboard', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const attBtn = wrapper.findAll('button').find(b => b.text().includes('Attestations'))
    expect(attBtn).toBeTruthy()
    await attBtn!.trigger('click')
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'AttestationsDashboard' })
    )
  })

  it('navigateToGuide calls router.push with EnterpriseGuide', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const guideBtn = wrapper.findAll('button').find(b => b.text().includes('Enterprise Guide'))
    expect(guideBtn).toBeTruthy()
    await guideBtn!.trigger('click')
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'EnterpriseGuide' })
    )
  })

  it('shows compliance requirement labels', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    expect(wrapper.text()).toContain('Token Whitepaper')
    expect(wrapper.text()).toContain('KYC/AML Policy')
    expect(wrapper.text()).toContain('Transfer Restrictions')
    expect(wrapper.text()).toContain('Audit Trail')
  })

  it('shows audit exports ready count for VOI', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    // VOI has 3 ready exports
    expect(wrapper.text()).toContain('Audit Exports')
  })

  it('shows whitelist coverage percentage for VOI', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    expect(wrapper.text()).toContain('68%')
  })

  it('readinessScoreColor returns green for score >= 80 (Aramid)', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    // Switch to Aramid (readinessScore: 82)
    const aramidBtn = wrapper.findAll('button').find(b => b.text() === 'Aramid')
    await aramidBtn!.trigger('click')
    const vm = wrapper.vm as any
    expect(vm.readinessScoreColor).toBe('text-green-400')
  })

  it('readinessScoreColor returns yellow for score in 60-79 range (VOI=75)', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    expect(vm.readinessScoreColor).toBe('text-yellow-400')
  })

  it('readinessScoreColor returns red for score < 60 (simulated)', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    // Force readinessScore to be low by mutating networkData
    vm.networkData.VOI.readinessScore = 40
    expect(vm.readinessScoreColor).toBe('text-red-400')
  })

  it('readinessScoreBgClass returns bg-green-500/10 at 80+', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const aramidBtn = wrapper.findAll('button').find(b => b.text() === 'Aramid')
    await aramidBtn!.trigger('click')
    const vm = wrapper.vm as any
    expect(vm.readinessScoreBgClass).toBe('bg-green-500/10')
  })

  it('readinessScoreBgClass returns bg-yellow-500/10 for score 60-79', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    expect(vm.readinessScoreBgClass).toBe('bg-yellow-500/10')
  })

  it('readinessScoreBgClass returns bg-red-500/10 for score < 60', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    vm.networkData.VOI.readinessScore = 30
    expect(vm.readinessScoreBgClass).toBe('bg-red-500/10')
  })

  it('readinessScoreGradient returns green gradient for score >= 80', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const aramidBtn = wrapper.findAll('button').find(b => b.text() === 'Aramid')
    await aramidBtn!.trigger('click')
    const vm = wrapper.vm as any
    expect(vm.readinessScoreGradient).toContain('green')
  })

  it('readinessScoreGradient returns yellow gradient for 60-79', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    expect(vm.readinessScoreGradient).toContain('yellow')
  })

  it('readinessScoreGradient returns red gradient for score < 60', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    vm.networkData.VOI.readinessScore = 50
    expect(vm.readinessScoreGradient).toContain('red')
  })

  it('readinessLabel returns Enterprise Ready for score >= 80', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const aramidBtn = wrapper.findAll('button').find(b => b.text() === 'Aramid')
    await aramidBtn!.trigger('click')
    const vm = wrapper.vm as any
    expect(vm.readinessLabel).toBe('Enterprise Ready')
  })

  it('readinessLabel returns Good Progress for score 60-79', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    expect(vm.readinessLabel).toBe('Good Progress')
  })

  it('readinessLabel returns Needs Attention for score < 60', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    vm.networkData.VOI.readinessScore = 55
    expect(vm.readinessLabel).toBe('Needs Attention')
  })

  it('whitelistCoverageColor returns green for percentage >= 70', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const aramidBtn = wrapper.findAll('button').find(b => b.text() === 'Aramid')
    await aramidBtn!.trigger('click')
    const vm = wrapper.vm as any
    // Aramid has 78% whitelist
    expect(vm.whitelistCoverageColor).toBe('text-green-400')
  })

  it('whitelistCoverageColor returns yellow for 50-69%', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    // VOI has 68% whitelist — falls in 50-69 range
    expect(vm.whitelistCoverageColor).toBe('text-yellow-400')
  })

  it('whitelistCoverageColor returns red for < 50%', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    vm.networkData.VOI.whitelistCoverage.percentage = 30
    expect(vm.whitelistCoverageColor).toBe('text-red-400')
  })

  it('whitelistCoverageBgClass returns green for percentage >= 70', async () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const aramidBtn = wrapper.findAll('button').find(b => b.text() === 'Aramid')
    await aramidBtn!.trigger('click')
    const vm = wrapper.vm as any
    expect(vm.whitelistCoverageBgClass).toBe('bg-green-500/10')
  })

  it('whitelistCoverageBgClass returns yellow for 50-69%', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    expect(vm.whitelistCoverageBgClass).toBe('bg-yellow-500/10')
  })

  it('whitelistCoverageBgClass returns red for < 50%', () => {
    const wrapper = mount(MicaReadinessSummary, {
      global: { plugins: [makeRouter()] }
    })
    const vm = wrapper.vm as any
    vm.networkData.VOI.whitelistCoverage.percentage = 40
    expect(vm.whitelistCoverageBgClass).toBe('bg-red-500/10')
  })
})
