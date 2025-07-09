import { useMemo, useState } from 'react'
import { AddressInput, capitalizeNetworkName, Card, NetworkIcon } from '@centrifuge/ui'
import { Flex, Grid, Heading, Select, Stack, createListCollection } from '@chakra-ui/react'
import { usePoolNetworks } from '@centrifuge/shared'
import { PoolId } from '@centrifuge/sdk'

type SpokeManagerProps = {
  currentSpokeManagers: { address: string; chainId: number }[]
  poolId: string
  addSpokeManager: ({ address, chainId }: { address: string; chainId: number }) => void
  removeSpokeManager: (address: string) => void
}

export default function SpokeManagers({
  currentSpokeManagers,
  poolId,
  addSpokeManager,
  removeSpokeManager,
}: SpokeManagerProps) {
  const memoizedPoolId = useMemo(() => {
    return poolId ? new PoolId(poolId) : undefined
  }, [poolId])

  const { data, isLoading } = usePoolNetworks(memoizedPoolId)
  const chains = useMemo(() => {
    if (isLoading || !data) return createListCollection({ items: [] })
    return createListCollection({
      items: data.map((chain) => ({
        label: capitalizeNetworkName(chain.chainId),
        value: chain.chainId,
      })),
    })
  }, [data, isLoading])

  const [selectedChain, setSelectedChain] = useState<string[]>([])

  const handleAdd = (address: string) => {
    if (!address.trim()) return
    const networkId = selectedChain[0]

    addSpokeManager({ address, chainId: Number(networkId) })
  }

  return (
    <>
      <Card mt={8}>
        <Stack>
          <Heading size="md">Spoke manager</Heading>
        </Stack>
        <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
          <AddressInput
            onAdd={handleAdd}
            onDelete={removeSpokeManager}
            addresses={currentSpokeManagers.map((csm) => ({ address: csm.address, chainId: csm.chainId }))}
          />
          <Stack>
            <Heading size="sm">Spoke chain*</Heading>
            <Flex alignItems="center" gap={2} p={1}>
              <Select.Root
                value={selectedChain}
                onValueChange={(e) => setSelectedChain(e.value)}
                collection={chains}
                size="sm"
                background="border-secondary"
                borderRadius={10}
                borderTopRightRadius={0}
                borderBottomRightRadius={0}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Please select..." />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {chains.items.map((chain) => (
                      <Select.Item item={chain} key={chain.value} justifyContent="flex-start">
                        <NetworkIcon networkId={chain.value} />
                        {chain.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Flex>
          </Stack>
        </Grid>
      </Card>
    </>
  )
}
