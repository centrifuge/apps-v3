import { formatBigintToString } from '@centrifuge/shared'
import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
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
      <Grid templateColumns={{ base: 'repeat(3, 1fr)', lg: '7fr 6fr 4fr' }} gap={4}>
        {items.map((item, index) => (
          <GridItem minW={0} overflow="hidden" position="relative" key={item.label}>
            <Box
              padding={{ base: '1rem 0 0 0', md: '0 1rem' }}
              borderLeft={index > 0 ? { base: 'none', md: '1px solid #E7E7E7' } : 'none'}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Text fontSize="12px" color="black" width="auto" textAlign={{ base: 'center', md: 'left' }}>
                {item.label}
              </Text>
              <Text
                fontSize="clamp(0.5rem, 1rem, 1rem)"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                fontWeight={500}
              >
                {item.value}
              </Text>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  )
}
