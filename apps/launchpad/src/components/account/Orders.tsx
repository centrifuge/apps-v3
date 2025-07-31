import { formatUIBalance } from '@centrifuge/shared'
import { usePendingAmounts } from '@centrifuge/shared/src/hooks/useShareClass'
import { Card, LinkButton } from '@centrifuge/ui'
import { Flex, Heading, Separator, Stack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Balance } from '@centrifuge/sdk'
import { sumAmounts } from '@components/orders/utils'

export function Orders({ title, isInvestment }: { title: string; isInvestment?: boolean }) {
  const { poolId, shareClass, poolCurrency } = useSelectedPool()
  const { data: pendingAmounts } = usePendingAmounts(shareClass, { enabled: !!shareClass })
  const defaultRoute = `/pool/${poolId?.toString()}/${shareClass?.id.toString()}/orders/approve`

  const poolCurrencySymbol = poolCurrency?.symbol ?? 'USD'
  const poolCurrencyDecimals = poolCurrency?.decimals ?? 18

  const findRoute = (isApprove: boolean) => {
    let route = defaultRoute
    if (isInvestment && isApprove) {
      route = defaultRoute
    } else if (!isInvestment && isApprove) {
      route = `/pool/${poolId?.toString()}/${shareClass?.id.toString()}/orders/approveRedeem`
    } else if (isInvestment && !isApprove) {
      route = `/pool/${poolId?.toString()}/${shareClass?.id.toString()}/orders/issue`
    } else if (!isInvestment && !isApprove) {
      route = `/pool/${poolId?.toString()}/${shareClass?.id.toString()}/orders/revokeRedeem`
    }

    return route
  }

  const { pendingInvestments, pendingRedemptions, pendingIssuances, pendingRevocations } = useMemo(() => {
    return {
      pendingInvestments: sumAmounts('pendingDeposit', pendingAmounts, poolCurrencyDecimals),
      pendingRedemptions: sumAmounts('pendingRedeem', pendingAmounts, poolCurrencyDecimals),
      pendingIssuances: sumAmounts('pendingIssuancesTotal', pendingAmounts, poolCurrencyDecimals),
      pendingRevocations: sumAmounts('pendingRevocationsTotal', pendingAmounts, poolCurrencyDecimals),
    }
  }, [pendingAmounts])

  return (
    <Card>
      <Heading size="sm">{title}</Heading>
      <Separator mt={2} mb={2} />
      <Flex mt={2} justify="space-between" alignItems="center">
        <Stack gap={0}>
          <Heading size="xs">{isInvestment ? 'Pending investments' : 'Pending redemptions'}</Heading>
          <Heading size="2xl">
            {formatUIBalance(isInvestment ? pendingInvestments : (pendingRedemptions ?? 0), {
              precision: 2,
              currency: poolCurrencySymbol,
            })}
          </Heading>
        </Stack>
        <LinkButton to={findRoute(true)} colorPalette="black" size="sm" width="120px">
          Approve
        </LinkButton>
      </Flex>
      <Separator mt={4} mb={4} />
      <Flex mt={2} justify="space-between" alignItems="center">
        <Stack gap={0}>
          <Heading size="xs">{isInvestment ? 'Approved investments' : 'Approved redemptions'}</Heading>
          <Heading size="2xl">
            {formatUIBalance(isInvestment ? pendingIssuances : (pendingRevocations ?? 0), {
              precision: 2,
              currency: poolCurrencySymbol,
            })}
          </Heading>
        </Stack>
        {isInvestment ? (
          <LinkButton to={findRoute(false)} colorPalette="black" size="sm" width="120px">
            Issue
          </LinkButton>
        ) : (
          <LinkButton to={findRoute(false)} colorPalette="black" size="sm" width="120px">
            Revoke
          </LinkButton>
        )}
      </Flex>
    </Card>
  )
}
