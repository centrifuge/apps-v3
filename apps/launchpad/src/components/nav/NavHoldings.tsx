import { Balance, Price } from '@centrifuge/sdk'
import { formatUIBalance, networkToName } from '@centrifuge/shared'
import { NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { calculateNewNav } from './utils'
import { useFormContext } from '@centrifuge/forms'

interface NetworksNav {
  chainId: number
  totalIssuance: Balance
  pricePerShare: Price
  nav: Balance
}

interface NavHoldingsProps {
  networksNavs: NetworksNav[] | undefined
  withNewNav?: boolean
}

export function NavHoldings({ networksNavs, withNewNav }: NavHoldingsProps) {
  const { poolDetails } = useSelectedPool()
  const currencySymbol = poolDetails?.currency.symbol ?? ''
  const decimals = poolDetails?.currency.decimals ?? 18

  const { watch } = useFormContext()
  const [newTokenPrice] = watch(['newTokenPrice'])

  return (
    <>
      {networksNavs
        ? networksNavs.map((network) => {
            const navToPoolDecimal = Balance.fromFloat(network.nav.toFloat(), decimals)
            const newNav = withNewNav ? calculateNewNav(navToPoolDecimal, newTokenPrice) : navToPoolDecimal
            return (
              <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} key={network.chainId}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Flex alignItems="center" justifyContent="flex-start">
                    <NetworkIcon networkId={network.chainId} />
                    <Text fontSize="xs" ml={2}>
                      {networkToName(network.chainId)}
                    </Text>
                  </Flex>
                  <Text fontSize="sm">
                    {formatUIBalance(newNav, { currency: currencySymbol, precision: 2, tokenDecimals: decimals })}
                  </Text>
                </Flex>
              </Box>
            )
          })
        : null}
    </>
  )
}
