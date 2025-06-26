import { Balance } from '@centrifuge/sdk'
import { formatBalanceToString } from '@centrifuge/shared'
import { Button, Card } from '@centrifuge/ui'
import { Flex, Heading, Separator, Stack } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'

export function Orders({
  title,
  pendingBalances,
  isInvestment,
}: {
  title: string
  pendingBalances: Balance[]
  isInvestment?: boolean
}) {
  const navigate = useNavigate()
  const params = useParams()
  const poolId = params.poolId

  // TODO: might not be right because of the decimals, where decimals should come from?
  const totalPending =
    pendingBalances.length > 0
      ? pendingBalances.reduce((acc, balance) => acc.add(balance), new Balance(0, pendingBalances[0].decimals))
      : new Balance(0, 18)

  const findRoute = (isApprove: boolean) => {
    const defaultRoute = `/orders/${poolId}/approve`
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

    navigate(route)
  }

  return (
    <Card>
      <Heading size="sm">{title}</Heading>
      <Separator mt={2} mb={2} />
      <Flex mt={2} justify="space-between" alignItems="center">
        <Stack gap={0}>
          <Heading size="xs">{isInvestment ? 'Pending investments' : 'Pending redemptions'}</Heading>
          <Heading size="2xl">{formatBalanceToString(totalPending, 2)} USDC</Heading>
        </Stack>
        <Button label="Approve" onClick={() => findRoute(true)} colorPalette="gray" size="sm" width="120px" />
      </Flex>
      <Separator mt={4} mb={4} />
      {/* TODO: NEED INDEXER ONCE SDK HAS BEEN UPDATED TO RETRIEVE PREVIOUSLY APPROVED AMOUNTS */}
      <Flex mt={2} justify="space-between" alignItems="center">
        <Stack gap={0}>
          <Heading size="xs">{isInvestment ? 'Approved investments' : 'Approved redemptions'}</Heading>
          <Heading size="2xl">{0} USDC</Heading>
        </Stack>
        <Button
          label={isInvestment ? 'Issue' : 'Revoke'}
          onClick={() => findRoute(false)}
          colorPalette="gray"
          size="sm"
          width="120px"
        />
      </Flex>
    </Card>
  )
}
