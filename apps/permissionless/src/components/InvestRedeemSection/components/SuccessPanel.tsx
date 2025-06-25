import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { useFormContext } from '@centrifuge/forms'
import { InvestAction, RedeemAction, type InvestActionType, type RedeemActionType } from './defaults'
import type { Dispatch, SetStateAction } from 'react'

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
  const isInvesting = props.isInvesting
  const buttonText = isInvesting ? 'Invest more' : 'Redeem more'

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
        <Box width="100%">
          <Flex alignItems="center" gap={2} justifyContent="space-between">
            <Heading>{isInvesting ? 'Investment' : 'Redemption'} successful</Heading>
            <Icon size="xl">
              <IoMdCheckmarkCircleOutline />
            </Icon>
          </Flex>
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
        >
          {buttonText}
        </Button>
      </Flex>
    </Box>
  )
}
