import { Button, IconChevronDown, Menu, MenuItem, MenuItemGroup, Popover, Stack, Text } from '@centrifuge/fabric'
import { ReactNode } from 'react'
import { useAccount, useChains, useConnect, useSwitchChain } from 'wagmi'

type Props = {
  networks?: number[]
  children: ReactNode
  message?: string
}

export function ConnectionGuard({ networks, children, message = 'Unsupported network.' }: Props) {
  const { switchChain } = useSwitchChain()
  const { connectors, connect } = useConnect()
  const chains = useChains()
  function getName(chainId: number) {
    const chain = chains.find((c) => c.id === chainId)
    return chain?.name || chainId.toString()
  }

  const { chainId } = useAccount()

  if (!chainId) {
    return (
      <Stack gap={2} pb={3}>
        <Text variant="body1">Connect to continue</Text>
        {/* TODO: Update when we have a wallet connect library  */}
        <Button onClick={() => connect({ connector: connectors[0] })} variant="secondary">
          Connect
        </Button>
      </Stack>
    )
  }
  if (!networks || networks.includes(chainId)) {
    return <>{children}</>
  }

  return (
    <Stack gap={2} pb={3}>
      <Text variant="body3">{message}</Text>
      {networks.length === 1 ? (
        <Button onClick={() => switchChain({ chainId: networks[0] })}>Switch to {getName(networks[0])}</Button>
      ) : (
        <Popover
          renderTrigger={(props, ref, state) => (
            <Stack ref={ref} width="100%" alignItems="stretch">
              <Button iconRight={IconChevronDown} active={state.isOpen} {...props}>
                Switch network
              </Button>
            </Stack>
          )}
          renderContent={(props, ref, state) => (
            <div {...props} ref={ref}>
              <Menu>
                <MenuItemGroup>
                  {networks.map((network) => (
                    <MenuItem
                      label={getName(network)}
                      onClick={() => {
                        state.close()
                        switchChain({ chainId: network })
                      }}
                      key={network}
                    />
                  ))}
                </MenuItemGroup>
              </Menu>
            </div>
          )}
        />
      )}
    </Stack>
  )
}
