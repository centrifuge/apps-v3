import { formatUIBalance, ShareClassWithDetails } from '@centrifuge/shared'
import { usePendingAmounts } from '@centrifuge/shared/src/hooks/useShareClass'
import { Button, Card, LinkButton } from '@centrifuge/ui'
import { Flex, Heading, Separator, Stack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useParams } from 'react-router'

export function Orders({
  title,
  shareClass,
  isInvestment,
  poolCurrencySymbol,
}: {
  title: string
  shareClass: ShareClassWithDetails
  isInvestment?: boolean
  poolCurrencySymbol: string
}) {
  const params = useParams()
  const { data: pendingAmounts } = usePendingAmounts(shareClass.shareClass)
  const poolId = params.poolId
  const defaultRoute = `/orders/${poolId}/approve`

  const findRoute = (isApprove: boolean) => {
    let route = defaultRoute
    if (isInvestment && isApprove) {
      route = defaultRoute
    } else if (!isInvestment && isApprove) {
      route = `/orders/${poolId}/approveRedeem`
    } else if (isInvestment && !isApprove) {
      route = `/orders/${poolId}/issue`
    } else if (!isInvestment && !isApprove) {
      route = `/orders/${poolId}/revokeRedeem`
    }

    return route
  }

  const pendingAmount = useMemo(() => {
    return pendingAmounts
      ?.map((p) => (isInvestment ? p.pendingDeposit : p.pendingRedeem))
      .reduce((acc, curr) => acc + curr.toFloat(), 0)
  }, [pendingAmounts, isInvestment])

  const approvedAmount = useMemo(() => {
    return pendingAmounts
      ?.map((p) => (isInvestment ? p.pendingIssuancesTotal : p.pendingRevocationsTotal))
      .reduce((acc, curr) => acc + curr.toFloat(), 0)
  }, [pendingAmounts, isInvestment])

  return (
    <Card>
      <Heading size="sm">{title}</Heading>
      <Separator mt={2} mb={2} />
      <Flex mt={2} justify="space-between" alignItems="center">
        <Stack gap={0}>
          <Heading size="xs">{isInvestment ? 'Pending investments' : 'Pending redemptions'}</Heading>
          <Heading size="2xl">
            {formatUIBalance(pendingAmount ?? 0, {
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
            {formatUIBalance(approvedAmount ?? 0, {
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
