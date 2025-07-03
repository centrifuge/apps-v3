import { useMemo } from 'react'
import { CiShare1 } from 'react-icons/ci'
import { BalanceInput, useFormContext } from '@centrifuge/forms'
import { PoolNetwork } from '@centrifuge/sdk'
import { chainExplorer, networkToName, truncateAddress, useAssets } from '@centrifuge/shared'
import { NetworkIcon, Select } from '@centrifuge/ui'
import { Flex, Grid, Text } from '@chakra-ui/react'
import { Link } from 'react-router'

export const AddHoldingForm = ({ networks, poolDetails }: { networks: PoolNetwork[]; poolDetails: any }) => {
  const { watch, setValue } = useFormContext()
  const network = watch('network')
  const asset = watch('asset')
  const { data: assets } = useAssets(network)

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
      value: asset.id.raw,
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

  const onSelection = (label: any, value: any) => {
    const val = value[0]
    setValue(label, val)
  }

  const selectedAsset = useMemo(() => {
    return assets?.find((option) => option.id.raw === asset)
  }, [asset, assets])

  return (
    <Grid gridTemplateColumns="1fr 1fr" gap={4}>
      <Select options={networkOptions} label="Network" onSelect={(value) => onSelection('network', value)} />
      <Select
        options={assetOptions}
        label="Available assets"
        onSelect={(value) => onSelection('asset', value)}
        disabled={!assets?.length}
      />
      <Select options={shareClassPerPool} label="Token" onSelect={(value) => onSelection('sc', value)} />
      <BalanceInput
        name="value"
        label="Value per unit"
        size="sm"
        currency={selectedAsset?.symbol}
        decimals={selectedAsset?.decimals ?? 18}
      />
    </Grid>
  )
}
