import { Box, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import type { FormValues } from './InvestTab/InvestTab'

export default function SuccessfulPanel({ isInvesting = false }: { isInvesting?: boolean }) {
  const form = useFormikContext<FormValues>()
  return (
    <Box>
      <Flex alignItems="center" gap={2} justifyContent="space-between">
        <Heading>{isInvesting ? 'Investment' : 'Redemption'} successful</Heading>
        <Icon size="xl">
          <IoMdCheckmarkCircleOutline />
        </Icon>
      </Flex>
      <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6}>
        <Box>
          <Text fontWeight={500}>You {isInvesting ? 'invested' : 'redeemed'}</Text>
          <Heading fontSize="2xl">{form.values.amount}</Heading>
        </Box>
        <Text alignSelf="flex-end">USDC</Text>
      </Flex>
      <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6}>
        <Box>
          <Text fontWeight={500}>{isInvesting ? 'Token amount' : 'You receive'}</Text>
          <Heading fontSize="2xl">{form.values.amountToReceive}</Heading>
        </Box>
        <Text alignSelf="flex-end">USDC</Text>
      </Flex>
    </Box>
  )
}
