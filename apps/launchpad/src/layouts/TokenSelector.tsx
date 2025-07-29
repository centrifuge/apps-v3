import { useMemo } from 'react'
import { ipfsToHttp, useAllPoolDetails, usePools, usePoolsByManager } from '@centrifuge/shared'
import { Flex, Heading, Image } from '@chakra-ui/react'
import { Select } from '@centrifuge/ui'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAddress } from '@centrifuge/shared'
import { WalletButton } from '@centrifuge/wallet'

// The selector should only show pools the user is admin of which is different from the overview which we show all the pools
export const TokenSelector: React.FC = () => {
  const { address } = useAddress()
  const navigate = useNavigate()
  const location = useLocation()
  const { poolId: poolParam, shareClassId: scParam } = useParams<{ poolId?: string; shareClassId?: string }>()

  const { data: pools, isLoading: loadingPools } = usePoolsByManager(address)
  const poolIds = useMemo(() => pools?.map((p) => p.id) ?? [], [pools])
  const { data: details, isLoading: loadingDetails } = useAllPoolDetails(poolIds, {
    enabled: poolIds.length > 0,
  })

  const items = useMemo(() => {
    if (!details) return []
    return details.flatMap((pool) =>
      pool.shareClasses.map((sc) => {
        const value = `${pool.id}-${sc.shareClass.id}`
        const label = `${pool.metadata?.pool.name} — ${sc.details.symbol}`
        return {
          value,
          label,
          children: (
            <Flex align="center" gap={2}>
              <Image src={ipfsToHttp(pool.metadata?.pool.icon?.uri ?? '')} boxSize={6} alt={label} />
              <Heading size="xs" lineHeight={1.2}>
                {label}
              </Heading>
            </Flex>
          ),
        }
      })
    )
  }, [details])

  const selectedValue = useMemo(() => {
    return poolParam && scParam ? `${poolParam}-${scParam}` : undefined
  }, [poolParam, scParam, location.pathname])

  const handleSelect = (value: string) => {
    const [newPool, newSC] = value.split('-')

    if (location.pathname === '/') {
      navigate(`/pool/${newPool}/${newSC}/account`)
      return
    }

    const segments = location.pathname.split('/')
    const section = segments.slice(4).join('/')
    const path = `/pool/${newPool}/${newSC}${section ? `/${section}` : ''}`
    navigate(path)
  }

  if (!address) {
    return <WalletButton colorPalette={['yellow', 'yellow']} variant={['solid', 'solid']} />
  }

  return (
    <Select
      items={items}
      onSelectionChange={handleSelect}
      value={selectedValue ?? 'none'}
      placeholder={loadingPools || loadingDetails ? 'Loading tokens…' : 'Select a token'}
      loading={loadingPools || loadingDetails}
      withIndicator
      color="white"
    />
  )
}
