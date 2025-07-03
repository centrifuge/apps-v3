import z from 'zod'
import { Flex, Heading } from '@chakra-ui/react'
import { Form, useForm } from '@centrifuge/forms'
import { usePoolProvider } from '@contexts/PoolProvider'
import { AddHoldingForm } from '@components/holdings/addHoldingForm'
import { Button, Card, Loader } from '@centrifuge/ui'
import { AssetId, ShareClassId } from '@centrifuge/sdk'
import { useCentrifugeTransaction } from '@hooks/useCentrifugeTransaction'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

const schema = z.object({
  network: z.string(),
  asset: z.instanceof(AssetId),
  sc: z.instanceof(ShareClassId),
})

export default function Add() {
  const { networks, isLoading, poolDetails, pool } = usePoolProvider()
  const { execute, isPending } = useCentrifugeTransaction()

  const form = useForm({
    schema,
    mode: 'onChange',
    onSubmit: (values) => {
      const { sc, asset } = values
      const selectedShareClass = poolDetails?.shareClasses.find(
        (shareClass: any) => shareClass.details.id.raw === sc.raw
      )

      // TODO: valuation contract should come from sdk
      execute(
        selectedShareClass?.shareClass.createHolding(asset, '0x6Bcb240d3e1f1C4321ECAFFDacB45691DC03bE5D', false, {
          equity: 123,
          gain: 123,
          loss: 123,
        })
      )
    },
  })

  const { asset, sc } = form.watch()

  if (isLoading) return <Loader />

  return (
    <Form form={form}>
      <Flex justifyContent="space-between" alignItems="center" mt={8} mb={8}>
        <Heading>Add holding</Heading>
        <Button
          label="Save changes"
          size="sm"
          onClick={() => form.handleSubmit()}
          disabled={!asset || !sc}
          loading={isPending}
        />
      </Flex>
      <Card>
        <AddHoldingForm networks={networks} poolDetails={poolDetails} hubChainId={pool?.hubChainId} />
      </Card>
    </Form>
  )
}
