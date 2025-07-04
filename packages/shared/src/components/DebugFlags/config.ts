import React from 'react'

const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : {})
const localStorage = typeof window !== 'undefined' ? window.localStorage : null

export const debug =
  import.meta.env.MODE === 'development' || params.get('debug') != null || !!localStorage?.getItem('debugFlags')

export type DebugFlagConfig =
  | {
      type: 'text'
      default: string
      alwaysShow?: boolean
    }
  | {
      type: 'component'
      Component: React.FC<{ value: unknown; onChange: (v: unknown) => void }>
      default: string
      alwaysShow?: boolean
    }
  | {
      type: 'checkbox'
      default: boolean
      alwaysShow?: boolean
    }
  | {
      type: 'select'
      default: string
      options: Record<string, string>
      alwaysShow?: boolean
    }

export type Key = 'address' | 'persistDebugFlags' | 'showUnusedFlags'

export const flagsConfig = {
  address: {
    default: '',
    type: 'text',
  },
  persistDebugFlags: {
    alwaysShow: true,
    default: !!localStorage?.getItem('debugFlags'),
    type: 'checkbox',
  },
  showUnusedFlags: {
    default: true,
    type: 'checkbox',
  },
} satisfies Record<Key, DebugFlagConfig>

export const genericFlagsConfig = flagsConfig as Record<string, DebugFlagConfig>
