import * as React from 'react'
import { debug, flagsConfig, genericFlagsConfig, Key } from './config'

export type Flags = Record<Key, string | boolean>
interface Context {
  flags: Flags
  register: (id: number, keys: string[]) => void
  unregister: (id: number) => void
}

export const defaultFlags: Flags = Object.entries(genericFlagsConfig).reduce((obj, [k, v]) => {
  obj[k as Key] = v.default
  return obj
}, {} as Flags)

let persistedState: Flags | null = null
try {
  const stored = localStorage.getItem('debugFlags') ?? ''
  persistedState = JSON.parse(stored[0] === '{' ? stored : '') as Flags
} catch (e) {
  console.error('Failed to parse debug flags from localStorage', e)
}
const flagKeys = Object.keys(flagsConfig)
export const initialFlagsState: Flags = persistedState
  ? Object.entries(persistedState)
      .filter(([k]) => flagKeys.includes(k))
      .reduce((obj, [k, v]) => {
        obj[k as Key] = v
        return obj
      }, {} as Flags)
  : Object.entries(flagsConfig).reduce((obj, [k, v]) => {
      obj[k as Key] = v.default
      return obj
    }, {} as Flags)

export const DebugFlagsContext = React.createContext<Context>({ flags: defaultFlags, register() {}, unregister() {} })

let i = 0

/**
 * On render the Proxy in this hook tracks which properties are being accessed.
 * After mounting, it registers these properties with the DebugFlags provider,
 * so the provider knows which flags are being used on the page and can enable those in the debug panel
 */
export function useDebugFlags(): Flags {
  const [id] = React.useState(() => (i += 1))
  const ctx = React.useContext(DebugFlagsContext)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tracked = React.useRef<any>({})
  const stateRef = React.useRef(ctx.flags)
  stateRef.current = ctx.flags

  const proxiedFlags = React.useMemo(
    () =>
      new Proxy(ctx.flags, {
        get(_, prop: Key) {
          tracked.current[prop] = true
          return stateRef.current[prop]
        },
      }),
    []
  )

  React.useEffect(() => {
    ctx.register(id, Object.keys(tracked.current))
    return () => ctx.unregister(id)
  }, [])

  return debug ? proxiedFlags : ctx.flags
}
