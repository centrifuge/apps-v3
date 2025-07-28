import { useMemo, useState } from 'react'
import { PoolNetwork } from '@centrifuge/sdk'
import {
  chainExplorer,
  networkToName,
  truncateAddress,
  useAssets,
  useCentrifugeTransaction,
  usePoolNetworks,
} from '@centrifuge/shared'
import { IconShare, Modal, NetworkIcon, Select } from '@centrifuge/ui'
import { Flex, Grid, Text } from '@chakra-ui/react'
import { Link } from 'react-router'

import { useSelectedPool } from '@contexts/SelectedPoolProvider'

export const AddHoldingForm = ({
  openModal,
  setOpenModal,
}: {
  openModal: { add: boolean }
  setOpenModal: (openModal: { add: boolean }) => void
}) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { poolDetails, pool, shareClass } = useSelectedPool()
  const { data: networks } = usePoolNetworks(poolDetails?.id!)

  const [networkId, setNetworkId] = useState<number | undefined>(undefined)
  const [assetId, setAssetId] = useState<string | undefined>(undefined)

  const { data: assets } = useAssets(networkId, pool?.chainId, !!networkId)

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

  const assetOptions = useMemo(() => {
    if (!assets || !networkId) return []
    return assets.map((asset: any) => ({
      value: asset.id.toString(),
      label: asset.name,
      children: (
        <Grid gridTemplateColumns="2fr 1fr" gap={2} alignItems="center" px={1}>
          <Flex alignItems="center" gap={2}>
            <Text>{asset.name}</Text>
            <NetworkIcon networkId={networkId} />
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Text>{truncateAddress(asset.address)}</Text>
            <Link to={`${chainExplorer[networkId]}/address/${asset.address}`} target="_blank">
              <IconShare />
            </Link>
          </Flex>
        </Grid>
      ),
    }))
  }, [assets, networkId])

  const handleSubmit = () => {
    const asset = assets?.find((asset) => asset.id.toString() === assetId?.toString())
    const foundAssetId = asset?.id
    if (!shareClass || !foundAssetId) return
    execute(shareClass.createHolding(foundAssetId, '0x6Bcb240d3e1f1C4321ECAFFDacB45691DC03bE5D', false))
  }

  return (
    <Modal
      isOpen={openModal.add}
      onClose={() => setOpenModal({ ...openModal, add: false })}
      title="Add holding"
      onPrimaryAction={() => handleSubmit()}
      primaryActionText="Add holding"
      isPrimaryActionLoading={isPending}
    >
      <Grid gridTemplateColumns="1fr" gap={4}>
        <Select
          items={networkOptions}
          label="Network"
          placeholder="Select network"
          onSelectionChange={(value) => setNetworkId(Number(value))}
        />
        <Select
          items={assetOptions}
          label="Available assets"
          disabled={!assets?.length}
          placeholder="Select asset"
          onSelectionChange={(value) => setAssetId(value)}
        />
      </Grid>
    </Modal>
  )
}
