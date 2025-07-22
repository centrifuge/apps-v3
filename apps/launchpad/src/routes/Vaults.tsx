import { Form, useForm, Select, Checkbox } from '@centrifuge/forms'
import { Pool, PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import {
  chainExplorer,
  networkToName,
  ShareClassWithDetails,
  truncateAddress,
  useCentrifugeTransaction,
  useHoldings,
  useVaultsPerShareClass,
  VaultDetails,
} from '@centrifuge/shared'
import { Box, Flex, Loader, Stack, VStack } from '@chakra-ui/react'
import { VaultCard } from '@components/vaults/VaultCard'
import { VaultsPerChain } from '@components/vaults/VaultsPerChain'
import { usePoolProvider } from '@contexts/PoolProvider'
import { useMemo, useState } from 'react'
import { AssetIconText, AssetSymbol, IconExternal, Modal } from '@centrifuge/ui'
import { Link } from 'react-router-dom'
import { z } from 'zod'

const typeItems = [
  {
    label: 'ERC-7540',
    value: 'ERC-7540',
  },
  {
    label: 'Sync-Invest-ERC-7540',
    value: 'Sync-Invest-ERC-7540',
  },
]

type SelectedVaultState = {
  vault: Vault
  vaultDetails: VaultDetails | null
  holding: any
}

const VaultsCards = ({
  shareClass,
  networks,
}: {
  shareClass: ShareClassWithDetails
  networks: PoolNetwork[] | undefined
}) => {
  const { execute } = useCentrifugeTransaction()

  const [modal, setModal] = useState<'add' | 'update' | null>(null)
  const [selectedVault, setSelectedVault] = useState<SelectedVaultState | null>(null)
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null)

  const { data: vaults, isLoading: isLoadingVaults } = useVaultsPerShareClass(shareClass.shareClass)
  const { data: holdings, isLoading: isLoadingHoldings } = useHoldings(shareClass.shareClass)

  const form = useForm({
    schema: z.object({
      currency: z.string(),
      type: z.string(),
    }),
    onSubmit: (data) => {
      const { currency, type } = data
      const assetId = holdings?.find((holding) => holding.assetId.raw.toString() === currency)?.assetId
      const network = networks?.find((network) => network.chainId === selectedChainId)

      if (!network) {
        throw new Error('Network not found')
      }

      setModal(null)
      if (modal === 'add') {
        const shareClasses = [
          {
            id: shareClass.shareClass.id,
            hook: '',
          },
        ]
        const vaults = [
          {
            id: shareClass.shareClass.id,
            assetId,
            kind: type === 'ERC-7540' ? 'async' : 'syncDeposit',
          },
        ]
        execute(network.deploy(shareClasses, vaults))
      } else if (modal === 'update') {
        // TODO: not available yet on SDK
        console.log('update')
      }
    },
  })

  const holdingsByChain = useMemo(() => {
    if (!holdings) return {}
    return holdings.reduce((acc: Record<number, any[]>, holding) => {
      const chainId = holding.asset.chainId
      if (!acc[chainId]) {
        acc[chainId] = []
      }
      acc[chainId].push(holding)
      return acc
    }, {})
  }, [holdings])

  const currencyItems = useMemo(() => {
    const availableHoldings = holdingsByChain[selectedChainId!] || []
    return availableHoldings.map((holding) => ({
      label: `${holding.asset.symbol} on ${networkToName(holding.asset.chainId)}`,
      value: holding.assetId.raw.toString(),
    }))
  }, [holdingsByChain, selectedChainId])

  const updateVaultItems = useMemo(() => {
    if (!selectedVault) return []
    return [
      {
        label: `Vault ${truncateAddress(selectedVault.vault.address, 3, 3)}`,
        value: '',
        children: (
          <Box alignSelf="flex-end">
            <Checkbox name="enabled" label="Enabled" defaultChecked={true} disabled />
          </Box>
        ),
      },
      {
        label: 'Currency',
        value: selectedVault?.holding.asset.symbol ?? '-',
        children: (
          <AssetIconText boxSize={4} assetSymbol={(selectedVault?.holding.asset.symbol as AssetSymbol) ?? 'USDC'} />
        ),
      },
      {
        label: 'Type',
        value: selectedVault?.vaultDetails?.isSyncInvest ? 'Sync-Invest-ERC-7540' : 'ERC-7540',
      },
      {
        label: 'Network',
        value: networkToName(selectedVault?.vault.chainId ?? 0),
      },
      {
        label: 'Share class',
        value: shareClass.details.name,
      },
      {
        label: 'Address of vault',
        value: '',
        children: (
          <Flex alignItems="center" gap={2}>
            {truncateAddress(selectedVault.vault.address, 3, 3)}
            <Link
              to={`${chainExplorer[selectedVault.vault.chainId]}/address/${selectedVault.vault.address}`}
              target="_blank"
            >
              <IconExternal size={16} />
            </Link>
          </Flex>
        ),
      },
    ]
  }, [selectedVault, shareClass])

  const handleOpenAddModal = (vault: Vault) => {
    setSelectedChainId(vault.chainId)
    setModal('add')
  }

  const handleOpenUpdateModal = (vaultState: SelectedVaultState) => {
    setSelectedVault(vaultState)
    setModal('update')
  }

  const closeModal = () => {
    setModal(null)
    setSelectedVault(null)
    setSelectedChainId(null)
  }

  if (isLoadingVaults || isLoadingHoldings) {
    return <Loader />
  }

  return (
    <>
      {vaults?.map((vault) => (
        <VaultsPerChain
          key={vault.address}
          vault={vault}
          holdingsByChain={holdingsByChain}
          onAddVault={handleOpenAddModal}
          onUpdateVault={handleOpenUpdateModal}
        />
      ))}

      <Modal
        isOpen={modal === 'add'}
        onClose={closeModal}
        title="Add vault"
        onPrimaryAction={() => form.handleSubmit()}
      >
        <Box border="1px solid" borderColor="border-primary" borderRadius="md" p={4}>
          <Form form={form}>
            <Stack>
              <Select name="currency" label="Currency" items={currencyItems} />
              <Select name="type" label="Type" items={typeItems} />
            </Stack>
          </Form>
        </Box>
      </Modal>

      <Modal
        isOpen={modal === 'update'}
        onClose={closeModal}
        title="Update vault"
        onPrimaryAction={() => console.log('submit')}
      >
        <Box my={6}>
          <Form form={form}>
            <Box border="1px solid" borderColor="border-primary" borderRadius="md" p={4}>
              <VaultCard values={updateVaultItems} />
            </Box>
          </Form>
        </Box>
      </Modal>
    </>
  )
}

export default function Vaults() {
  const { shareClass, networks } = usePoolProvider()

  if (!shareClass) {
    return <VStack>No vaults available</VStack>
  }

  return <VaultsCards shareClass={shareClass} networks={networks} />
}
