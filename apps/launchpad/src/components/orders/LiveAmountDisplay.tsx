import { useWatch, useFormContext } from 'react-hook-form'
import { Box, Text } from '@chakra-ui/react'
import { Balance } from '@centrifuge/sdk'
import { formatUIBalance } from '@centrifuge/shared'
import Decimal from 'decimal.js'

type LiveAmountDisplayProps = {
  name: string
  pricePerShareName?: string
  poolDecimals?: number
  calculationType?: 'issue' | 'revoke'
}

export const LiveAmountDisplay = ({
  name,
  pricePerShareName,
  poolDecimals = 18,
  calculationType = 'issue',
}: LiveAmountDisplayProps) => {
  const { control } = useFormContext()

  const liveAmount = useWatch({ control, name }) as string
  const priceVal = useWatch({ control, name: pricePerShareName ?? '' }) as string

  if (liveAmount === '' || !liveAmount) {
    return '0'
  }

  const amountFloat = parseFloat(liveAmount)
  const amountToPoolDecimal = Balance.fromFloat(amountFloat, poolDecimals)
  let finalAmount = amountToPoolDecimal.toString()

  switch (calculationType) {
    case 'issue':
      if (pricePerShareName) {
        if (priceVal === '0') {
          return priceVal
        }
        if (priceVal) {
          const priceDecimal = new Decimal(priceVal)
          const amountDecimal = new Decimal(liveAmount)
          finalAmount = amountDecimal.mul(priceDecimal).toString()
        }
      }
      break
    case 'revoke':
      if (pricePerShareName) {
        if (priceVal === '0') {
          return priceVal
        }
        if (priceVal) {
          const priceDecimal = new Decimal(priceVal)
          const amountDecimal = new Decimal(liveAmount)
          finalAmount = amountDecimal.div(priceDecimal).toString()
        }
      }
      break
  }

  return (
    <Box display="flex" alignItems="center">
      <Text>{formatUIBalance(finalAmount)}</Text>
    </Box>
  )
}
