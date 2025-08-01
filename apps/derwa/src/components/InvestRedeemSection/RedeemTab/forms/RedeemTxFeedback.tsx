import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { Balance } from '@centrifuge/sdk'
import { BalanceDisplay } from '@centrifuge/ui'
import { RedeemAction, type RedeemActionType } from '@components/InvestRedeemSection/components/defaults'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'
import { useFormContext } from '@centrifuge/forms'
import { IoClose } from 'react-icons/io5'
import { IoMdTimer } from 'react-icons/io'
import { useTxStateFeedback } from '@components/InvestRedeemSection/hooks/useTxStateFeedback'
import { StepIndicator } from '@components/StepIndicator'

interface CancelRedeemProps {
  currencies: { redeemCurrency: string; receiveCurrency: string }
  isDisabled: boolean
  parsedRedeemAmount: 0 | Balance
  parsedReceiveAmount: 0 | Balance
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemTxFeedback({
  currencies: { redeemCurrency, receiveCurrency },
  isDisabled,
  parsedRedeemAmount,
  parsedReceiveAmount,
  setActionType,
}: CancelRedeemProps) {
  const { txState, resetTxState, isTxInProgress } = useTxStateFeedback({ type: 'redeem' })
  const { reset } = useFormContext()

  const handleClose = () => {
    setActionType(RedeemAction.REDEEM_AMOUNT)
    resetTxState()
    reset()
  }

  useEffect(() => {
    resetTxState()
  }, [])

  return (
    <Box>
      <Flex alignItems="center" gap={2} justifyContent="space-between">
        <Heading>{txState.header}</Heading>
        <Icon size="lg">
          {txState.isSuccessful || txState.isFailed ? (
            <IoClose onClick={handleClose} cursor="pointer" />
          ) : (
            <IoMdTimer color="gray.400" />
          )}
        </Icon>
      </Flex>
      <Box opacity={txState.isSuccessful || txState.isFailed ? 1 : 0.5}>
        <InfoWrapper
          type={txState.isFailed ? 'error' : 'info'}
          text={txState.isFailed ? infoText().redeemFailed : infoText().asyncRedeem}
        />
        <Flex mt={4} justify="space-between">
          <Text fontWeight={500} fontSize="md">
            Redeeming
          </Text>
          <Text fontSize="md" whiteSpace="normal" wordWrap="break-word" textAlign="right">
            <BalanceDisplay balance={parsedRedeemAmount} currency={redeemCurrency} />
          </Text>
        </Flex>
        <Flex mt={4} justify="space-between">
          <Text fontWeight={500} fontSize="md">
            You receive
          </Text>
          <Text fontSize="md" whiteSpace="normal" wordWrap="break-word" textAlign="right">
            <BalanceDisplay balance={parsedReceiveAmount} currency={receiveCurrency} />
          </Text>
        </Flex>
      </Box>
      <Button
        colorPalette="yellow"
        type="button"
        width="100%"
        disabled={isTxInProgress || isDisabled}
        my={4}
        onClick={handleClose}
      >
        Redeem more
      </Button>
      <Flex w="full" alignItems="center" justifyContent="center">
        <StepIndicator
          action="Redeem"
          isFailed={txState.isFailed}
          isStep1Successful={txState.isApproved}
          isStep2Successful={txState.isSuccessful}
        />
      </Flex>
    </Box>
  )
}
