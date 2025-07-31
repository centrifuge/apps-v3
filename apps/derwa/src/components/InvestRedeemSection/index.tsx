import type { ComponentType } from 'react'
import { Box, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import type { Vault } from '@centrifuge/sdk'
import { useGeolocation } from '@hooks/useGeolocation'
import { ConnectionGuard } from '@components/ConnectionGuard'
import { Tabs } from '@components/Tabs'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import InvestTab from '@components/InvestRedeemSection/InvestTab/InvestTab'
import RedeemTab from '@components/InvestRedeemSection/RedeemTab/RedeemTab'
import type { PoolDetails } from '@utils/types'
import { InvestRedeemClaimForm } from '@components/InvestRedeemSection/components/InvestRedeemClaimForm'
import { useVaultsContext } from '@contexts/useVaultsContext'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { InvestorOnboardingFeedback } from '@components/InvestRedeemSection/components/InvestorOnboardingFeedback'

export interface TabProps {
  isLoading: boolean
  vault: Vault
}
interface VaultGuardProps {
  isInvestorWhiteListed: boolean
  isLoading: boolean
  tab: ComponentType<TabProps>
}

const RestrictedCountry = () => {
  return (
    <Flex direction="column" gap={2} mt={4} flex={1}>
      <Heading>Investor requirements</Heading>
      <InfoWrapper text="Unfortunately you are unable to invest at this time due to your location.  Geo restrictions apply to all US citizens and countries that are sanctioned." />
    </Flex>
  )
}

export function InvestRedeemSection({ pool: poolDetails }: { pool?: PoolDetails }) {
  const { isMember, isMemberLoading } = useVaultsContext()
  const { data: location, isLoading: isGeoloationLoading } = useGeolocation()
  const isInvestorWhiteListed = !!isMember
  const isTabLoading = isGeoloationLoading || isMemberLoading

  const kycCountries = poolDetails?.metadata?.onboarding?.kycRestrictedCountries ?? []
  const kybCountries = poolDetails?.metadata?.onboarding?.kybRestrictedCountries ?? []
  const restrictedCountries = [...kycCountries, ...kybCountries]
  const isRestrictedCountry = restrictedCountries.includes(location?.country_code)

  if (!poolDetails) return null

  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="border-primary"
      borderRadius="10px"
      shadow="xs"
      bg="white"
      h="100%"
      overflow="hidden"
    >
      <Tabs
        elements={[
          {
            label: 'Invest',
            value: 'tab-invest',
            body: isRestrictedCountry ? (
              <RestrictedCountry />
            ) : (
              <VaultGuard isInvestorWhiteListed={isInvestorWhiteListed} isLoading={isTabLoading} tab={InvestTab} />
            ),
          },
          {
            label: 'Redeem',
            value: 'tab-redeem',
            disabled: !isInvestorWhiteListed,
            body: isRestrictedCountry ? (
              <RestrictedCountry />
            ) : (
              <VaultGuard isInvestorWhiteListed={isInvestorWhiteListed} isLoading={isTabLoading} tab={RedeemTab} />
            ),
          },
        ]}
      />
    </Flex>
  )
}

function VaultGuard({ isInvestorWhiteListed, isLoading, tab: Tab }: VaultGuardProps) {
  const { networks, isNetworksLoading } = usePoolsContext()
  const { investment, isVaultsLoading, vault } = useVaultsContext()

  const chainIds = networks?.map((network) => network.chainId) ?? []
  const isVaultGuardLoading = isLoading || isNetworksLoading || isVaultsLoading

  const hasClaims =
    (investment?.claimableInvestShares.toBigInt() ?? 0n) > 0n ||
    (investment?.claimableRedeemCurrency.toBigInt() ?? 0n) > 0n

  if (isVaultGuardLoading) {
    return (
      <Box height="100%" minH="210px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="black.solid" />
      </Box>
    )
  }

  if (hasClaims && vault) {
    return (
      <InvestRedeemClaimForm
        claimableInvestShares={investment?.claimableInvestShares}
        claimableRedeemCurrency={investment?.claimableRedeemCurrency}
        claimableInvestCurrencyEquivalent={investment?.claimableInvestCurrencyEquivalent}
        claimableRedeemSharesEquivalent={investment?.claimableRedeemSharesEquivalent}
        investmentCurrency={investment?.investmentCurrency}
        shareCurrency={investment?.shareCurrency}
        vault={vault}
      />
    )
  }

  return (
    <ConnectionGuard
      networks={chainIds}
      message="This pool is only available on specific networks. Please switch to one of the supported networks to continue."
    >
      {!vault ? (
        <Text>No vaults found for this pool on this network.</Text>
      ) : !isInvestorWhiteListed ? (
        <InvestorOnboardingFeedback />
      ) : (
        <Stack height="100%">
          <Tab isLoading={isVaultGuardLoading} vault={vault} />
        </Stack>
      )}
    </ConnectionGuard>
  )
}
