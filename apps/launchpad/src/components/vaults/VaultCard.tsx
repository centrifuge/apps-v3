import { formatUIBalance, truncateAddress } from '@centrifuge/shared'
import { Card } from '@centrifuge/ui'
import { Flex, Grid, Text } from '@chakra-ui/react'
import { Balance, HexString } from '@centrifuge/sdk'
import CopyToClipboard from '@centrifuge/ui/src/components/elements/CopyToClipboard'
import { ReactNode } from 'react'

type Value = {
  label: string
  value: string | number | Balance | HexString
  type?: 'address' | 'balance'
  children?: ReactNode
}

export const VaultCard = ({ values }: { values: Value[] }) => {
  const structuredValue = (value: Value['value'], type: Value['type']): string | null => {
    if (type === 'balance') {
      return formatUIBalance(value).toString()
    }
    if (type === 'address') {
      return truncateAddress(value as HexString, 3, 3)
    }

    return String(value)
  }

  return values.map((value) => (
    <Grid gridTemplateColumns="1fr 1fr" gap={2} alignItems="center" key={value.label} mb={2}>
      <Text color="text-secondary" fontWeight={500} fontSize="sm">
        {value.label}
      </Text>
      <Flex alignItems="center" justifyContent="flex-end" marginRight={value.type === 'address' ? '-12px' : '0'}>
        {value.children ? value.children : <Text fontSize="sm">{structuredValue(value.value, value.type)}</Text>}
        {value.type === 'address' && <CopyToClipboard value={value.value as string} />}
      </Flex>
    </Grid>
  ))
}
