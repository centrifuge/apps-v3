import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { IoMdInformationCircleOutline, IoMdTimer } from 'react-icons/io'
import { useFormContext } from '@centrifuge/forms'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { InvestAction, type InvestActionType } from '@components/InvestRedeemSection/components/defaults'
import { IoClose } from 'react-icons/io5'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'
import { useVaultsContext } from '@contexts/useVaultsContext'
import { StepIndicator } from '@components/StepIndicator'
import { useTxStateFeedback } from '@components/InvestRedeemSection/hooks/useTxStateFeedback'

interface InvestTxFeedbackProps {
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

export function InvestTxFeedback({ setActionType }: InvestTxFeedbackProps) {
  const { vaultDetails } = useVaultsContext()
  const { getValues, reset } = useFormContext()
  const { txState, resetTxState, isTxInProgress } = useTxStateFeedback({ type: 'invest' })

  const handleClose = () => {
    reset()
    resetTxState()
    setActionType(InvestAction.INVEST_AMOUNT)
  }

  useEffect(() => {
    resetTxState()
  }, [])

  return (
    <Box height="100%">
      <Flex
        alignItems="flex-start"
        flexDirection="column"
        gap={2}
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <Box width="100%" overflow="hidden">
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
              text={txState.isFailed ? infoText().investFailed : infoText().investClaimable}
            />
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6} width="100%">
              <Text fontWeight={500} fontSize="md">
                You invest
              </Text>
              <Flex alignItems="center" justifyContent="flex-end">
                <Text fontSize="md">{getValues('investAmount').toString()}</Text>
                <Text alignSelf="flex-end" ml={2}>
                  {vaultDetails?.investmentCurrency.symbol}
                </Text>
              </Flex>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" mt={2}>
              <Flex alignItems="center" justifyContent="flex-start">
                <Icon size="md" mr={2}>
                  <IoMdInformationCircleOutline />
                </Icon>
                <Text fontWeight={500} fontSize="md" display="inline">
                  Est. Token amount
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="flex-end">
                <Text fontSize="md">{getValues('receiveAmount').toString()}</Text>
                <Text alignSelf="flex-end" ml={2}>
                  {vaultDetails?.shareCurrency.symbol}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Box>
        <Button colorPalette="yellow" type="button" my={4} onClick={handleClose} width="100%" disabled={isTxInProgress}>
          Invest more
        </Button>
        <Flex w="full" alignItems="center" justifyContent="center">
          <StepIndicator
            action="Invest"
            isFailed={txState.isFailed}
            isStep1Successful={txState.isApproved}
            isStep2Successful={txState.isSuccessful}
          />
        </Flex>
      </Flex>
    </Box>
  )
}
