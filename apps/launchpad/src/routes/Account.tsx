import { useParams } from 'react-router'
import { Flex, Heading, Stack } from '@chakra-ui/react'
import { LinkButton, Loader } from '@centrifuge/ui'
import { AccountPage } from '@components/account/AccountPage'
import { useMemo } from 'react'
import { usePoolProvider } from '@contexts/PoolProvider'

// TODO: FOR MVP, we are assuming one share class per pool
// Routing must be fix to handle multiple share classes per pool
export default function Account() {
  const { poolId } = useParams()
  const { shareClass, isLoading, poolDetails } = usePoolProvider()
  const shareClassId = shareClass?.shareClass?.id.raw ?? ''

  const totalNav = useMemo(() => {
    return shareClass?.details.pricePerShare.mul(shareClass?.details.totalIssuance)
  }, [shareClass])

  if (isLoading) return <Loader />

  return (
    <>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Stack gap={0}>
          <Heading size="sm">Total NAV</Heading>
          <Heading size="4xl">
            {totalNav?.toString() ?? '0'} {poolDetails?.currency.symbol}
          </Heading>
        </Stack>

        <LinkButton to={`/nav/${shareClassId}/${poolId}`} size="sm" width="150px" colorPalette="yellow">
          Update NAV
        </LinkButton>
      </Flex>
      {shareClass && poolDetails && <AccountPage sc={shareClass} poolDetails={poolDetails} />}
    </>
  )
}
