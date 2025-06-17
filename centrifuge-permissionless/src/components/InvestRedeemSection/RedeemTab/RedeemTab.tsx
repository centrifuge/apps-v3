import { Box, Button, Grid } from '@chakra-ui/react'
import { FormikProvider, useFormik } from 'formik'
import AmountPanel from '../AmountPanel'
import { infoText } from '../../../utils/infoText'
import { CancelRedeem } from './CancelRedeem'
import SuccessfulPanel from '../SuccessfulIPanel'
import { InfoWrapper } from '../InfoWrapper'

type Steps = 1 | 2 | 3

export type FormValues = {
  amount: number
  amountToReceive: number
  investorRequirements: string[]
  step: Steps
}

export default function RedeemTab() {
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
    if (step === 1) return 'Redeem'
    if (step === 2) return 'Cancel request'
    if (step === 3) return 'Invest more'
  }

  const { step } = form.values

  const isDisabled = form.values.amount === 0

  return (
    <FormikProvider value={form}>
      <Box mt={4}>
        {step === 1 && <AmountPanel />}
        {step === 2 && <CancelRedeem />}
        {step === 3 && <SuccessfulPanel />}

        <Grid
          templateColumns={step === 3 ? { base: '1fr', sm: '1fr', md: '1fr', lg: '1fr 1fr' } : '1fr'}
          mt={4}
          gap={2}
        >
          {step === 3 && (
            <Button
              background="backgroundButtonSecondary"
              color="textInverted"
              _hover={{
                boxShadow: 'xl',
              }}
              onClick={() => {
                form.setFieldValue('step', 1)
              }}
            >
              Redeem more
            </Button>
          )}
          <Button
            background={step === 2 ? 'backgroundDisabled' : 'backgroundButtonHighlight'}
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
          >
            {getButtonText()}
          </Button>
        </Grid>
        {step === 1 && form.values.amount === 0 && <InfoWrapper text={infoText.redeem} />}
      </Box>
    </FormikProvider>
  )
}
