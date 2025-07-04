import { useState, useMemo, useEffect, ReactNode } from 'react'
import { Key, genericFlagsConfig } from './config'
import { DebugFlagsContext, Flags, initialFlagsState, useDebugFlags } from './context'

function DebugFlagsImpl({
  children,
  onChange,
  customFlags,
}: {
  children?: ReactNode
  onChange?: (state: Flags) => void
  customFlags?: string[]
}) {
  const [state, setState] = useState(initialFlagsState)
  const [tracked, setTracked] = useState<Record<string, string>>({})

  const ctx = useMemo(
    () => ({
      flags: Object.entries(state).reduce((obj, [key, value]) => {
        const conf = genericFlagsConfig[key as Key]
        obj[key] = 'options' in conf ? conf.options[value as string] : value
        return obj
      }, {} as any),
      register(id: number, keys: string[]) {
        setTracked((prev) => ({ ...prev, [id]: keys }))
      },
      unregister(id: number) {
        setTracked((prev) => ({ ...prev, [id]: undefined }))
      },
    }),
    [state]
  )

  const usedKeys = new Set(Object.values(tracked).flat())

  useEffect(() => {
    onChange?.(state)
    if (state.persistDebugFlags) {
      localStorage.setItem('debugFlags', JSON.stringify(state))
    }
    if (!state.persistDebugFlags && localStorage.getItem('debugFlags')) {
      localStorage.removeItem('debugFlags')
    }
  }, [state])

  return (
    <DebugFlagsContext.Provider value={ctx}>
      {children}
      <Panel
        state={state}
        usedKeys={usedKeys}
        onChange={(key: Key, val: string | boolean) => setState((prev) => ({ ...prev, [key]: val }))}
        customFlags={customFlags}
      />
    </DebugFlagsContext.Provider>
  )
}

function Panel({
  state,
  usedKeys,
  onChange,
  customFlags = [],
}: {
  state: Flags
  usedKeys: Set<string>
  onChange: (key: Key, val: string | boolean) => void
  customFlags?: string[]
}) {
  const [open, setOpen] = useState(false)
  const { showUnusedFlags } = useDebugFlags()
  const flags = ['address', 'persistDebugFlags', 'showUnusedFlags', ...customFlags]

  return Object.entries(genericFlagsConfig).map(([key, obj]) => {
    if (!flags.includes(key)) {
      return null
    }

    const used = usedKeys.has(key) || obj.alwaysShow
    const value = state[key as Key]
    const visible = used || !!showUnusedFlags

    let el
    if (obj.type === 'checkbox') {
      el = (
        <input
          type="checkbox"
          name={key}
          checked={value as boolean}
          onChange={(e) => onChange(key as Key, e.target.checked)}
        />
      )
    } else if (obj.type === 'select' && obj.options) {
      el = (
        <select name={key} value={value as string} onChange={(e) => onChange(key as Key, e.target.value)}>
          {Object.keys(obj.options).map((option, index) => (
            <option key={`${option}-${index}`} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    } else if (obj.type === 'component') {
      el = <obj.Component value={value} onChange={(val) => onChange(key as Key, val)} />
    } else {
      el = (
        <input
          value={value as string}
          onChange={(e) => onChange(key as Key, e.target.value)}
          type="text"
          color="#ddd"
        />
      )
    }

    return visible ? (
      <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <label htmlFor={key} style={{ marginRight: '8px' }}>
          {key}
        </label>
        {el}
        {used ? null : <span style={{ color: 'red', marginLeft: '8px' }}>(unused)</span>}
      </div>
    ) : null
  })
}

export default DebugFlagsImpl
