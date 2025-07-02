import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { BalanceInput, useFormContext } from '@centrifuge/forms'
import { BalanceDisplay, NetworkIcon } from '@centrifuge/ui'
import { usePoolProvider } from '@contexts/PoolProvider'
import { Balance } from '@centrifuge/sdk'
import { useEffect, useMemo } from 'react'

type Network = 'ethereum' | 'arbitrum' | 'celo' | 'base'

const NETWORK_ID_MAP: Record<number, Network> = {
  1: 'ethereum', // Ethereum Mainnet
  11155111: 'ethereum', // Ethereum Sepolia
  42161: 'arbitrum', // Arbitrum One
  421614: 'arbitrum', // Arbitrum Sepolia
  42220: 'celo', // Celo Mainnet
  44787: 'celo', // Celo Alfajores
  8453: 'base', // Base Mainnet
  84532: 'base', // Base Sepolia
}

interface NavFormProps {
  parsedNewTokenPrice: Balance | 0
}

export function NavForm({ parsedNewTokenPrice }: NavFormProps) {
  const { network, shareClass } = usePoolProvider()
  const { setValue } = useFormContext()
  const networkName = useMemo(() => NETWORK_ID_MAP[network?.chainId]?.toUpperCase(), [network])

  const navPerShare: Balance = shareClass?.details?.navPerShare ?? 0
  const totalIssuance: Balance = shareClass?.details?.totalIssuance ?? 0
  const hasBalances = typeof navPerShare !== 'number' && typeof totalIssuance !== 'number'

  const currentNav = useMemo(
    () => (hasBalances ? navPerShare.mul(totalIssuance) : 0),
    [hasBalances, navPerShare, totalIssuance]
  )
  const currentTokenPrice = useMemo(
    () => (hasBalances ? totalIssuance.div(navPerShare) : 0),
    [hasBalances, totalIssuance, navPerShare]
  )

  const newNav = useMemo(() => {
    if (parsedNewTokenPrice === 0 || typeof totalIssuance === 'number') return 0

    return parsedNewTokenPrice.mul(totalIssuance)
  }, [parsedNewTokenPrice, totalIssuance])

  useEffect(() => setValue('newNav', newNav), [newNav])
  useEffect(() => setValue('currentNav', currentNav), [currentNav])
  useEffect(() => setValue('currentTokenPrice', currentTokenPrice), [currentTokenPrice])

  const gapValue = 6

  return (
    <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(3, 1fr)" columnGap={gapValue}>
      <GridItem colSpan={1} rowSpan={2}>
        <Box mb={gapValue}>
          <BalanceInput
            name="currentNav"
            decimals={2}
            placeholder="0.00"
            inputGroupProps={{
              endAddon: 'USD',
            }}
            label="Current Nav"
            disabled
          />
        </Box>
        <Box mb={gapValue}>
          <BalanceInput
            name="currentTokenPrice"
            decimals={6}
            placeholder="0.00"
            inputGroupProps={{
              endAddon: 'USD per share',
            }}
            label="Current Token Price"
            disabled
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1} rowSpan={2}>
        <Box mb={gapValue}>
          <BalanceInput
            name="newNav"
            decimals={2}
            placeholder="0.00"
            inputGroupProps={{
              endAddon: 'USD',
            }}
            label="New Nav"
            variant="subtle"
            disabled
          />
        </Box>
        <Box mb={gapValue}>
          <BalanceInput
            name="newTokenPrice"
            decimals={6}
            placeholder="0.00"
            inputGroupProps={{
              endAddon: 'USD per share',
            }}
            label="New Token Price"
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1} rowSpan={1}>
        <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" justifyContent="flex-start">
              <NetworkIcon networkId={network} />
              <Text fontSize="xs" ml={2}>
                {networkName}
              </Text>
            </Flex>
            <BalanceDisplay balance={currentNav} currency="USD" fontSize="sm" />
          </Flex>
        </Box>
      </GridItem>
      <GridItem colSpan={1} rowSpan={1}>
        <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" justifyContent="flex-start">
              <NetworkIcon networkId={network} />
              <Text fontSize="xs" ml={2}>
                {networkName}
              </Text>
            </Flex>
            <BalanceDisplay balance={newNav} currency="USD" fontSize="sm" />
          </Flex>
        </Box>
      </GridItem>
    </Grid>
  )
}
