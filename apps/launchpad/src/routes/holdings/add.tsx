import z from 'zod'
import { Flex, Heading } from '@chakra-ui/react'
import { createBalanceSchema, Form, useForm } from '@centrifuge/forms'
import { usePoolProvider } from '@contexts/PoolProvider'
import { AddHoldingForm } from '@components/holdings/addHoldingForm'
import { Button, Card } from '@centrifuge/ui'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

const schema = z.object({
  network: z.string(),
  asset: z.string(),
  sc: z.string(),
  value: createBalanceSchema(2),
})

export default function Add() {
  const { shareClass, networks, isLoading, poolDetails } = usePoolProvider()

  const form = useForm({
    mode: 'onChange',
    onSubmit: (values) => {
      console.log('Nav form values: ', values)
    },
    onSubmitError: (error) => console.error('Nav form submission error:', error),
  })

  //TODO: Add better loading component
  if (isLoading || !shareClass || !networks) return <div>Loading...</div>

  return (
    <Form form={form}>
      <Flex justifyContent="space-between" alignItems="center" mt={8} mb={8}>
        <Heading>Add holding</Heading>
        <Button label="Save changes" size="sm" />
      </Flex>
      <Card>
        <AddHoldingForm networks={networks} poolDetails={poolDetails} />
      </Card>
    </Form>
  )
}
