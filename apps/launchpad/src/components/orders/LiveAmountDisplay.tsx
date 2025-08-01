import { useWatch, useFormContext } from 'react-hook-form'
import { Box, Text } from '@chakra-ui/react'
import { formatUIBalance } from '@centrifuge/shared'
import Decimal from 'decimal.js'

type LiveAmountDisplayProps = {
  name: string
  pricePerShare?: string | number
  calculationType?: 'issue' | 'revoke'
}

export const LiveAmountDisplay = ({ name, pricePerShare, calculationType = 'issue' }: LiveAmountDisplayProps) => {
  const { control } = useFormContext()
  const liveAmount = useWatch({ control, name }) as string

  if (!liveAmount || liveAmount === '0') {
    return <Text>0</Text>
  }

  let finalAmount: Decimal | string = new Decimal(liveAmount)

  if (pricePerShare) {
    const priceDecimal = new Decimal(pricePerShare)
    const amountDecimal = new Decimal(liveAmount)

    if (priceDecimal.isZero()) {
      finalAmount = '0'
    } else if (calculationType === 'issue') {
      finalAmount = amountDecimal.mul(priceDecimal)
    } else if (calculationType === 'revoke') {
      finalAmount = amountDecimal.div(priceDecimal)
    }
  }

  return (
    <Box display="flex" alignItems="center">
      <Text>{formatUIBalance(finalAmount.toString())}</Text>
    </Box>
  )
}
