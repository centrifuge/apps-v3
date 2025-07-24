import { OperationConfirmedStatus, Transaction, Vault } from '@centrifuge/sdk'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useCallback } from 'react'
import { IoMdCheckmarkCircleOutline, IoMdInformationCircleOutline } from 'react-icons/io'

interface InvestClaimFormProps {
  claimableAmount: string
  execute: UseMutateAsyncFunction<OperationConfirmedStatus, Error, Transaction, unknown>
  vault: Vault
}

export function InvestClaimForm({ claimableAmount, execute, vault }: InvestClaimFormProps) {
  const claim = useCallback(() => execute(vault.claim()), [vault, execute])

  return (
    <Box my={4} height="100%">
      <Flex flexDirection="column" justifyContent="space-between" height="100%">
        <Box>
          <Flex alignItems="center" gap={2} justifyContent="space-between">
            <Heading>You must claim your tokens</Heading>
            <Icon size="xl">
              <IoMdCheckmarkCircleOutline />
            </Icon>
          </Flex>
          <Box mt={6}>
            <Text fontWeight={500}>Claimable amount</Text>
            <Heading fontSize="2xl">{claimableAmount}</Heading>
          </Box>
        </Box>
        <Box>
          <Button w="100%" onClick={claim}>
            Claim
          </Button>
          <Flex alignItems="center" justifyContent="center" mt={2}>
            <Icon size="md" mr={2}>
              <IoMdInformationCircleOutline />
            </Icon>
            <Text>Invest more once claimed</Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
