import { useEffect, useState, type ComponentType, type Dispatch } from 'react'
import { useChainId } from 'wagmi'
import { Flex, Heading, Stack, Text } from '@chakra-ui/react'
import type { PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import { useIsMember, usePoolNetworks, useVaults } from '@centrifuge/shared'
import { useGeolocation } from '@hooks/useGeolocation'
import { ConnectionGuard } from '@components/ConnectionGuard'
import { Tabs } from '@components/Tabs'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import InvestTab from '@components/InvestRedeemSection/InvestTab/InvestTab'
import RedeemTab from '@components/InvestRedeemSection/RedeemTab/RedeemTab'
import type { PoolDetails } from '@utils/types'

export interface TabProps {
  isInvestorWhiteListed: boolean
  isLoading: boolean
  networks?: PoolNetwork[]
  vault: Vault
  vaults: Vault[]
  setVault: Dispatch<Vault>
}
interface VaultGuardProps {
  connectedChainId: number
  isInvestorWhiteListed: boolean
  isLoading: boolean
  pool: PoolDetails
  shareClassId?: ShareClassId
  tab: ComponentType<TabProps>
  vault?: Vault
  setVault: Dispatch<Vault | undefined>
  setVaults: Dispatch<Vault[] | undefined>
  vaults?: Vault[]
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
  const connectedChainId = useChainId()
  const { data: location, isLoading: isGeoloationLoading } = useGeolocation()
  const [vault, setVault] = useState<Vault>()
  const [vaults, setVaults] = useState<Vault[]>()

  // Assuming one share class per pool
  const shareClassId = poolDetails?.shareClasses?.[0]?.details.id
  const { data: isMember, isLoading: isMemberLoading } = useIsMember(shareClassId, connectedChainId)
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
              <VaultGuard
                connectedChainId={connectedChainId}
                isInvestorWhiteListed={isInvestorWhiteListed}
                isLoading={isTabLoading}
                pool={poolDetails}
                shareClassId={shareClassId}
                tab={InvestTab}
                vault={vault}
                vaults={vaults}
                setVault={setVault}
                setVaults={setVaults}
              />
            ),
          },
          {
            label: 'Redeem',
            value: 'tab-redeem',
            disabled: !isInvestorWhiteListed,
            body: isRestrictedCountry ? (
              <RestrictedCountry />
            ) : (
              <VaultGuard
                connectedChainId={connectedChainId}
                isInvestorWhiteListed={isInvestorWhiteListed}
                isLoading={isTabLoading}
                pool={poolDetails}
                shareClassId={shareClassId}
                tab={RedeemTab}
                vault={vault}
                vaults={vaults}
                setVault={setVault}
                setVaults={setVaults}
              />
            ),
          },
        ]}
      />
    </Flex>
  )
}

function VaultGuard({
  connectedChainId,
  isInvestorWhiteListed,
  isLoading,
  pool: poolDetails,
  tab: Tab,
  shareClassId,
  vault,
  vaults,
  setVault,
  setVaults,
}: VaultGuardProps) {
  const { data: networks } = usePoolNetworks(poolDetails.id)
  const chainIds = networks?.map((network) => network.chainId) ?? []
  const network = networks?.find((n) => n.chainId === connectedChainId)
  const { data } = useVaults(network, shareClassId)

  useEffect(() => {
    if (data?.length && (!vault || !data.includes(vault))) {
      setVault(data[0])
    }

    setVaults(data)
  }, [data, vault, setVault, setVaults])

  return (
    <ConnectionGuard
      networks={chainIds}
      message="This pool is only available on specific networks. Please switch to one of the supported networks to continue."
    >
      {!vault ? (
        <Text>No vaults found for this pool on this network.</Text>
      ) : (
        <Stack height="100%">
          <Tab
            isInvestorWhiteListed={isInvestorWhiteListed}
            isLoading={isLoading}
            networks={networks}
            vault={vault}
            vaults={vaults ?? []}
            setVault={setVault}
          />
        </Stack>
      )}
    </ConnectionGuard>
  )
}
