// @vitest-environment happy-dom

import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { useActivePluginIconTheme } from '@/store/plugins/appearance/plugin-icon-themes'
import StatusIndicator from '@/components/sidebar/workspace-card/surface/StatusIndicator'
import { AgentStateDot } from './AgentStateDot'

const EMPTY_MAPS = { fileNames: {}, fileExtensions: {}, folderNames: {}, folderNamesExpanded: {} }

function activateIcons(icons: Record<string, number>): void {
  useActivePluginIconTheme.setState({ theme: { icons, ...EMPTY_MAPS } })
}

afterEach(() => {
  cleanup()
  useActivePluginIconTheme.setState({ theme: null })
})

describe('agent status icons from an icon theme', () => {
  it('draws the theme icon for mapped states, keeping the label, unmapped glyphs and progress', () => {
    activateIcons({ 'agent-done': 3, 'agent-working': 1 })
    const done = render(<AgentStateDot state="done" title={null} unread />)
    const wrapper = done.container.firstElementChild
    expect(wrapper).toHaveAttribute('aria-label', 'Done · Unread')
    expect(wrapper?.querySelector('[data-plugin-icon="3"]')).toHaveAttribute('aria-hidden', 'true')
    done.unmount()

    const waiting = render(<AgentStateDot state="waiting" title={null} />)
    expect(waiting.container.querySelector('[data-plugin-icon]')).toBeNull()
    waiting.unmount()

    const progress = render(<AgentStateDot state="working" progress={40} title={null} />)
    expect(progress.container.querySelector('[data-plugin-icon]')).toBeNull()
    expect(progress.getByRole('progressbar')).toBeInTheDocument()
  })

  it('uses the done icon for a sidebar card but not for a quiet terminal', () => {
    activateIcons({ 'agent-done': 3 })
    const done = render(<StatusIndicator status="done" showTooltip={false} />)
    expect(done.container.querySelector('[data-plugin-icon="3"]')).not.toBeNull()
    done.unmount()

    const active = render(<StatusIndicator status="active" showTooltip={false} />)
    expect(active.container.querySelector('[data-plugin-icon]')).toBeNull()
  })
})
