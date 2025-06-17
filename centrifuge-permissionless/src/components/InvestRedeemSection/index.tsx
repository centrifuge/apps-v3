import { Box, Flex, Heading } from '@chakra-ui/react'
import { Tabs } from '../Tabs'
import InvestTab from './InvestTab/InvestTab'
import RedeemTab from './RedeemTab/RedeemTab'
import { useGeolocation } from '../../hooks/useGeolocation'
import { InfoWrapper } from './InfoWrapper'
import type { PoolDetails } from '../../utils/types'

const RestrictedCountry = () => {
  return (
    <Flex direction="column" gap={2} mt={4} flex={1}>
      <Heading>Investor requirements</Heading>
      <InfoWrapper text="Unfortunately you are unable to invest at this time due to your location.  Geo restrictions apply to all US citizens and countries that are sanctioned." />
    </Flex>
  )
}

export function InvestRedeemSection({ pool }: { pool: PoolDetails }) {
  const { data: location } = useGeolocation()

  const kycCountries = pool?.metadata?.onboarding?.kycRestrictedCountries ?? []
  const kybCountries = pool?.metadata?.onboarding?.kybRestrictedCountries ?? []
  const restrictedCountries = [...kycCountries, ...kybCountries]
  const isRestrictedCountry = restrictedCountries.includes(location?.country_code)

  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="borderPrimary"
      borderRadius="10px"
      shadow="xs"
      bg="white"
      h="100%"
      pt={4}
    >
      <Box>
        <Tabs
          elements={[
            {
              label: 'Invest',
              value: 'tab-invest',
              body: isRestrictedCountry ? <RestrictedCountry /> : <InvestTab />,
            },
            {
              label: 'Redeem',
              value: 'tab-redeem',
              body: isRestrictedCountry ? <RestrictedCountry /> : <RedeemTab />,
            },
          ]}
        />
      </Box>
    </Flex>
  )
}
