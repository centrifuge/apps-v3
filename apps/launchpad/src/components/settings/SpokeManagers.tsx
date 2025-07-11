import { useMemo, useState } from 'react'
import { AddressInput, capitalizeNetworkName, Card, NetworkIcon } from '@centrifuge/ui'
import { Field, Flex, Grid, Heading, ListCollection, Select, Stack, createListCollection } from '@chakra-ui/react'
import { HexString, PoolNetwork } from '@centrifuge/sdk'
import { usePoolProvider } from '@contexts/PoolProvider'

type SpokeManagerProps = {
  currentSpokeManagers: { address: HexString; chainId: number }[]
  addSpokeManager: ({ address, chainId }: { address: HexString; chainId: number }) => void
  removeSpokeManager: ({ address, chainId }: { address: HexString; chainId: number }) => void
}

export default function SpokeManagers({
  currentSpokeManagers,
  addSpokeManager,
  removeSpokeManager,
}: SpokeManagerProps) {
  const { networks } = usePoolProvider()

  const chains = useMemo(() => {
    if (!networks) return createListCollection({ items: [] })
    return createListCollection({
      items: networks.map((chain: PoolNetwork) => ({
        label: capitalizeNetworkName(chain.chainId),
        value: chain.chainId,
      })),
    })
  }, [networks])

  const [selectedChain, setSelectedChain] = useState<string[]>([])
  const [isValid, setIsValid] = useState(true)

  if (!isValidChains(chains)) {
    return (
      <Card mt={8}>
        <Stack>
          <Heading size="md">Spoke manager</Heading>
          <Heading size="sm" color="text-secondary">
            Loading networks...
          </Heading>
        </Stack>
      </Card>
    )
  }

  const handleAdd = (address: HexString) => {
    if (!selectedChain[0]) {
      setIsValid(false)
      return
    }
    setIsValid(true)
    addSpokeManager({ address, chainId: Number(selectedChain[0]) })
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
            onDelete={({ address, chainId }) => chainId && removeSpokeManager({ address, chainId })}
            addresses={currentSpokeManagers.map((csm) => ({ address: csm.address, chainId: csm.chainId }))}
          />
          <Stack>
            <Heading size="sm">Spoke chain*</Heading>
            <Flex alignItems="center" gap={2} p={1}>
              <Field.Root invalid={!isValid}>
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
                  {/* TODO: Use Select component from our shared package, needs a bit of refactoring first */}
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
                {!isValid && <Field.ErrorText>Please select chain</Field.ErrorText>}
              </Field.Root>
            </Flex>
          </Stack>
        </Grid>
      </Card>
    </>
  )
}

const isValidChains = (
  chains: ListCollection<never> | ListCollection<{ label: string; value: number }> | ListCollection<unknown>
): chains is ListCollection<{ label: string; value: number }> => {
  return chains.items.length > 0
}
