import { PoolNetwork } from '@centrifuge/sdk'
import { networkToName } from '@centrifuge/shared'
import { NetworkIcon, Select } from '@centrifuge/ui'
import { Flex, Text } from '@chakra-ui/react'
import { usePoolProvider } from '@contexts/PoolProvider'
import { useMemo } from 'react'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export default function Add() {
  const { shareClass, networks } = usePoolProvider()
  console.log(shareClass)

  const networkOptions = useMemo(() => {
    if (!networks) return []
    return networks.map((network: PoolNetwork) => ({
      value: network.chainId,
      children: (
        <Flex gap={2} alignItems="center">
          <NetworkIcon networkId={network.chainId} />
          <Text>{networkToName(network.chainId)}</Text>
        </Flex>
      ),
    }))
  }, [networks])

  return (
    <div>
      <Select options={networkOptions} />
    </div>
  )
}
