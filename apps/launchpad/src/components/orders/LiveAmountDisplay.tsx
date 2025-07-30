import { useWatch, useFormContext } from 'react-hook-form'
import { Box, Text } from '@chakra-ui/react'
import { Balance, Price } from '@centrifuge/sdk'
import { formatUIBalance } from '@centrifuge/shared'

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

  const liveAmount = useWatch({ control, name }) as Balance | string
  const priceVal = useWatch({ control, name: pricePerShareName ?? '' }) as number | undefined

  if (liveAmount == '') {
    return 0
  }

  const amountFloat = typeof liveAmount === 'string' ? parseFloat(liveAmount) : liveAmount.toFloat()
  const amountToPoolDecimal = Balance.fromFloat(amountFloat, poolDecimals)
  let finalAmount = amountToPoolDecimal ?? 0

  switch (calculationType) {
    case 'issue':
      if (pricePerShareName) {
        if (priceVal === 0) {
          return 0
        }
        if (priceVal) {
          const price = Balance.fromFloat(priceVal, poolDecimals)
          finalAmount = amountToPoolDecimal.mul(price)
        }
      }
      break
    case 'revoke':
      if (pricePerShareName) {
        if (priceVal === 0) {
          return 0
        }
        if (priceVal) {
          const price = Balance.fromFloat(priceVal, poolDecimals)
          finalAmount = amountToPoolDecimal.div(price)
        }
      }
      break
  }

  return (
    <Box display="flex" alignItems="center">
      <Text>
        {formatUIBalance(finalAmount, {
          tokenDecimals: poolDecimals,
        })}
      </Text>
    </Box>
  )
}
