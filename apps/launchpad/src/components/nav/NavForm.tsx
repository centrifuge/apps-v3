import { Box, Grid, GridItem } from '@chakra-ui/react'
import { BalanceInput, useFormContext } from '@centrifuge/forms'
import { Balance, ShareClass } from '@centrifuge/sdk'
import { useCallback } from 'react'
import { usePoolProvider } from '@contexts/PoolProvider'
import { debounce, formatBalanceToString } from '@centrifuge/shared'

interface NavFormProps {
  shareClassDetails?: Awaited<ReturnType<typeof ShareClass.prototype.details>>
}

export function NavForm({ shareClassDetails }: NavFormProps) {
  const { setValue } = useFormContext()
  const { poolDetails } = usePoolProvider()
  const decimals = poolDetails?.currency.decimals ?? 18

  const handleCalculateNewNav = useCallback((_stringValue: string, newPricePerShare?: Balance) => {
    if (!shareClassDetails?.totalIssuance || !newPricePerShare) {
      // Set to 0 so we can still update new token price without nav calc value
      return setValue('newNav', '0')
    }

    const newNav = formatBalanceToString(shareClassDetails.totalIssuance.mul(newPricePerShare))
    return setValue('newNav', newNav)
  }, [])

  const debouncedCalculateNewNav = debounce(handleCalculateNewNav, 500)

  const gapValue = 6

  return (
    <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" columnGap={gapValue}>
      <GridItem colSpan={1} rowSpan={2}>
        <Box mb={gapValue}>
          <BalanceInput
            name="currentNav"
            decimals={decimals}
            displayDecimals={2}
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
            decimals={decimals}
            displayDecimals={2}
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
            decimals={decimals}
            displayDecimals={2}
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
            decimals={decimals}
            placeholder="0.00"
            inputGroupProps={{
              endAddon: 'USD per share',
            }}
            label="New Token Price"
            onChange={debouncedCalculateNewNav}
          />
        </Box>
      </GridItem>
    </Grid>
  )
}
