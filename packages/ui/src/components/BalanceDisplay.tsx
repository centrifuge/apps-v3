import { useMemo } from 'react'
import { Balance } from '@centrifuge/sdk'
import { formatBalance } from '@centrifuge/shared'
import { Text, TextProps } from '@chakra-ui/react'

interface BalanceDisplayProps extends TextProps {
  balance: Balance | number
  currency?: string
  precision?: number
  minPrecision?: number
}

export function BalanceDisplay(props: BalanceDisplayProps) {
  const { balance, currency, precision = 2, minPrecision = 2, ...rest } = props
  const formattedValue = useMemo(() => {
    return formatBalance(balance, currency, precision, minPrecision)
  }, [balance, currency, precision, minPrecision])

  return (
    <Text color="gray.800" {...rest}>
      {formattedValue}
    </Text>
  )
}
