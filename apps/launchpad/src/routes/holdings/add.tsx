import { useMemo } from 'react'
import { PoolNetwork } from '@centrifuge/sdk'
import { networkToName, useAssets } from '@centrifuge/shared'
import { Button, Card, NetworkIcon, Select } from '@centrifuge/ui'
import { Field, Flex, Grid, Heading, Input, Text } from '@chakra-ui/react'
import { usePoolProvider } from '@contexts/PoolProvider'
import { BalanceInput, Form, useForm } from '@centrifuge/forms'
import { AddHoldingForm } from '@components/holdings/addHoldingForm'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export default function Add() {
  const { shareClass, networks, isLoading, poolDetails } = usePoolProvider()

  const form = useForm({
    defaultValues: {
      network: networks?.[0]?.chainId,
      value: 0,
      asset: 0,
      sc: 0,
    },
    mode: 'onChange',
    onSubmit: (values) => {
      console.log('Nav form values: ', values)
    },
    onSubmitError: (error) => console.error('Nav form submission error:', error),
  })

  const { network, value, asset, sc } = form.watch()

  console.log('network', network)
  console.log('value', value)
  console.log('asset', asset)
  console.log('sc', sc)

  //TODO: Add better loading component
  if (isLoading || !shareClass || !networks) return <div>Loading...</div>

  return (
    <Form form={form}>
      <Flex justifyContent="space-between" alignItems="center" mt={8} mb={8}>
        <Heading>Add holding</Heading>
        <Button label="Save changes" size="sm" />
      </Flex>
      <Card>
        <AddHoldingForm
          networks={networks}
          onSelect={(label, value) => form.setValue(label, value)}
          poolDetails={poolDetails}
        />
      </Card>
    </Form>
  )
}
