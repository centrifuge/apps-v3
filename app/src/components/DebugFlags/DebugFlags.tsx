import { Box, Shelf, Stack, Text } from '@centrifuge/fabric'
import * as React from 'react'
import styled from 'styled-components'
import { Key, genericFlagsConfig } from './config'
import { DebugFlagsContext, Flags, initialFlagsState, useDebugFlags } from './context'

function DebugFlagsImpl({ children, onChange }: { children?: React.ReactNode; onChange?: (state: Flags) => void }) {
  const [state, setState] = React.useState(initialFlagsState)
  const [tracked, setTracked] = React.useState({})

  const ctx = React.useMemo(
    () => {
      const defaultEntries: [string, string|boolean][] = Object.entries(state)
      const flags = {} as Partial<Flags>;
      defaultEntries.forEach(([key, value]: [string, string|boolean]) => {
          flags[key as Key] = value
      })

      return ({
      flags: {...flags} as Flags,
      register(id: number, keys: string[]) {
        setTracked((prev) => ({ ...prev, [id]: keys }))
      },
      unregister(id: number) {
        setTracked((prev) => ({ ...prev, [id]: undefined }))
      },
    })},
    [state]
  )

  const usedKeys = new Set(Object.values(tracked).flat()) as Set<Partial<Key>>

  React.useEffect(() => {
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
      />
    </DebugFlagsContext.Provider>
  )
}

function Panel({
  state,
  usedKeys,
  onChange,
}: {
  state: Flags
  usedKeys: Set<Partial<Key>>
  onChange: (key: Key, val: string | boolean) => void
}) {
  const [open, setOpen] = React.useState(false)
  const { showUnusedFlags } = useDebugFlags()

  return (
    <StyledPanel position="fixed" bottom={0} right={0} zIndex="onTopOfTheWorld">
      <Shelf
        justifyContent="center"
        width="100%"
        padding="4px"
        as="button"
        type="button"
        onClick={() => setOpen(!open)}
        background="black"
        border="none"
        style={{ fontFamily: "'Hack', monospace", fontSize: '11px', color: 'white', cursor: 'pointer' }}
      >
        {open ? 'close' : 'open'} debug panel
      </Shelf>
      {open && (
        <StyledOpenPanel width={400} gap="1">
          {Object.entries(genericFlagsConfig).map(([key, obj]) => {
            const used = usedKeys.has(key as Key) || obj.alwaysShow
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
              <Shelf as="label" justifyContent="space-between" key={key}>
                <Text
                  fontSize="inherit"
                  fontFamily="inherit"
                  color="white"
                  style={{ opacity: used ? 1 : 0.6, flex: '0 0 50%' }}
                >
                  {key}
                </Text>
                <Box flex="0 0 50%">{el}</Box>
              </Shelf>
            ) : null
          })}
        </StyledOpenPanel>
      )}
    </StyledPanel>
  )
}

const StyledPanel = styled(Box)``

const StyledOpenPanel = styled(Stack)`
  background: black;
  padding: 16px;
  color: white;
  font-family: Hack, monospace;
  font-size: 11px;
`

export default DebugFlagsImpl
