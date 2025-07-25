import { useMemo } from 'react'
import { ipfsToHttp, useAllPoolDetails, usePools } from '@centrifuge/shared'
import { Flex, Heading, Image } from '@chakra-ui/react'
import { Select } from '@centrifuge/ui'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

export const TokenSelector: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { poolId: poolParam, shareClassId: scParam } = useParams<{ poolId?: string; shareClassId?: string }>()

  const { data: pools, isLoading: loadingPools } = usePools()
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
    const segments = location.pathname.split('/')
    const section = segments.slice(4).join('/')
    const path = `/pool/${newPool}/${newSC}${section ? `/${section}` : ''}`
    navigate(path)
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
