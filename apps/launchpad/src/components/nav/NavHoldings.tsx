import { Balance, Price } from '@centrifuge/sdk'
import { networkToName } from '@centrifuge/shared'
import { BalanceDisplay, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Text } from '@chakra-ui/react'
import { usePoolProvider } from '@contexts/PoolProvider'

interface NetworksNav {
  chainId: number
  totalIssuance: Balance
  pricePerShare: Price
  nav: Balance
}

interface NavHoldingsProps {
  networksNavs: NetworksNav[] | undefined
}

export function NavHoldings({ networksNavs }: NavHoldingsProps) {
  const { poolDetails } = usePoolProvider()
  const currencySymbol = poolDetails?.currency.symbol ?? ''

  return (
    <>
      {networksNavs
        ? networksNavs.map((nav) => (
            <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} key={nav.chainId}>
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" justifyContent="flex-start">
                  <NetworkIcon networkId={nav.chainId} />
                  <Text fontSize="xs" ml={2}>
                    {networkToName(nav.chainId)}
                  </Text>
                </Flex>
                <BalanceDisplay balance={nav.nav} currency={currencySymbol} fontSize="sm" />
              </Flex>
            </Box>
          ))
        : null}
    </>
  )
}
