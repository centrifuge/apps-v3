import { useMemo } from 'react'
import { CiShare1 } from 'react-icons/ci'
import { useFormContext, Select } from '@centrifuge/forms'
import { PoolNetwork } from '@centrifuge/sdk'
import { chainExplorer, networkToName, truncateAddress, useAssets } from '@centrifuge/shared'
import { NetworkIcon } from '@centrifuge/ui'
import { Flex, Grid, Text } from '@chakra-ui/react'
import { Link } from 'react-router'

export const AddHoldingForm = ({
  networks,
  poolDetails,
  hubChainId,
}: {
  networks: PoolNetwork[]
  poolDetails: any
  hubChainId: number
}) => {
  const { watch } = useFormContext()
  const network = watch('network')
  const { data: assets } = useAssets(network, hubChainId)

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

  const shareClassPerPool = useMemo(() => {
    if (!poolDetails) return []
    return poolDetails.shareClasses.map((shareClass: any) => ({
      value: shareClass.details.id,
      label: shareClass.details.name,
    }))
  }, [poolDetails])

  const assetOptions = useMemo(() => {
    if (!assets) return []
    return assets.map((asset: any) => ({
      value: asset.id,
      label: asset.name,
      children: (
        <Grid gridTemplateColumns="1fr 20px 1fr 20px" gap={2} alignItems="center" px={1}>
          <Text>{asset.name}</Text>
          <NetworkIcon networkId={network} />
          <Text>{truncateAddress(asset.address)}</Text>
          <Link to={`${chainExplorer[network]}/address/${asset.address}`} target="_blank">
            <CiShare1 />
          </Link>
        </Grid>
      ),
    }))
  }, [assets, network])

  return (
    <Grid gridTemplateColumns="1fr 1fr" gap={4}>
      <Select name="network" items={networkOptions} label="Network" />
      <Select name="asset" items={assetOptions} label="Available assets" disabled={!assets?.length} />
      <Select name="sc" items={shareClassPerPool} label="Token" />
    </Grid>
  )
}
