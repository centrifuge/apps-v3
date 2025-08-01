import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { CiShare1 } from 'react-icons/ci'

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
                <Text fontSize="sm">Onboarding is required to invest and redeem.</Text>
                <Text fontSize="sm">
                  Email{' '}
                  <a href="mailto:onbaord@anemoy.com?subject=Onboarding" style={{ color: '#FFC012' }}>
                    onbaord@anemoy.com
                  </a>{' '}
                  to get started.
                </Text>
              </>
            }
          />
        </Box>
        <Button disabled colorPalette="yellow" mt={8}>
          Invest
        </Button>
        <Box mt={6} mb={8}>
          <a href="" target="_blank" rel="noopener noreferrer">
            <Flex alignItems="center" justifyContent="center">
              <Text fontSize="sm" mr={8} fontWeight={500}>
                Secondary Market
              </Text>
              <CiShare1 />
            </Flex>
          </a>
        </Box>
      </Flex>
    </Box>
  )
}
