import { useWatch, useFormContext } from 'react-hook-form'
import { Box, Text } from '@chakra-ui/react'
import { Balance } from '@centrifuge/sdk'
import { formatUIBalance, ShareClassDetails } from '@centrifuge/shared'

type LiveAmountDisplayProps = {
  name: string
  poolDecimals?: number
  shareClassDetails?: ShareClassDetails
  calculationType?: 'issue' | 'revoke'
}

export const LiveAmountDisplay = ({
  name,
  poolDecimals,
  shareClassDetails,
  calculationType,
}: LiveAmountDisplayProps) => {
  const { control } = useFormContext()

  const liveAmount = useWatch({
    control,
    name,
  }) as Balance | undefined

  if (!liveAmount) {
    return null
  }

  const balance = typeof liveAmount === 'string' ? parseFloat(liveAmount) : liveAmount.toFloat()
  let amountToPoolDecimal = Balance.fromFloat(balance, poolDecimals ?? 18)

  if (shareClassDetails && calculationType === 'issue') {
    const pricePerShare = shareClassDetails.pricePerShare
    const balance = amountToPoolDecimal.mul(pricePerShare)
    amountToPoolDecimal = balance
  }

  if (shareClassDetails && calculationType === 'revoke') {
    const pricePerShare = shareClassDetails.pricePerShare
    const balance = amountToPoolDecimal.div(pricePerShare)
    amountToPoolDecimal = balance
  }

  return (
    <Box display="flex" alignItems="center">
      <Text>
        {formatUIBalance(amountToPoolDecimal, {
          tokenDecimals: poolDecimals,
        })}
      </Text>
    </Box>
  )
}
