import { Balance, CurrencyDetails, Vault } from '@centrifuge/sdk'
import { formatBalance, useCentrifugeTransaction } from '@centrifuge/shared'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { useCallback } from 'react'
import { IoMdCheckmarkCircleOutline, IoMdInformationCircleOutline } from 'react-icons/io'

interface InvestRedeemClaimFormProps {
  claimableInvestShares?: Balance
  claimableRedeemCurrency?: Balance
  claimableInvestCurrencyEquivalent?: Balance
  claimableRedeemSharesEquivalent?: Balance
  investmentCurrency?: CurrencyDetails
  shareCurrency?: CurrencyDetails
  vault: Vault
}

export function InvestRedeemClaimForm({
  claimableInvestShares,
  claimableRedeemCurrency,
  claimableInvestCurrencyEquivalent,
  claimableRedeemSharesEquivalent,
  investmentCurrency,
  shareCurrency,
  vault,
}: InvestRedeemClaimFormProps) {
  const { execute, isPending } = useCentrifugeTransaction()

  const claim = useCallback(() => execute(vault.claim()), [vault, execute])

  return (
    <Box my={4} height="100%">
      <Flex flexDirection="column" justifyContent="space-between" height="100%" pb={4}>
        <Box>
          <Flex alignItems="center" gap={2} justifyContent="space-between">
            <Heading>You must claim your tokens</Heading>
            <Icon size="xl">
              <IoMdCheckmarkCircleOutline />
            </Icon>
          </Flex>
          <Box mt={6}>
            <Text fontWeight={500}>Claimable shares</Text>
            <Flex alignItems="center" justifyContent="flex-start">
              <Heading fontSize="2xl">{formatBalance(claimableInvestShares ?? 0)}</Heading>
              <Heading fontSize="2xl" ml={2}>
                {shareCurrency?.symbol ?? ''}
              </Heading>
            </Flex>
          </Box>
          <Box mt={3}>
            <Text fontWeight={500}>Claimable invest currency equivalent</Text>
            <Flex alignItems="center" justifyContent="flex-start">
              <Heading fontSize="2xl">{formatBalance(claimableInvestCurrencyEquivalent ?? 0)}</Heading>
              <Heading fontSize="2xl" ml={2}>
                {investmentCurrency?.symbol ?? ''}
              </Heading>
            </Flex>
          </Box>
          <Box mt={3}>
            <Text fontWeight={500}>Claimable redeem currency</Text>
            <Flex alignItems="center" justifyContent="flex-start">
              <Heading fontSize="2xl">{formatBalance(claimableRedeemCurrency ?? 0)}</Heading>
              <Heading fontSize="2xl" ml={2}>
                {investmentCurrency?.symbol ?? ''}
              </Heading>
            </Flex>
          </Box>
          <Box mt={3}>
            <Text fontWeight={500}>Claimable redeem shares equivalent</Text>
            <Flex alignItems="center" justifyContent="flex-start">
              <Heading fontSize="2xl">{formatBalance(claimableRedeemSharesEquivalent ?? 0)}</Heading>
              <Heading fontSize="2xl" ml={2}>
                {shareCurrency?.symbol ?? ''}
              </Heading>
            </Flex>
          </Box>
        </Box>
        <Box>
          <Button w="100%" onClick={claim} disabled={isPending}>
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
