import { formatBalance } from '@centrifuge/shared'
import { NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { getAgencyNormalisedName, RatingPill } from '@components/RatingPill'
import { usePoolsContext } from '@contexts/usePoolsContext'

export function PoolDetailsOverview() {
  const { poolDetails, networks, shareClass } = usePoolsContext()
  const metadata = poolDetails?.metadata

  const items = [
    { label: 'Asset type', value: metadata?.pool.asset.class },
    { label: 'APY', value: `${shareClass?.details.apyPercentage ?? 0}%` },
    {
      label: 'Average asset maturity',
      value: 24, // TODO: replace with actual value
    },
    { label: 'Min. investment', value: formatBalance(shareClass?.details.minInitialInvestment ?? 0, 'USD') },
    { label: 'Investor type', value: metadata?.pool.investorType || 'Non-US Professional' },
    {
      label: 'Available networks',
      value: <Flex>{networks?.map((network, index) => <NetworkIcon key={index} networkId={network.chainId} />)}</Flex>,
    },
    { label: 'Pool structure', value: poolDetails?.metadata?.pool.poolStructure || 'Unknown' },
    {
      label: 'Rating',
      value: (
        <Flex>
          {metadata?.pool.poolRatings?.map((rating) => {
            const agency = getAgencyNormalisedName(rating.agency)
            const normalisedRating = {
              ...rating,
              agency,
            }
            return (
              <Box ml={2} key={rating.agency}>
                <RatingPill rating={normalisedRating} />
              </Box>
            )
          })}
        </Flex>
      ),
    },
    { label: 'Expense ratio', value: poolDetails?.metadata?.pool.expenseRatio || 'Unknown' },
  ]

  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        Overview
      </Heading>

      <Box
        bg="bg-primary"
        width="100%"
        padding={{ base: 6, md: 8 }}
        borderRadius={10}
        border="1px solid"
        borderColor="border-primary"
        shadow="xs"
      >
        {items.map((item) => (
          <Flex key={item.label} justifyContent="space-between" alignItems="center" mt={4}>
            <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="gray.500">
              {item.label}
            </Text>
            {typeof item.value !== 'string' ? (
              item.value
            ) : (
              <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="gray.800">
                {item.value}
              </Text>
            )}
          </Flex>
        ))}
      </Box>
    </>
  )
}
