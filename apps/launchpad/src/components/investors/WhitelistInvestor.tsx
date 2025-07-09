import { Input, Select, useFormContext } from '@centrifuge/forms'
import { PoolId, PoolNetwork } from '@centrifuge/sdk'
import { networkToName, usePoolDetails, usePoolNetworks } from '@centrifuge/shared'
import { NetworkIcon } from '@centrifuge/ui'
import { Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { isAddress } from 'viem'

export const WhitelistInvestor = ({ poolIds }: { poolIds: PoolId[] }) => {
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
          items={poolIds?.map((pool) => ({ label: pool.raw.toString(), value: pool.raw.toString() })) ?? []}
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
