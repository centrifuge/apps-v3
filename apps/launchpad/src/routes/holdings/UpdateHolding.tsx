import { BalanceInput, Form, SubmitButton, useForm } from '@centrifuge/forms'
import { Card } from '@centrifuge/ui'
import { Flex, Grid, Heading } from '@chakra-ui/react'
import SelectVault from '@components/holdings/SelectVault'
import UpdateVaultForm from '@components/holdings/UpdateVaultForm'

export default function UpdateHolding() {
  const form = useForm({
    mode: 'onChange',
    onSubmit: (values) => {
      console.log(values)
    },
  })
  return (
    <Form form={form}>
      <Grid gridTemplateColumns="1fr" gap={4}>
        <Flex justify="space-between" align="center" gap={4}>
          <Heading>Update vault</Heading>
          <SubmitButton colorPalette="yellow">Save changes</SubmitButton>
        </Flex>
        <Card>
          <UpdateVaultForm />
        </Card>
        <Card>
          <BalanceInput name="updatePrice" label="Update price" disabled maxWidth="50%" size="sm" />
        </Card>
        <Card>
          <SelectVault />
        </Card>
        <Flex justify="center">
          <SubmitButton colorPalette="yellow">Save changes</SubmitButton>
        </Flex>
      </Grid>
    </Form>
  )
}
