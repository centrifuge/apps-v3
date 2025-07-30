import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'

export function InvestorOnboardingFeedback() {
  return (
    <Box height="100%">
      <Flex justify="space-between" flexDirection="column" height="100%">
        <Box>
          <Heading mt={4} mb={6}>
            Onboarding required
          </Heading>
          <InfoWrapper
            type="info"
            text={
              <>
                <Text>Onboarding is required to invest and redeem.</Text>
                <br />
                <p>
                  Email{' '}
                  <a href="mailto:onbaord@anemoy.com?subject=Onboarding" style={{ color: '#FFC012' }}>
                    onbaord@anemoy.com
                  </a>{' '}
                  to get started.
                </p>
              </>
            }
          />
        </Box>
        <Button disabled colorPalette="yellow" mt={6}>
          Invest
        </Button>
      </Flex>
    </Box>
  )
}
