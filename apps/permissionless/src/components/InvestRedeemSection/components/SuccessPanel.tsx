import { Box, Button, Flex, Heading, Icon, Text, useToken } from '@chakra-ui/react'
import { IoIosCloseCircleOutline, IoMdCheckmarkCircleOutline, IoMdTimer } from 'react-icons/io'
import { useFormContext } from '@centrifuge/forms'
import { InvestAction, RedeemAction, type InvestActionType, type RedeemActionType } from './defaults'
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { useTransactions } from '@components/Transactions/TransactionProvider'

interface InvestActionProps {
  currencies: { investCurrency: string; receiveCurrency: string }
  isInvesting: true
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

interface RedeemActionProps {
  currencies: { investCurrency: string; receiveCurrency: string }
  isInvesting?: false
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

type SuccessPanelProps = InvestActionProps | RedeemActionProps

// We must use props here instead of destructuring in the function parameters
// to ensure TypeScript can correctly infer the type based on the isInvesting property.
export function SuccessPanel(props: SuccessPanelProps) {
  const { getValues } = useFormContext()
  const { transactions } = useTransactions()
  const [txDescription, setTxDescription] = useState('Handling transaction')
  const [isTxSuccessful, setIsTxSuccessful] = useState(false)
  const [isTxFailed, setIsTxFailed] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [successColor, errorColor] = useToken('colors', ['success', 'error'])

  const activeTransactionIds = useRef<Record<string, string>>({})

  useEffect(() => {
    transactions.forEach((tx) => {
      if (['creating', 'unconfirmed', 'pending'].includes(tx.status) && !tx.dismissed) {
        if (!activeTransactionIds.current[tx.id]) {
          if (tx.status === 'creating') {
            setTxDescription('Creating transaction')
          } else if (tx.status === 'unconfirmed') {
            setTxDescription('Signing transaction')
          } else if (tx.status === 'pending') {
            setTxDescription('Transaction pending')
          } else {
            setTxDescription('Handling transaction')
          }
        }

        activeTransactionIds.current[tx.id] = tx.id
      } else if (['succeeded', 'failed'].includes(tx.status) && activeTransactionIds.current[tx.id]) {
        if (tx.status === 'failed' && !!tx.failedReason?.length) {
          setTxDescription(tx.failedReason)
          setIsTxFailed(true)
        } else if (tx.status === 'failed') {
          setTxDescription('Transaction failed')
          setIsTxFailed(true)
        } else if (tx.status === 'succeeded' && tx.title === 'Invest') {
          setTxDescription('Invest successful')
          setIsTxSuccessful(true)
          setTxHash(tx.result?.transactionHash ?? null)
        } else if (tx.status === 'succeeded' && tx.title === 'Redeem') {
          setTxDescription('Redeem successful')
          setIsTxSuccessful(true)
          setTxHash(tx.result?.transactionHash ?? null)
        } else {
          setTxDescription('Transaction status unknown')
        }

        delete activeTransactionIds.current[tx.id]
      } else if (tx.dismissed && activeTransactionIds.current[tx.id]) {
        delete activeTransactionIds.current[tx.id]
      }
    })

    const currentTxIds = new Set(transactions.map((t) => t.id))
    for (const txId in activeTransactionIds.current) {
      if (!currentTxIds.has(txId)) {
        delete activeTransactionIds.current[txId]
      }
    }
  }, [transactions])

  const isInvesting = props.isInvesting
  const buttonText = isInvesting ? 'Invest more' : 'Redeem more'
  const txHeaderColor = isTxSuccessful ? successColor : isTxFailed ? errorColor : 'inherit'
  const isButtonDisabled = !isTxSuccessful && !isTxFailed

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
            <Heading color={txHeaderColor}>{txDescription}</Heading>
            <Icon size="xl">
              {isTxSuccessful ? (
                <IoMdCheckmarkCircleOutline color={txHeaderColor} />
              ) : isTxFailed ? (
                <IoIosCloseCircleOutline color={txHeaderColor} />
              ) : (
                <IoMdTimer color="gray.400" />
              )}
            </Icon>
          </Flex>
          <Box opacity={isTxSuccessful ? 1 : 0.5}>
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6} width="100%">
              <Box>
                <Text fontWeight={500}>You {isInvesting ? 'invested' : 'redeemed'}</Text>
                <Heading fontSize="lg">{getValues('amount').toString()}</Heading>
              </Box>
              <Text alignSelf="flex-end">{props.currencies.investCurrency}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6}>
              <Box>
                <Text fontWeight={500}>{isInvesting ? 'Token amount' : 'You receive'}</Text>
                <Heading fontSize="lg">{getValues('amountToReceive').toString()}</Heading>
              </Box>
              <Text alignSelf="flex-end">{props.currencies.receiveCurrency}</Text>
            </Flex>
          </Box>
          {txHash && (
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6} opacity={isTxSuccessful ? 1 : 0.5}>
              <Box>
                <Text fontWeight={500}>Transaction hash</Text>
                <Text fontSize="xs" wordBreak="break-word">
                  {txHash}
                </Text>
              </Box>
              <Button asChild variant="subtle" size="xs">
                <a target="_blank" href={`https://etherscan.io/tx/${txHash}`}>
                  View on Etherscan
                </a>
              </Button>
            </Flex>
          )}
        </Box>
        <Button
          colorPalette="yellow"
          type="button"
          mb={4}
          onClick={() => {
            if (isInvesting) {
              props.setActionType(InvestAction.INVEST_AMOUNT)
            } else {
              props.setActionType(RedeemAction.REDEEM_AMOUNT)
            }
          }}
          width="100%"
          mt={4}
          disabled={isButtonDisabled}
        >
          {buttonText}
        </Button>
      </Flex>
    </Box>
  )
}
