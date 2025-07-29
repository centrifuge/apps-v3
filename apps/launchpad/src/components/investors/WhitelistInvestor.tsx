import { Input, Select, useFormContext } from '@centrifuge/forms'
import { Pool, PoolId, PoolNetwork } from '@centrifuge/sdk'
import { networkToName, useCentrifugeTransaction, usePoolDetails, usePoolNetworks } from '@centrifuge/shared'
import { AddressInput, NetworkIcon } from '@centrifuge/ui'
import { Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { useMemo } from 'react'

export const WhitelistInvestor = ({ poolId }: { poolId: PoolId }) => {
  const { execute } = useCentrifugeTransaction()
  const { pool, shareClass } = useSelectedPool()
  const { data: networks } = usePoolNetworks(poolId, { enabled: !!poolId })

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
      <Grid templateColumns="1fr 1fr" gap={4}>
        <AddressInput onAdd={() => {}} label="Investor address" />
      </Grid>
    </>
  )
}
