import { useMemo } from 'react'
import { Balance } from '@centrifuge/sdk'
import { formatBalance } from '@centrifuge/shared'
import { Text } from '@chakra-ui/react'

interface BalanceDisplayProps {
  balance: Balance
  currency?: string
  precision?: number
  minPrecision?: number
}

export function BalanceDisplay({ balance, currency, precision = 2, minPrecision = 2 }: BalanceDisplayProps) {
  const formattedValue = useMemo(() => {
    return formatBalance(balance, currency, precision, minPrecision)
  }, [balance, currency, precision, minPrecision])

  return <Text color="gray.800">{formattedValue}</Text>
}
