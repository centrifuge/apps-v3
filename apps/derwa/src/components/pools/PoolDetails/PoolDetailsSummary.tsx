import { formatBigintToString } from '@centrifuge/shared'
import { Box, Flex, Text } from '@chakra-ui/react'
import { usePoolsContext } from '@contexts/usePoolsContext'

export function PoolDetailsSummary() {
  const { shareClass, poolTVL } = usePoolsContext()
  const apy = shareClass?.details.apyPercentage?.toString() ?? '0'

  const items = [
    {
      label: 'TVL (USD)',
      value: poolTVL ?? 'unknown',
    },
    {
      label: 'Token price (USD)',
      value: formatBigintToString(
        shareClass?.details.pricePerShare.toBigInt() ?? 0n,
        shareClass?.details.pricePerShare.decimals ?? 6,
        2
      ),
    },
    {
      label: 'APY',
      value: `${apy}%`,
    },
  ]

  return (
    <Box bg="bg-primary" padding={6} borderRadius={10} border="1px solid" borderColor="border-primary" shadow="xs">
      <Flex
        justifyContent={{ base: 'center', md: 'flex-start' }}
        alignItems="center"
        flexDirection={{ base: 'column', md: 'row' }}
      >
        {items.map((item, index) => (
          <Box
            padding={{ base: '1rem 0 0 0', md: '0 2.5rem 0 1.5rem' }}
            borderLeft={index > 0 ? { base: 'none', md: '1px solid #E7E7E7' } : 'none'}
            key={item.label}
          >
            <Text fontSize="12px" color="black" width="auto" textAlign={{ base: 'center', md: 'left' }}>
              {item.label}
            </Text>
            <Text fontSize="xl" fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
              {item.value}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  )
}
