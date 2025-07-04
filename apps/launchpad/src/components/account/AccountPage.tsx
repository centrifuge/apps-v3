import { Balance } from '@centrifuge/sdk'
import { Button, Card, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Grid, Heading, Separator, Stack, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { formatBalanceToString, useNavPerNetwork, useObservable } from '@centrifuge/shared'
import { FaRegChartBar } from 'react-icons/fa'
import { Orders } from './Orders'
import { PoolHoldings } from './PoolHoldings'
import { useNavigate, useParams } from 'react-router'

const calculateNav = (pricePerShare: Balance, numberOfShares: Balance) => {
  return pricePerShare.mul(numberOfShares)
}

export function AccountPage({
  vaultsDetails,
  investmentsPerVaults,
  sc,
}: {
  // TODO: types
  vaultsDetails: any[]
  investmentsPerVaults: any[]
  sc: any
}) {
  const navigate = useNavigate()
  const { poolId } = useParams()
  const { data: navPerNetwork, isLoading } = useNavPerNetwork(sc.shareClass)

  const amounts = useMemo(() => {
    return {
      totalNav: calculateNav(sc?.details.pricePerShare, sc.details.totalIssuance) ?? 0,
      totalNavPerShare: sc?.details.pricePerShare ?? 0,
      totalIssuance: sc?.details.totalIssuance ?? 0,
    }
  }, [sc])

  console.log(amounts)

  const pendingInvestments = useMemo(
    () => investmentsPerVaults.map((investment) => investment.pendingInvestCurrency),
    [investmentsPerVaults]
  )
  const pendingRedemptions = useMemo(
    () => investmentsPerVaults.map((investment) => investment.pendingRedeemShares),
    [investmentsPerVaults]
  )

  if (isLoading) return <p>Loading....</p>

  return (
    <Box mb={8}>
      <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
        <Card>
          <Stack gap={8}>
            <Box>
              <Stack gap={0}>
                <Heading fontSize="xs">NAV</Heading>
                <Heading size="2xl">
                  {formatBalanceToString(amounts.totalNav, 2) ?? '0'} {sc?.details.symbol}
                </Heading>
              </Stack>
              <Separator mt={2} mb={2} />
              {navPerNetwork?.map((network, index) => (
                <Flex key={`${network.chainId}-${index}`} align="center" gap={2}>
                  <NetworkIcon networkId={network.chainId} boxSize="20px" />
                  <Text fontSize="sm">
                    {formatBalanceToString(network.nav, 2) ?? '0'} {sc?.details.symbol}
                  </Text>
                </Flex>
              ))}
            </Box>
            <Box>
              <Stack gap={0}>
                <Heading fontSize="xs">NAV per share</Heading>
                <Flex justify="space-between" align="center" width="100%">
                  <Heading size="2xl">
                    {formatBalanceToString(amounts.totalNavPerShare, 4) ?? '0'} {sc?.details.symbol}
                  </Heading>
                </Flex>
              </Stack>
              <Separator mt={2} mb={2} />
              {navPerNetwork?.map((network, index) => (
                <Flex key={`${network.chainId}-${index}`} align="center" gap={2}>
                  <NetworkIcon networkId={network.chainId} boxSize="20px" />
                  <Text fontSize="sm">
                    {formatBalanceToString(network.pricePerShare, 2) ?? '0'} {sc?.details.symbol}
                  </Text>
                </Flex>
              ))}
            </Box>
          </Stack>
        </Card>
        {/* TODO: Add chart */}
        <Card>
          <Flex align="center" gap={2} margin="auto">
            <Text>Coming soon</Text>
            <FaRegChartBar />
          </Flex>
        </Card>
      </Grid>
      <Stack mt={8} gap={2}>
        <Heading size="sm">Orders</Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <Orders title="Investments" pendingBalances={pendingInvestments} isInvestment />
          <Orders title="Redemptions" pendingBalances={pendingRedemptions} />
        </Grid>
      </Stack>
      {/* TODO: ADD POOL HOLDINGS ONCE SDK HAS BEEN UPDATED TO RETRIEVE POOL HOLDINGS */}
      <Stack mt={8} gap={2}>
        <Stack gap={0} mb={4}>
          <Heading size="sm">Holdings</Heading>
          <Flex justify="space-between">
            <Heading size="3xl">39,139,062 USDC</Heading>
            <Button
              label="Add holding"
              onClick={() => navigate(`/holdings/${poolId}/add`)}
              colorPalette="gray"
              width="140px"
              size="sm"
            />
          </Flex>
        </Stack>
        <PoolHoldings shareClass={sc.shareClass} />
      </Stack>
    </Box>
  )
}
