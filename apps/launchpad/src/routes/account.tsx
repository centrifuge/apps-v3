import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { useChainId } from 'wagmi'
import { useAllInvestments, usePoolDetails, usePoolNetworks, useVaults, useVaultsDetails } from '@centrifuge/shared'
import { PoolId } from '@centrifuge/sdk'
import { Button } from '@centrifuge/ui'
import { AccountPage } from '@components/account/AccountPage'
import { useMemo } from 'react'
import { useParams } from 'react-router'

// TODO: FOR MVP, we are assuming one share class per pool
// Routing must be fix to handle multiple share classes per pool
export default function Account() {
  const params = useParams()
  const poolId = params.poolId
  const connectedChainId = useChainId()
  const { data: poolDetails } = usePoolDetails(new PoolId(poolId ?? ''))
  const { data: networks } = usePoolNetworks(poolDetails?.id)
  const network = networks?.find((n) => n.chainId === connectedChainId)
  // TODO: For MVP, we are assuming one share class per pool
  const shareClass = poolDetails?.shareClasses?.[0]
  const scId = shareClass?.details.id
  const { data: vaults } = useVaults(network, scId)
  const { data: vaultsDetails } = useVaultsDetails(vaults)
  const { data: allInvestments } = useAllInvestments(vaults)

  const totalNav = useMemo(() => {
    return shareClass?.details.navPerShare.mul(shareClass.details.totalIssuance)
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

        <Button label="Update NAV" onClick={() => {}} size="sm" width="150px" />
      </Flex>
      {shareClass && (
        <AccountPage
          vaultsDetails={vaultsDetails ?? []}
          allInvestments={allInvestments ?? []}
          shareClass={shareClass}
        />
      )}
    </Box>
  )
}
