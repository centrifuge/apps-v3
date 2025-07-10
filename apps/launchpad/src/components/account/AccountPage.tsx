import { Balance } from '@centrifuge/sdk'
import { Button, Card, Loader, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Grid, Heading, Separator, Stack, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import {
  formatBalance,
  formatBalanceToString,
  PoolDetails,
  ShareClassWithDetails,
  useNavPerNetwork,
} from '@centrifuge/shared'
import { FaRegChartBar } from 'react-icons/fa'
import { Orders } from './Orders'
import { PoolHoldings } from './PoolHoldings'
import { useNavigate, useParams } from 'react-router'

export function AccountPage({ sc, poolDetails }: { sc: ShareClassWithDetails; poolDetails: PoolDetails }) {
  const navigate = useNavigate()
  const { poolId } = useParams()
  const { data: navPerNetwork } = useNavPerNetwork(sc.shareClass)
  const decimals = poolDetails?.currency.decimals

  const totalNav = useMemo(() => {
    return navPerNetwork?.map((network) => network.nav).reduce((acc, curr) => acc.add(curr), new Balance(0, decimals))
  }, [navPerNetwork])

  const totalIssuance = useMemo(() => {
    return (
      navPerNetwork
        ?.map((network) => network.totalIssuance)
        .reduce((acc, curr) => acc.add(curr), new Balance(0, decimals)) ?? new Balance(0, decimals)
    )
  }, [navPerNetwork])

  const totalNavPerShare = useMemo(() => {
    return navPerNetwork
      ?.map((network) => network.pricePerShare)
      .reduce((acc, curr) => acc.add(curr), new Balance(0, decimals))
  }, [navPerNetwork])

  const amounts = useMemo(() => {
    return {
      totalNav: totalNav?.mul(totalIssuance) ?? 0,
      totalNavPerShare: totalNavPerShare ?? 0,
      totalIssuance: totalIssuance ?? 0,
    }
  }, [totalNav, totalIssuance, totalNavPerShare])

  console.log(navPerNetwork)

  return (
    <Box mb={8}>
      <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
        <Card>
          <Stack gap={8}>
            <Box>
              <Stack gap={0}>
                <Heading fontSize="xs">NAV</Heading>
                <Heading size="2xl">
                  {formatBalance(amounts.totalNav, { precision: 2 }) ?? '0'} {sc?.details.symbol}
                </Heading>
              </Stack>
              <Separator mt={2} mb={2} />
              {navPerNetwork?.map((network, index) => (
                <Flex key={`${network.chainId}-${index}`} align="center" gap={2}>
                  <NetworkIcon networkId={network.chainId} boxSize="20px" />
                  <Text fontSize="sm">
                    {formatBalance(network.nav, { precision: 2 }) ?? '0'} {sc?.details.symbol}
                  </Text>
                </Flex>
              ))}
            </Box>
            <Box>
              <Stack gap={0}>
                <Heading fontSize="xs">NAV per share</Heading>
                <Flex justify="space-between" align="center" width="100%">
                  <Heading size="2xl">
                    {formatBalance(amounts.totalNavPerShare, { precision: 4 }) ?? '0'} {sc?.details.symbol}
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
          <Orders title="Investments" shareClass={sc} isInvestment />
          <Orders title="Redemptions" shareClass={sc} />
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
