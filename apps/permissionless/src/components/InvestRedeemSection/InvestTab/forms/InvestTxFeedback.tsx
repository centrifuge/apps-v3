import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Box, Button, Flex, Heading, Icon, Text, useToken } from '@chakra-ui/react'
import { IoIosCloseCircleOutline, IoMdCheckmarkCircleOutline, IoMdTimer } from 'react-icons/io'
import { useFormContext } from '@centrifuge/forms'
import { useTransactions } from '@centrifuge/shared'
import { InvestAction, type InvestActionType } from '@components/InvestRedeemSection/components/defaults'

interface TxState {
  header: string
  isSuccessful: boolean
  isFailed: boolean
}

interface InvestTxFeedbackProps {
  currencies: { investCurrency: string; receiveCurrency: string }
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

export function InvestTxFeedback({ currencies, setActionType }: InvestTxFeedbackProps) {
  const { getValues, reset } = useFormContext()
  const { transactions } = useTransactions()
  const [successColor] = useToken('colors', ['success'])
  const [txState, setTxState] = useState<TxState>({
    header: 'Transaction pending',
    isSuccessful: false,
    isFailed: false,
  })

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
          if (tx.title === 'Invest' || tx.title === 'Redeem') {
            const header = tx.title === 'Invest' ? 'Invest successful' : 'Redeem successful'
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

  const txHeaderColor = txState.isSuccessful ? successColor : 'inherit'
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
            <Heading color={txHeaderColor}>{txState.header}</Heading>
            <Icon size="xl">
              {txState.isSuccessful ? (
                <IoMdCheckmarkCircleOutline />
              ) : txState.isFailed ? (
                <IoIosCloseCircleOutline />
              ) : (
                <IoMdTimer color="gray.400" />
              )}
            </Icon>
          </Flex>
          <Box opacity={txState.isSuccessful ? 1 : 0.5}>
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6} width="100%">
              <Box>
                <Text fontWeight={500}>You invested</Text>
                <Heading fontSize="lg">{getValues('investAmount').toString()}</Heading>
              </Box>
              <Text alignSelf="flex-end">{currencies.investCurrency}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6}>
              <Box>
                <Text fontWeight={500}>Token amount</Text>
                <Heading fontSize="lg">{getValues('amountToReceive').toString()}</Heading>
              </Box>
              <Text alignSelf="flex-end">{currencies.receiveCurrency}</Text>
            </Flex>
          </Box>
        </Box>
        <Button
          colorPalette="yellow"
          type="button"
          mb={4}
          onClick={() => {
            setActionType(InvestAction.INVEST_AMOUNT)
            reset()
          }}
          width="100%"
          mt={4}
          disabled={isButtonDisabled}
        >
          Invest more
        </Button>
      </Flex>
    </Box>
  )
}
