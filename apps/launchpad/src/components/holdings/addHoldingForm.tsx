import { BalanceInput, useFormContext } from '@centrifuge/forms'
import { PoolNetwork } from '@centrifuge/sdk'
import { networkToName, useAssets } from '@centrifuge/shared'
import { NetworkIcon, Select } from '@centrifuge/ui'
import { Flex, Grid, Text } from '@chakra-ui/react'
import { useMemo } from 'react'

export const AddHoldingForm = ({
  networks,
  onSelect,
  poolDetails,
}: {
  networks: PoolNetwork[]
  onSelect: (label: any, value: any) => void
  poolDetails: any
}) => {
  const { watch } = useFormContext()
  const network = watch('network')
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

  const onSelection = (label: any, value: any) => {
    const val = value[0]
    onSelect(label, val)
  }

  return (
    <Grid gridTemplateColumns="1fr 1fr" gap={4}>
      <Select options={networkOptions} label="Network" onSelect={(value) => onSelection('network', value)} />
      <Select
        options={[]}
        label="Available assets"
        onSelect={(value) => onSelection('asset', value)}
        disabled={!assets?.length}
      />
      <Select options={shareClassPerPool} label="Token" onSelect={(value) => onSelection('sc', value)} />
      <BalanceInput name="value" label="Value per unit" size="sm" currency={'USD'} />
    </Grid>
  )
}
