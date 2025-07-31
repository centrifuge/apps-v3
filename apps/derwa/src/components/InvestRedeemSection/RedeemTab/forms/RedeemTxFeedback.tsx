import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { Balance } from '@centrifuge/sdk'
import { BalanceDisplay } from '@centrifuge/ui'
import { RedeemAction, type RedeemActionType } from '@components/InvestRedeemSection/components/defaults'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'
import { useTransactions } from '@centrifuge/shared'
import { useFormContext } from '@centrifuge/forms'
import { IoClose } from 'react-icons/io5'
import { IoMdTimer } from 'react-icons/io'

interface TxState {
  header: string
  isSuccessful: boolean
  isFailed: boolean
}

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
  const { transactions } = useTransactions()
  const { reset } = useFormContext()
  const [txState, setTxState] = useState<TxState>({
    header: 'Transaction pending',
    isSuccessful: false,
    isFailed: false,
  })

  const handleClose = useCallback(() => {
    setActionType(RedeemAction.REDEEM_AMOUNT)
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
          if (tx.title === 'Redeem') {
            const header = 'Redemption in progress'
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

  const isButtonDisabled = (!txState.isSuccessful && !txState.isFailed) || isDisabled

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
      <Button colorPalette="yellow" type="button" width="100%" disabled={isButtonDisabled} my={4} onClick={handleClose}>
        Redeem more
      </Button>
    </Box>
  )
}
