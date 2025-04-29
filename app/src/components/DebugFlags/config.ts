/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : {})
export const debug =
  import.meta.env.MODE === 'development' || params.get('debug') != null || !!localStorage.getItem('debugFlags')

export type DebugFlagConfig =
  | {
      type: 'text'
      default: string
      alwaysShow?: boolean
    }
  | {
      type: 'component'
      Component: React.FC<{ value: any; onChange: (v: any) => void }>
      default: null
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
      options: Record<string, any>
      alwaysShow?: boolean
    }

export type Key =

  | 'address'
  | 'persistDebugFlags'
  | 'showUnusedFlags'
  | 'darkMode'
export const flagsConfig = {
  address: {
    default: '',
    type: 'text',
  },
  persistDebugFlags: {
    alwaysShow: true,
    default: !!localStorage.getItem('debugFlags'),
    type: 'checkbox',
  },
  showUnusedFlags: {
    default: false,
    type: 'checkbox',
  },
  darkMode: {
    default: false,
    type: 'checkbox',
  },
} satisfies Record<Key, DebugFlagConfig>

export const genericFlagsConfig = flagsConfig as Record<string, DebugFlagConfig>
