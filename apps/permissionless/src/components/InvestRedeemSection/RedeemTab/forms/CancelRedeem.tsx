import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { FaRegClock } from 'react-icons/fa6'
import { infoText } from '../../../../utils/infoText'
import { InfoWrapper } from '../../components/InfoWrapper'
import { useFormContext } from '../../../../forms'
import type { Dispatch, SetStateAction } from 'react'
import { RedeemAction, type RedeemActionType } from '../../components/defaults'

interface CancelRedeemProps {
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function CancelRedeem({ setActionType }: CancelRedeemProps) {
  const { getValues } = useFormContext()

  return (
    <Box>
      <Heading>Rdemption in progress</Heading>
      <InfoWrapper text={infoText.cancelRedeem} title="Redemption in progress" icon={<FaRegClock />} />
      <Flex mt={4} justify="space-between">
        <Text fontWeight="bold" color="statusInfo">
          Redeeming
        </Text>
        <Text color="statusInfo">{getValues('amount')}</Text>
      </Flex>
      <Flex mt={4} justify="space-between">
        <Text fontWeight="bold" color="statusInfo">
          You receive
        </Text>
        <Text color="statusInfo">{getValues('amountToReceive')}</Text>
      </Flex>
      <Button
        type="button"
        background="backgroundDisabled"
        color="textPrimary"
        transition="box-shadow 0.2s ease"
        _hover={{
          boxShadow: 'xs',
        }}
        width="100%"
        mt={4}
        onClick={() => setActionType(RedeemAction.SUCCESS)}
      >
        Cancel request
      </Button>
    </Box>
  )
}
