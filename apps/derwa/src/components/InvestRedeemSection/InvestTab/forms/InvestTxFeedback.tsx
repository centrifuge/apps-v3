import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { IoMdInformationCircleOutline, IoMdTimer } from 'react-icons/io'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { useFormContext } from '@centrifuge/forms'
import { useTransactions } from '@centrifuge/shared'
import { InvestAction, type InvestActionType } from '@components/InvestRedeemSection/components/defaults'
import { IoClose } from 'react-icons/io5'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'
import { useVaultsContext } from '@contexts/useVaultsContext'

interface TxState {
  header: string
  isSuccessful: boolean
  isFailed: boolean
}

interface InvestTxFeedbackProps {
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

export function InvestTxFeedback({ setActionType }: InvestTxFeedbackProps) {
  const { vaultDetails } = useVaultsContext()
  const { getValues, reset } = useFormContext()
  const { transactions } = useTransactions()
  const [txState, setTxState] = useState<TxState>({
    header: 'Transaction pending',
    isSuccessful: false,
    isFailed: false,
  })

  const handleClose = useCallback(() => {
    setActionType(InvestAction.INVEST_AMOUNT)
    reset()
  }, [setActionType, reset])

  useEffect(() => {
    transactions.forEach((tx) => {
      switch (tx.status) {
        case 'unconfirmed': {
          if (tx.dismissed) return
          setTxState({
            header: 'Signing transaction',
            isSuccessful: false,
            isFailed: false,
          })
          break
        }
        case 'failed': {
          if (tx.dismissed) return
          setTxState({
            header: 'Transaction failed',
            isSuccessful: false,
            isFailed: true,
          })
          break
        }
        case 'succeeded': {
          if (tx.dismissed) return
          if (tx.title === 'Invest') {
            const header = 'Investment in progress'
            setTxState({
              header,
              isSuccessful: true,
              isFailed: false,
            })
          }
          break
        }
        default: {
          setTxState((prev) => ({
            ...prev,
            header: 'Transaction pending',
          }))
        }
      }
    })

    return () => {
      setTxState({
        header: 'Transaction pending',
        isSuccessful: false,
        isFailed: false,
      })
    }
  }, [transactions])

  const isButtonDisabled = !txState.isSuccessful && !txState.isFailed

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
        <Button
          colorPalette="yellow"
          type="button"
          my={4}
          onClick={handleClose}
          width="100%"
          disabled={isButtonDisabled}
        >
          Invest more
        </Button>
      </Flex>
    </Box>
  )
}
