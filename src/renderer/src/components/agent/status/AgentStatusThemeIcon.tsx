import { cn } from '@/lib/class-names'
import { getPluginSlotIconIndex } from '@/lib/file-icons/file-type-icons'
import { PluginIcon } from '@/components/icons/FileTypeIcon'
import { useActivePluginIconTheme } from '@/store/plugins/appearance/plugin-icon-themes'
import type { PluginAgentStatusIconSlot } from '../../../../../shared/plugins/artifacts/plugin-icon-theme-artifact'
import type { AgentListStatus } from '../../../../../shared/agent-status/presentation/agent-list-status'
import type { WorktreeStatus } from '../../../../../shared/worktree/row-display/worktree-status-rollup'

const AGENT_STATE_SLOT: Record<AgentListStatus, PluginAgentStatusIconSlot> = {
  working: 'agent-working',
  monitoring: 'agent-monitoring',
  waiting: 'agent-waiting',
  permission: 'agent-waiting',
  done: 'agent-done',
  blocked: 'agent-failed',
  failed: 'agent-failed',
  interrupted: 'agent-interrupted',
  unverifiable: 'agent-unconfirmed',
  unconfirmed: 'agent-unconfirmed',
  idle: 'agent-idle'
}

// Why no `active` slot: a quiet terminal shares the done dot, but a themed done icon would claim completion.
const WORKTREE_STATUS_SLOT: Record<WorktreeStatus, PluginAgentStatusIconSlot | null> = {
  active: null,
  working: 'agent-working',
  monitoring: 'agent-monitoring',
  permission: 'agent-waiting',
  failed: 'agent-failed',
  interrupted: 'agent-interrupted',
  unconfirmed: 'agent-unconfirmed',
  done: 'agent-done',
  inactive: 'agent-idle'
}

// Monochrome theme SVGs paint with currentColor, so they follow the status colour tokens.
const SLOT_TEXT_COLOR: Record<PluginAgentStatusIconSlot, string> = {
  'agent-working': 'text-agent-working',
  'agent-monitoring': 'text-agent-working',
  'agent-waiting': 'text-agent-question',
  'agent-done': 'text-agent-done',
  'agent-failed': 'text-agent-error',
  'agent-interrupted': 'text-muted-foreground',
  'agent-unconfirmed': 'text-agent-unverified',
  'agent-idle': 'text-agent-idle'
}

export function agentStateIconSlot(state: AgentListStatus): PluginAgentStatusIconSlot {
  return AGENT_STATE_SLOT[state]
}

export function worktreeStatusIconSlot(status: WorktreeStatus): PluginAgentStatusIconSlot | null {
  return WORKTREE_STATUS_SLOT[status]
}

/** The active icon theme's SVG index for a status slot; null keeps Orca's built-in glyph. */
export function useAgentStatusThemeIconIndex(
  slot: PluginAgentStatusIconSlot | null
): number | null {
  return useActivePluginIconTheme((s) => (slot ? getPluginSlotIconIndex(s.theme, slot) : null))
}

export function AgentStatusThemeIcon({
  slot,
  index,
  className
}: {
  slot: PluginAgentStatusIconSlot
  index: number
  className?: string
}): React.JSX.Element {
  return <PluginIcon index={index} className={cn('shrink-0', SLOT_TEXT_COLOR[slot], className)} />
}
