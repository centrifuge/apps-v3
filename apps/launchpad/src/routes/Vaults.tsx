import { ShareClass } from '@centrifuge/sdk'
import { useHoldings, useVaultsPerShareClass } from '@centrifuge/shared'
import { Loader, VStack } from '@chakra-ui/react'
import VaultCard from '@components/vaults/VaultCard'
import { usePoolProvider } from '@contexts/PoolProvider'
import { useMemo } from 'react'

const VaultsCards = ({ shareClass }: { shareClass: ShareClass }) => {
  const { data: vaults, isLoading } = useVaultsPerShareClass(shareClass)
  const { data: holdings, isLoading: holdingsLoading } = useHoldings(shareClass)

  const holdingsByChain = useMemo(() => {
    return holdings?.reduce((acc: Record<number, any[]>, holding) => {
      acc[holding.asset.chainId] = [...(acc[holding.asset.chainId] || []), holding]
      return acc
    }, {})
  }, [holdings])

  if (isLoading || holdingsLoading) return <Loader />

  return vaults?.map((vault) => <VaultCard key={vault.address} vault={vault} holdingsByChain={holdingsByChain || {}} />)
}

export default function Vaults() {
  const { shareClass } = usePoolProvider()

  if (!shareClass) return <VStack>No vaults available</VStack>

  return <VaultsCards shareClass={shareClass.shareClass} />
}
