import { useMemo, useState } from 'react'
import { formatUIBalance, usePendingAmounts } from '@centrifuge/shared'
import { Button, Card, Loader } from '@centrifuge/ui'
import { Flex, Grid, GridItem, Heading, Stack, VStack } from '@chakra-ui/react'
import { DisplayOrdersTable } from '@components/orders/DisplayOrdersTable'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { OrdersModal } from '@components/orders/OrdersModal'
import { sumAmounts } from '@components/orders/utils'

export default function Orders() {
  const { shareClass, poolCurrency, isLoading } = useSelectedPool()
  const { data: pendingOrders, isLoading: isPendingOrdersLoading } = usePendingAmounts(shareClass, {
    enabled: !!shareClass,
  })

  const [modal, setModal] = useState<{
    approve: boolean
    redeem: boolean
    issue: boolean
    revoke: boolean
  }>({
    approve: false,
    redeem: false,
    issue: false,
    revoke: false,
  })

  const poolCurrencyDecimals = poolCurrency?.decimals ?? 18

  const { pendingInvestments, pendingRedemptions, pendingIssuances, pendingRevocations } = useMemo(() => {
    return {
      pendingInvestments: sumAmounts('pendingDeposit', pendingOrders, poolCurrencyDecimals),
      pendingRedemptions: sumAmounts('pendingRedeem', pendingOrders, poolCurrencyDecimals),
      pendingIssuances: sumAmounts('pendingIssuancesTotal', pendingOrders, poolCurrencyDecimals),
      pendingRevocations: sumAmounts('pendingRevocationsTotal', pendingOrders, poolCurrencyDecimals),
    }
  }, [pendingOrders])

  if (isPendingOrdersLoading || isLoading) return <Loader />

  if (!pendingOrders?.length) return <VStack>pending orders</VStack>

  return (
    <Stack gap={8}>
      <Stack>
        <Heading size="md">Pending orders</Heading>
        <Card>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12}>
            <GridItem>
              <Flex alignItems="center" justifyContent="space-between" mb={4}>
                <Stack gap={0}>
                  <Heading size="xs">Pending investments</Heading>
                  <Heading size="md">
                    {formatUIBalance(pendingInvestments, {
                      currency: poolCurrency?.symbol,
                      precision: 2,
                      tokenDecimals: poolCurrencyDecimals,
                    })}
                  </Heading>
                </Stack>
                <Button
                  size="sm"
                  colorPalette="yellow"
                  label="Approve"
                  w="120px"
                  onClick={() => setModal({ approve: true, redeem: false, issue: false, revoke: false })}
                  disabled={pendingInvestments?.isZero()}
                />
              </Flex>
              <DisplayOrdersTable dataKey="pendingDeposit" orders={pendingOrders ?? []} />
            </GridItem>
            <GridItem>
              <Flex alignItems="center" justifyContent="space-between" mb={4}>
                <Stack gap={0}>
                  <Heading size="xs">Pending redemptions</Heading>
                  <Heading size="md">
                    {formatUIBalance(pendingRedemptions, {
                      currency: poolCurrency?.symbol,
                      precision: 2,
                      tokenDecimals: poolCurrencyDecimals,
                    })}
                  </Heading>
                </Stack>
                <Button
                  size="sm"
                  colorPalette="yellow"
                  label="Redeem"
                  w="120px"
                  onClick={() => setModal({ approve: false, redeem: true, issue: false, revoke: false })}
                  disabled={pendingRedemptions?.isZero()}
                />
              </Flex>
              <DisplayOrdersTable dataKey="pendingRedeem" orders={pendingOrders ?? []} />
            </GridItem>
          </Grid>
        </Card>
      </Stack>
      <Stack>
        <Heading size="md">Approved orders</Heading>
        <Card>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12}>
            <GridItem>
              <Flex alignItems="center" justifyContent="space-between" mb={4}>
                <Stack gap={0}>
                  <Heading size="xs">Approved investments</Heading>
                  <Heading size="md">
                    {formatUIBalance(pendingIssuances, {
                      currency: poolCurrency?.symbol,
                      precision: 2,
                      tokenDecimals: poolCurrencyDecimals,
                    })}
                  </Heading>
                </Stack>
                <Button
                  size="sm"
                  colorPalette="yellow"
                  label="Issue"
                  w="120px"
                  onClick={() => setModal({ approve: false, redeem: false, issue: true, revoke: false })}
                  disabled={pendingIssuances?.isZero()}
                />
              </Flex>
              <DisplayOrdersTable dataKey="pendingIssuances" orders={pendingOrders ?? []} />
            </GridItem>
            <GridItem>
              <Flex alignItems="center" justifyContent="space-between" mb={4}>
                <Stack gap={0}>
                  <Heading size="xs">Approved redemptions</Heading>
                  <Heading size="md">
                    {formatUIBalance(pendingRevocations, {
                      currency: poolCurrency?.symbol,
                      precision: 2,
                      tokenDecimals: poolCurrencyDecimals,
                    })}
                  </Heading>
                </Stack>
                <Button
                  size="sm"
                  colorPalette="yellow"
                  label="Revoke"
                  w="120px"
                  onClick={() => setModal({ approve: false, redeem: false, issue: false, revoke: true })}
                  disabled={pendingRevocations?.isZero()}
                />
              </Flex>
              <DisplayOrdersTable dataKey="pendingRevocations" orders={pendingOrders ?? []} />
            </GridItem>
          </Grid>
        </Card>
      </Stack>
      <OrdersModal modal={modal} setModal={setModal} />
    </Stack>
  )
}
