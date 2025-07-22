import { Form, useForm, Select, Checkbox } from '@centrifuge/forms'
import { Vault } from '@centrifuge/sdk'
import {
  chainExplorer,
  networkToName,
  ShareClassWithDetails,
  truncateAddress,
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

const VaultsCards = ({ shareClass }: { shareClass: ShareClassWithDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVault, setSelectedVault] = useState<{
    vault: Vault
    vaultDetails: VaultDetails | null
    holding: any
  } | null>(null)

  const { data: vaults, isLoading } = useVaultsPerShareClass(shareClass.shareClass)
  const { data: holdings, isLoading: holdingsLoading } = useHoldings(shareClass.shareClass)

  const holdingsByChain = useMemo(() => {
    return holdings?.reduce((acc: Record<number, any[]>, holding) => {
      acc[holding.asset.chainId] = [...(acc[holding.asset.chainId] || []), holding]
      return acc
    }, {})
  }, [holdings])

  const form = useForm({
    onSubmit: (data) => {
      console.log(data)
    },
  })

  const items = useMemo(() => {
    return [
      {
        label: `Vault ${truncateAddress(selectedVault?.vault.address ?? '', 3, 3)}`,
        value: '',
        children: (
          <Box alignSelf="flex-end">
            <Checkbox name="enabled" label="Enabled" checked={true} />
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
            {truncateAddress(selectedVault?.vault.address ?? '', 3, 3)}
            <Link
              to={`${chainExplorer[selectedVault?.vault.chainId ?? 0]}/address/${selectedVault?.vault.address}`}
              target="_blank"
            >
              <IconExternal size={16} />
            </Link>
          </Flex>
        ),
      },
    ]
  }, [selectedVault, shareClass])

  if (isLoading || holdingsLoading) return <Loader />

  return (
    <>
      {vaults?.map((vault) => (
        <VaultsPerChain
          key={vault.address}
          vault={vault}
          holdingsByChain={holdingsByChain || {}}
          setIsModalOpen={() => setIsModalOpen(true)}
          setSelectedVault={setSelectedVault}
        />
      ))}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add vault">
        <Box border="1px solid" borderColor="border-primary" borderRadius="md" p={4} my={6}>
          <Form form={form}>
            <Stack gap={4}>
              <Select name="currency" label="Currency" items={[]} />
              <Select name="type" label="Type" items={[]} />
            </Stack>
          </Form>
        </Box>
      </Modal>
      <Modal
        isOpen={!!selectedVault}
        onClose={() => setSelectedVault(null)}
        title="Update vault"
        onPrimaryAction={() => {
          console.log('save')
        }}
      >
        <Box my={6}>
          <Form form={form}>
            <Box border="1px solid" borderColor="border-primary" borderRadius="md" p={4}>
              <VaultCard values={items} />
            </Box>
          </Form>
        </Box>
      </Modal>
    </>
  )
}

export default function Vaults() {
  const { shareClass } = usePoolProvider()

  if (!shareClass) return <VStack>No vaults available</VStack>

  return <VaultsCards shareClass={shareClass} />
}
