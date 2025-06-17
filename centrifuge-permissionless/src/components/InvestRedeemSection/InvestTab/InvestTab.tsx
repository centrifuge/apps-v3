import { Box, Button } from '@chakra-ui/react'
import { FormikProvider, useFormik } from 'formik'
import { infoText } from '../../../utils/infoText'
import InvestorRequirementsPanel from './InvestorRequirementsPanel'
import AmountPanel from '../AmountPanel'
import SuccessfulPanel from '../SuccessfulIPanel'
import { InfoWrapper } from '../InfoWrapper'

type Steps = 1 | 2 | 3

export type FormValues = {
  amount: number
  amountToReceive: number
  investorRequirements: string[]
  step: Steps
}

export default function InvestTab() {
  const form = useFormik<FormValues>({
    initialValues: {
      amount: 0,
      amountToReceive: 0,
      investorRequirements: [],
      step: 1,
    },
    onSubmit: (values) => {
      console.log(values)
    },
  })

  const getButtonText = () => {
    const step = form.values.step
    if (step === 1) return 'Invest'
    if (step === 2) return 'Confirm'
    if (step === 3) return 'Invest more'
  }

  const { step } = form.values

  // const isDisabled =
  //   form.values.amount === 0 ||
  //   form.values.investorRequirements.length !== 3;

  const isDisabled = false

  return (
    <FormikProvider value={form}>
      <Box mt={4}>
        {step === 1 && <AmountPanel isInvesting />}
        {step === 2 && <InvestorRequirementsPanel />}
        {step === 3 && <SuccessfulPanel isInvesting />}

        <Button
          background="backgroundButtonHighlight"
          color="textPrimary"
          transition="box-shadow 0.2s ease"
          _hover={{
            boxShadow: 'xs',
          }}
          onClick={() => {
            const { step } = form.values
            if (step !== 3) {
              form.setFieldValue('step', (form.values.step + 1) as Steps)
            }
            if (step === 3) {
              form.setFieldValue('step', 1)
            }
          }}
          disabled={isDisabled}
          width="100%"
          mt={4}
        >
          {getButtonText()}
        </Button>

        {step === 1 && form.values.amount === 0 && <InfoWrapper text={infoText.redeem} />}
      </Box>
    </FormikProvider>
  )
}
