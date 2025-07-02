import { useNavigate, useParams } from 'react-router'
import { Box, Flex, Heading, Stack } from '@chakra-ui/react'
import { Button } from '@centrifuge/ui'
import { AccountPage } from '@components/account/AccountPage'
import { useMemo } from 'react'
import { usePoolProvider } from '@contexts/PoolProvider'

// TODO: FOR MVP, we are assuming one share class per pool
// Routing must be fix to handle multiple share classes per pool
export default function Account() {
  const navigate = useNavigate()
  const { poolId } = useParams()
  const { shareClass, vaultsDetails, investmentsPerVaults } = usePoolProvider()
  const shareClassId = shareClass?.shareClass?.id.raw ?? ''

  const totalNav = useMemo(() => {
    return shareClass?.details.pricePerShare.mul(shareClass?.details.totalIssuance)
  }, [shareClass])

  return (
    <Box mt={10}>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Stack gap={0}>
          <Heading size="sm">Total NAV</Heading>
          <Heading size="4xl">
            {totalNav?.toString() ?? '0'} {shareClass?.details.symbol}
          </Heading>
        </Stack>

        <Button label="Update NAV" onClick={() => navigate(`/nav/${shareClassId}/${poolId}`)} size="sm" width="150px" />
      </Flex>
      {shareClass && (
        <AccountPage
          vaultsDetails={vaultsDetails ?? []}
          investmentsPerVaults={investmentsPerVaults ?? []}
          shareClass={shareClass}
        />
      )}
    </Box>
  )
}
