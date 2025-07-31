import { Balance, PoolId } from '@centrifuge/sdk'
import { formatBalance, formatDate, useAllPoolDetails } from '@centrifuge/shared'
import { Card } from '@centrifuge/ui'
import { Flex, Skeleton, Text } from '@chakra-ui/react'
import { IoBarChart } from 'react-icons/io5'

export function PoolsTvlCard({ poolIds }: { poolIds: PoolId[] }) {
  const { data: poolsDetails, isLoading } = useAllPoolDetails(poolIds)
  const zeroBalance: Balance = new Balance(0n, 18)

  const totalTVL = poolsDetails?.reduce((acc, pool) => {
    const poolTVL = pool.shareClasses.reduce((innerAcc, shareClass) => {
      const { totalIssuance, pricePerShare } = shareClass.details
      const tvl = totalIssuance.mul(pricePerShare)
      return innerAcc.add(tvl)
    }, zeroBalance)

    return acc.add(poolTVL)
  }, zeroBalance)

  const formattedTotalTVL = totalTVL ? formatBalance(totalTVL, 'USD', 0) : 'unknown'

  if (isLoading) {
    return <Skeleton height="102px" width="380px" borderRadius="md" />
  }

  return (
    <Card borderRadius="xl">
      <Text color="gray.500" fontSize="xs">
        TVL on {formatDate(new Date(), 'short')}
      </Text>
      <Flex alignItems="center" justifyContent="flex-start">
        <IoBarChart size="1.25rem" color="#FFC012" style={{ marginRight: '.5rem' }} />
        <Text fontSize="2xl" fontWeight={500}>
          {formattedTotalTVL}
        </Text>
      </Flex>
    </Card>
  )
}
