import { useWatch, useFormContext } from 'react-hook-form'
import { Text } from '@chakra-ui/react'
import { Balance } from '@centrifuge/sdk'
import { formatUIBalance } from '@centrifuge/shared'

type LiveAmountDisplayProps = {
  name: string
  poolDecimals?: number
  holdingDecimals?: number
}

export const LiveAmountDisplay = ({ name, poolDecimals }: LiveAmountDisplayProps) => {
  const { control } = useFormContext()

  const liveAmount = useWatch({
    control,
    name,
  }) as Balance | undefined

  if (!liveAmount) {
    return null
  }

  const balance = typeof liveAmount === 'string' ? parseFloat(liveAmount) : liveAmount.toFloat()
  const amountToPoolDecimal = Balance.fromFloat(balance, poolDecimals ?? 18)

  return (
    <Text>
      {formatUIBalance(amountToPoolDecimal, {
        tokenDecimals: poolDecimals,
      })}
    </Text>
  )
}
