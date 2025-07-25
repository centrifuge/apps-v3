import z from 'zod'
import { Form, useForm } from '@centrifuge/forms'
import {
  truncateAddress,
  useAddress,
  useAllPoolDetails,
  useCentrifugeTransaction,
  usePools,
  usePoolsByManager,
} from '@centrifuge/shared'
import { Card, Button, Loader, Modal } from '@centrifuge/ui'
import { Box, Flex, Grid, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { WhitelistInvestor } from '@components/investors/WhitelistInvestor'
import { useMemo, useState } from 'react'
import { isAddress } from 'viem'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'

const schema = z.object({
  shareClassId: z.string(),
  poolId: z.string(),
  network: z.string(),
  investorAddress: z.string().min(1, 'Investor address is required').refine(isAddress, {
    message: 'Please enter a valid EVM address',
  }),
})

/**
 * Update a member of the share class.
 * @param address Address of the investor
 * @param validUntil Time in seconds from Unix epoch until the investor is valid
 * @param chainId Chain ID of the network on which to update the member
 */
// updateMember(address: HexString, validUntil: number, chainId: number) {
//   return this.updateMembers([{ address, validUntil, chainId }])
// }

export default function Investors() {
  const { poolId } = useSelectedPool()
  const [isOpen, setIsOpen] = useState(false)
  const { address } = useAddress()
  const { data: pools } = usePools()
  const { execute, isPending } = useCentrifugeTransaction()

  const poolIds = useMemo(() => {
    if (!pools) return []
    return pools.map((pool) => pool.id)
  }, [pools])

  const { data: poolsDetails } = useAllPoolDetails(poolIds)

  const form = useForm({
    schema,
    mode: 'onChange',
    onSubmit: (values) => {
      const { poolId, shareClassId, investorAddress, network } = values
      const selectedShareClass = poolsDetails
        ?.find((pool) => pool.id.raw.toString() === poolId)
        ?.shareClasses.find((sc) => sc.details.id.raw.toString() === shareClassId)
      if (selectedShareClass) {
        execute(selectedShareClass.shareClass.updateMember(investorAddress, 4294967295, Number(network)))
      }
    },
  })

  return (
    <Form form={form}>
      <Grid templateColumns={['1fr', '1fr 1fr']} justifyContent="space-between" alignItems="center">
        <Heading size="md">Investors</Heading>
        <Flex gap={2} justifyContent="flex-end">
          <Button label="Onboarding settings" colorPalette="gray" />
          <Button label="Add new investor" colorPalette="black" onClick={() => setIsOpen(true)} />
        </Flex>
      </Grid>
      <VStack
        mt={4}
        backgroundColor="white"
        borderRadius="md"
        p={4}
        border="1px solid"
        borderColor="gray.200"
        h="400px"
        alignItems="center"
        justifyContent="center"
      >
        Investors table coming soon
      </VStack>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add new investor">
        <WhitelistInvestor poolId={poolId} />
      </Modal>
    </Form>
  )
}
