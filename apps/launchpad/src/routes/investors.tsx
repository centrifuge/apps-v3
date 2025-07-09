import z from 'zod'
import { Form, useForm } from '@centrifuge/forms'
import {
  truncateAddress,
  useAllPoolDetails,
  useCentrifugeTransaction,
  usePool,
  usePoolsByManager,
} from '@centrifuge/shared'
import { Card, Button, Loader } from '@centrifuge/ui'
import { Box, Flex, Heading, Stack, VStack } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { WhitelistInvestor } from '@components/investors/WhitelistInvestor'
import { useMemo } from 'react'
import { isAddress } from 'viem'

const schema = z.object({
  shareClassId: z.string(),
  poolId: z.string(),
  network: z.string(),
  investorAddress: z.string().min(1, 'Investor address is required').refine(isAddress, {
    message: 'Please enter a valid EVM address',
  }),
})

export default function Investors() {
  const { address } = useAccount()
  const { data: pools, isLoading } = usePoolsByManager(address!)
  const execute = useCentrifugeTransaction()

  const poolIds = useMemo(() => {
    if (!pools) return []
    return pools.map((pool) => pool.id)
  }, [pools])

  const { data: poolDetails, isLoading: isPoolDetailsLoading } = useAllPoolDetails(poolIds)

  const form = useForm({
    schema,
    mode: 'onChange',
    onSubmit: (values) => {
      const { poolId, chainId } = values
      const selectedPool = pools?.find((pool) => pool.id.raw.toString() === poolId)
      console.log(selectedPool?.shareClasses)
    },
  })

  const { shareClassId, poolId, network } = form.watch()

  if (isLoading) return <Loader />

  if (!pools?.length)
    return (
      <VStack mt={10}>
        <Heading size="md">No pools found for address {truncateAddress(address!)}</Heading>
      </VStack>
    )

  return (
    <Form form={form}>
      <Box mt={10}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg">Investors</Heading>
          <Button
            label="Save changes"
            size="sm"
            onClick={() => form.handleSubmit()}
            disabled={!form.formState.isValid || !shareClassId || !poolId || !network}
          />
        </Flex>
        <Card mt={8}>
          <Stack gap={4}>
            <WhitelistInvestor poolIds={poolIds} />
          </Stack>
        </Card>
      </Box>
    </Form>
  )
}
