import { Balance } from '@centrifuge/sdk'
import { Field, Input, InputGroup } from '@chakra-ui/react'
import { formatUIBalance } from '@centrifuge/shared'

interface BalanceInputDisplayProps {
  balance: Balance | number | string
  currency: string
  decimals: number
  label: string
  precision?: number
}

export const BalanceInputDisplay = (props: BalanceInputDisplayProps) => {
  const { balance, currency, decimals, label, precision } = props

  return (
    <Field.Root required>
      <Field.Label>{label}</Field.Label>
      <InputGroup endElement={currency}>
        <Input placeholder="0.00" value={formatUIBalance(balance, { tokenDecimals: decimals, precision })} disabled />
      </InputGroup>
    </Field.Root>
  )
}
