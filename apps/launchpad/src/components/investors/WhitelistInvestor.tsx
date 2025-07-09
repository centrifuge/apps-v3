import { Input, Select, useFormContext } from '@centrifuge/forms'
import { Pool, PoolId, PoolNetwork } from '@centrifuge/sdk'
import { networkToName, usePoolDetails, usePoolNetworks } from '@centrifuge/shared'
import { NetworkIcon } from '@centrifuge/ui'
import { Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { useMemo } from 'react'

// TODO: fix types
export const WhitelistInvestor = ({ pools }: { pools: any[] }) => {
  const { watch } = useFormContext()
  const poolId = watch('poolId')
  const { data: poolDetails } = usePoolDetails(poolId)
  const { data: networks } = usePoolNetworks(poolId)

  const shareClassOptions = useMemo(() => {
    return poolDetails?.shareClasses.map((shareClass) => ({
      label: shareClass.details.name,
      value: shareClass.details.id.raw.toString(),
    }))
  }, [poolDetails])

  const networkOptions = useMemo(() => {
    if (!networks) return []
    return networks.map((network: PoolNetwork) => ({
      value: network.chainId.toString(),
      label: networkToName(network.chainId),
      children: (
        <Flex gap={2} alignItems="center">
          <NetworkIcon networkId={network.chainId} />
          <Text>{networkToName(network.chainId)}</Text>
        </Flex>
      ),
    }))
  }, [networks])

  return (
    <>
      <Heading size="md">Whitelist investors</Heading>
      <Grid templateColumns="1fr 1fr" gap={4}>
        <Select
          items={
            pools?.map((pool) => ({
              label: pool.metadata?.pool?.name ?? pool.id.raw.toString(),
              value: pool.id.raw.toString(),
            })) ?? []
          }
          label="Pool"
          name="poolId"
        />
        <Select
          items={shareClassOptions ?? []}
          label="Token"
          name="shareClassId"
          disabled={!poolId || !poolDetails?.shareClasses.length}
        />
        <Input placeholder="Investor address" name="investorAddress" label="Investor address" size="sm" />
        <Select items={networkOptions ?? []} label="Network" name="network" size="sm" />
      </Grid>
    </>
  )
}
