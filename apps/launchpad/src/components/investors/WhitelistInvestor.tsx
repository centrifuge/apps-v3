import { Form, Input, Select, useForm } from '@centrifuge/forms'
import { PoolNetwork } from '@centrifuge/sdk'
import { networkToName, useCentrifugeTransaction, usePoolNetworks } from '@centrifuge/shared'
import { Button, Modal, NetworkIcon } from '@centrifuge/ui'
import { Flex, Grid, Separator, Text } from '@chakra-ui/react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { useMemo, useState } from 'react'
import { isAddress } from 'viem'

import { z } from 'zod'

export const WhitelistInvestor = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, poolId } = useSelectedPool()
  const { data: networks } = usePoolNetworks(poolId, { enabled: !!poolId })

  const networkOptions = useMemo(() => {
    if (!networks) return []
    return networks.map((network: PoolNetwork) => ({
      value: network.chainId.toString(),
      label: networkToName(network.chainId),
      children: (
        <Flex gap={2} alignItems="center">
          <NetworkIcon networkId={network.chainId} />
          <Text>{networkToName(network.chainId)}</Text>
        </Flex>
      ),
    }))
  }, [networks])

  const form = useForm({
    schema: z.object({
      address: z.string().refine((val) => isAddress(val), {
        message: 'Invalid address',
      }),
      network: z.string().min(1),
    }),
    defaultValues: {
      address: '',
      network: '',
    },
    onSubmit: async (data) => {
      const { address, network } = data
      if (!shareClass) return
      await execute(shareClass.updateMember(address, 4294967295, Number(network)))
      setIsOpen(false)
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add investor">
      <Form form={form}>
        <Grid templateColumns="1fr" gap={4}>
          <Input name="address" label="Investor address" size="sm" />
          <Select name="network" items={networkOptions} label="Network" />
        </Grid>
        <Separator mt={4} />
        <Grid templateColumns="1fr 1fr" gap={4} mt={4}>
          <Button size="sm" variant="solid" colorPalette="gray" onClick={() => form.reset()} label="Cancel" />
          <Button
            size="sm"
            variant="solid"
            colorPalette="yellow"
            onClick={() => form.handleSubmit()}
            label="Add"
            loading={isPending}
          />
        </Grid>
      </Form>
    </Modal>
  )
}
