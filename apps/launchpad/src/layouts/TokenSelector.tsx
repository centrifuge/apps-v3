import { useMemo, useState, useEffect, useRef } from 'react'
import { ipfsToHttp, useAllPoolDetails, usePools } from '@centrifuge/shared'
import { Flex, Heading, Image } from '@chakra-ui/react'
import { LogoCentrifuge, Select } from '@centrifuge/ui'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAddress } from '@centrifuge/shared'
import { WalletButton } from '@centrifuge/wallet'
import { Select as ChakraSelect } from '@chakra-ui/react'

type OpenChangeDetails = Parameters<Required<React.ComponentProps<typeof ChakraSelect.Root>>['onOpenChange']>[0]

export const TokenSelector = () => {
  const { address } = useAddress()
  const navigate = useNavigate()
  const location = useLocation()
  const { poolId: poolParam, shareClassId: scParam } = useParams<{ poolId?: string; shareClassId?: string }>()

  const [isOpen, setIsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { data: pools, isLoading: loadingPools } = usePools()
  const poolIds = useMemo(() => pools?.map((p) => p.id) ?? [], [pools])
  const { data: details, isLoading: loadingDetails } = useAllPoolDetails(poolIds, {
    enabled: poolIds.length > 0,
  })

  const allItems = useMemo(() => {
    if (!details) return []
    return details.flatMap((pool) =>
      pool.shareClasses.map((sc) => {
        const value = `${pool.id}-${sc.shareClass.id}`
        const label = pool.metadata?.pool.name
          ? `${pool.metadata?.pool.name} — ${sc.details.symbol}`
          : sc.details.symbol
        return {
          value,
          label,
          children: (
            <Flex align="center" gap={2}>
              {pool.metadata?.pool.icon?.uri ? (
                <Image src={ipfsToHttp(pool.metadata?.pool.icon?.uri)} boxSize={6} alt={label} />
              ) : (
                <LogoCentrifuge />
              )}
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
    if (location.pathname === '/') return ''
    return poolParam && scParam ? `${poolParam}-${scParam}` : ''
  }, [poolParam, scParam, location.pathname])

  const handleSelect = (value: string) => {
    setIsOpen(false)
    const [newPool, newSC] = value.split('-')
    const pathPrefix = `/pool/${newPool}/${newSC}`

    if (location.pathname === '/') {
      navigate(`${pathPrefix}/account`)
      return
    }

    const section = location.pathname.split('/').slice(4).join('/')
    navigate(`${pathPrefix}${section ? `/${section}` : ''}`)
  }

  const handleOpenChange = (details: OpenChangeDetails) => {
    setIsOpen(details.open)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'p' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  if (!address) {
    return <WalletButton colorPalette={['yellow', 'yellow']} variant={['solid', 'solid']} />
  }

  return (
    <Select
      items={allItems}
      onSelectionChange={handleSelect}
      value={selectedValue}
      placeholder={loadingPools || loadingDetails ? 'Loading tokens…' : 'Select a token'}
      loading={loadingPools || loadingDetails}
      withIndicator
      color="white"
      withSearch
      open={isOpen}
      onOpenChange={handleOpenChange}
      inputRef={searchInputRef}
    />
  )
}
