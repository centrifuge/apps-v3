import * as React from 'react'
import { debug } from './config'
import { Flags } from './context'

export * from './context'

const DebugFlagsImpl = React.lazy(() => import('./DebugFlags'))

export function DebugFlags({ children, onChange }: { children?: React.ReactNode; onChange?: (state: Flags) => void }) {
  return debug ? (
      <DebugFlagsImpl onChange={onChange}>{children}</DebugFlagsImpl>
  ) : (
    <>{children}</>
  )
}
