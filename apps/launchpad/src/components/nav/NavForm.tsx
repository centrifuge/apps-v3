import { Box, Grid, GridItem } from '@chakra-ui/react'
import { BalanceInput, useFormContext } from '@centrifuge/forms'
import { Balance, ShareClass } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { BalanceInputDisplay } from '@centrifuge/ui'
import { calculateNewNav } from './utils'

interface NavFormProps {
  shareClassDetails?: Awaited<ReturnType<typeof ShareClass.prototype.details>>
}

export function NavForm({ shareClassDetails }: NavFormProps) {
  const { poolDetails } = useSelectedPool()
  const decimals = poolDetails?.currency.decimals ?? 18

  const { watch } = useFormContext()
  const [newTokenPrice] = watch(['newTokenPrice'])

  const newNav = useMemo(() => {
    if (!shareClassDetails || !newTokenPrice) return Balance.ZERO
    return calculateNewNav(shareClassDetails.nav, newTokenPrice)
  }, [shareClassDetails, newTokenPrice])

  const gapValue = 6

  return (
    <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" columnGap={gapValue}>
      <GridItem colSpan={1} rowSpan={2}>
        <Box mb={gapValue}>
          <BalanceInputDisplay
            balance={shareClassDetails?.nav ?? 0}
            currency={poolDetails?.currency.symbol ?? ''}
            decimals={decimals}
            label="Current NAV"
          />
        </Box>
        <Box mb={gapValue}>
          <BalanceInputDisplay
            balance={shareClassDetails?.pricePerShare ?? 0}
            currency={poolDetails?.currency.symbol ?? ''}
            decimals={decimals}
            label="Current Token price"
            precision={6}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1} rowSpan={2}>
        <Box mb={gapValue}>
          <BalanceInputDisplay
            balance={newNav}
            currency={poolDetails?.currency.symbol ?? ''}
            decimals={decimals}
            label="New NAV"
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
            label="New token price"
          />
        </Box>
      </GridItem>
    </Grid>
  )
}
