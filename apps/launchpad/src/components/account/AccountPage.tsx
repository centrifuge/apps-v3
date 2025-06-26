import { Balance } from '@centrifuge/sdk'
import { Card, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Grid, Heading, Separator, Stack, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { formatBalanceToString } from '@centrifuge/shared'
import { FaRegChartBar } from 'react-icons/fa'

const calculateNav = (pricePerShare: Balance, numberOfShares: Balance) => {
  return pricePerShare.mul(numberOfShares)
}

export function AccountPage({
  vaultsDetails,
  allInvestments,
  shareClass,
}: {
  // TODO: types
  vaultsDetails: any[]
  allInvestments: any[]
  shareClass: any
}) {
  const navPerNetwork = useMemo(() => {
    return vaultsDetails.map((vault) => {
      return {
        network: vault.network.chainId,
        nav:
          shareClass.details.id.raw === vault.shareClass.id.raw
            ? calculateNav(shareClass.details.navPerShare, shareClass.details.totalIssuance)
            : 0,
      }
    })
  }, [vaultsDetails, shareClass])

  const amounts = useMemo(() => {
    return {
      totalNav: calculateNav(shareClass?.details.navPerShare, shareClass.details.totalIssuance) ?? 0,
      totalNavPerShare: shareClass?.details.navPerShare ?? 0,
      totalIssuance: shareClass?.details.totalIssuance ?? 0,
    }
  }, [shareClass])

  console.log('vault details', vaultsDetails)
  console.log('all investments', allInvestments)
  console.log('share class', shareClass)

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
      <Card>
        <Stack gap={8}>
          <Box>
            <Stack gap={0}>
              <Heading fontSize="xs">NAV</Heading>
              <Heading size="2xl">
                {formatBalanceToString(amounts.totalNav, 2) ?? '0'} {shareClass?.details.symbol}
              </Heading>
            </Stack>
            <Separator mt={2} mb={2} />
            {navPerNetwork.map((nav) => (
              <Flex key={nav.network} align="center" gap={2}>
                <NetworkIcon networkId={nav.network} boxSize="20px" />
                <Text fontSize="sm">
                  {typeof nav.nav === 'number' ? '0' : (formatBalanceToString(nav.nav, 2) ?? '0')}{' '}
                  {shareClass?.details.symbol}
                </Text>
              </Flex>
            ))}
          </Box>
          <Box>
            <Stack gap={0}>
              <Heading fontSize="xs">NAV per share</Heading>
              <Flex justify="space-between" align="center" width="100%">
                <Heading size="2xl">
                  {formatBalanceToString(amounts.totalNavPerShare, 4) ?? '0'} {shareClass?.details.symbol}
                </Heading>
                <Text fontSize="sm">{formatBalanceToString(amounts.totalIssuance, 2) ?? '0'} shares issued</Text>
              </Flex>
            </Stack>
          </Box>
        </Stack>
      </Card>
      <Card>
        <Flex align="center" gap={2} margin="auto">
          <Text>Coming soon</Text>
          <FaRegChartBar />
        </Flex>
      </Card>
      <Text>c</Text>
      <Text>d</Text>
      <Text>e</Text>
    </Grid>
  )
}
