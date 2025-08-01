import { useWatch, useFormContext } from 'react-hook-form'
import { Box, Text } from '@chakra-ui/react'
import { formatUIBalance } from '@centrifuge/shared'
import Decimal from 'decimal.js'

type LiveAmountDisplayProps = {
  name: string
  pricePerShareName?: string
  calculationType?: 'issue' | 'revoke'
}

export const LiveAmountDisplay = ({ name, pricePerShareName, calculationType = 'issue' }: LiveAmountDisplayProps) => {
  const { control } = useFormContext()

  const liveAmount = useWatch({ control, name }) as string
  const priceVal = useWatch({ control, name: pricePerShareName ?? '' }) as string

  if (!liveAmount || liveAmount === '0' || !priceVal || priceVal === '0') {
    return <Text>0</Text>
  }

  const amountDecimal = new Decimal(liveAmount)
  const priceDecimal = new Decimal(priceVal)
  let finalAmount: Decimal = amountDecimal

  switch (calculationType) {
    case 'issue':
      finalAmount = amountDecimal.div(priceDecimal) // amount of currency / price = amount of shares
      break
    case 'revoke':
      finalAmount = amountDecimal.mul(priceDecimal) // amount of shares * price = amount of currency
      break
  }

  return (
    <Box display="flex" alignItems="center">
      <Text>{formatUIBalance(finalAmount.toString())}</Text>
    </Box>
  )
}
