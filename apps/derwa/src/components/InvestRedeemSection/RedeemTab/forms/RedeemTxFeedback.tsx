import type { Dispatch, SetStateAction } from 'react'
import { FaRegClock } from 'react-icons/fa6'
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { Balance } from '@centrifuge/sdk'
import { BalanceDisplay } from '@centrifuge/ui'
import { RedeemAction, type RedeemActionType } from '@components/InvestRedeemSection/components/defaults'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'

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
  return (
    <Box>
      <Heading>Rdemption in progress</Heading>
      <InfoWrapper text={infoText().cancelRedeem} title="Redemption in progress" icon={<FaRegClock />} />
      <Flex mt={4} justify="space-between">
        <Text fontWeight="bold" color="info" fontSize="md">
          Redeeming
        </Text>
        <Text color="info" whiteSpace="normal" wordWrap="break-word" textAlign="right">
          <BalanceDisplay balance={parsedRedeemAmount} currency={redeemCurrency} />
        </Text>
      </Flex>
      <Flex mt={4} justify="space-between">
        <Text fontWeight="bold" color="info">
          You receive
        </Text>
        <Text color="info" whiteSpace="normal" wordWrap="break-word" textAlign="right">
          <BalanceDisplay balance={parsedReceiveAmount} currency={receiveCurrency} />
        </Text>
      </Flex>
      <Button
        type="button"
        background="bg-disabled"
        color="text-primary"
        width="100%"
        disabled={isDisabled}
        mt={4}
        onClick={() => setActionType(RedeemAction.SUCCESS)}
      >
        Redeem more
      </Button>
    </Box>
  )
}
