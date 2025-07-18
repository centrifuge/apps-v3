import { BalanceInput, Input } from '@centrifuge/forms'
import { Grid } from '@chakra-ui/react'

export default function UpdateVaultForm() {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gap={4}>
      <Input name="name" label="Name" size="sm" />
      <Input name="network" label="Network" disabled size="sm" />
      <BalanceInput name="quantity" label="Quantity" size="sm" />
      <BalanceInput name="marketPrice" label="Market price" size="sm" />
      <BalanceInput name="internalPrice" label="Internal price" size="sm" />
      <BalanceInput name="value" label="value" subLabel="(internal price * value)" size="sm" />
    </Grid>
  )
}
