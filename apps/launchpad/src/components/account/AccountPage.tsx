import { Balance } from '@centrifuge/sdk'
import { Card, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Grid, Heading, Separator, Stack, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import {
  formatUIBalance,
  formatBalanceToString,
  PoolDetails,
  ShareClassWithDetails,
  useNavPerNetwork,
} from '@centrifuge/shared'
import { FaRegChartBar } from 'react-icons/fa'
import { Orders } from './Orders'
import { PoolHoldings } from './PoolHoldings'

export function AccountPage({ sc, poolDetails }: { sc: ShareClassWithDetails; poolDetails: PoolDetails }) {
  const { data: navPerNetwork } = useNavPerNetwork(sc.shareClass)
  const decimals = poolDetails?.currency.decimals
  const poolCurrencySymbol = poolDetails?.currency.symbol

  const { amounts } = useMemo(() => {
    const initialTotals = {
      totalNav: new Balance(0, decimals),
      totalIssuance: new Balance(0, decimals),
      totalNavPerShare: new Balance(0, decimals),
    }

    const totals =
      navPerNetwork?.reduce(
        (acc, network) => ({
          totalNav: acc.totalNav.add(network.nav),
          totalIssuance: acc.totalIssuance.add(network.totalIssuance),
          totalNavPerShare: acc.totalNavPerShare.add(network.pricePerShare),
        }),
        initialTotals
      ) || initialTotals

    const amounts = {
      totalNav: totals.totalNav.mul(totals.totalIssuance),
      totalIssuance: totals.totalIssuance,
      totalNavPerShare: totals.totalNavPerShare,
    }

    return { totals, amounts }
  }, [navPerNetwork, decimals])

  return (
    <Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
        <Card>
          <Stack gap={8}>
            <Box>
              <Stack gap={0}>
                <Heading fontSize="xs">NAV</Heading>
                <Heading size="2xl">
                  {formatUIBalance(amounts.totalNav, { precision: 2 }) ?? '0'} {poolCurrencySymbol}
                </Heading>
              </Stack>
              <Separator mt={2} mb={2} />
              {navPerNetwork?.map((network, index) => (
                <Flex key={`${network.chainId}-${index}`} align="center" gap={2}>
                  <NetworkIcon networkId={network.chainId} boxSize="20px" />
                  <Text fontSize="sm">
                    {formatUIBalance(network.nav, { precision: 2 }) ?? '0'} {poolCurrencySymbol}
                  </Text>
                </Flex>
              ))}
            </Box>
            <Box>
              <Stack gap={0}>
                <Heading fontSize="xs">NAV per share</Heading>
                <Flex justify="space-between" align="center" width="100%">
                  <Heading size="2xl">
                    {formatUIBalance(amounts.totalNavPerShare, { precision: 4 }) ?? '0'} {poolCurrencySymbol}
                  </Heading>
                </Flex>
              </Stack>
              <Separator mt={2} mb={2} />
              {navPerNetwork?.map((network, index) => (
                <Flex key={`${network.chainId}-${index}`} align="center" gap={2}>
                  <NetworkIcon networkId={network.chainId} boxSize="20px" />
                  <Text fontSize="sm">
                    {formatBalanceToString(network.pricePerShare, 2) ?? '0'} {poolCurrencySymbol}
                  </Text>
                </Flex>
              ))}
            </Box>
          </Stack>
        </Card>
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
          <Orders title="Investments" shareClass={sc} isInvestment poolCurrencySymbol={poolCurrencySymbol} />
          <Orders title="Redemptions" shareClass={sc} poolCurrencySymbol={poolCurrencySymbol} />
        </Grid>
      </Stack>
      <PoolHoldings poolDecimals={decimals} shareClass={sc.shareClass} />
    </Box>
  )
}
