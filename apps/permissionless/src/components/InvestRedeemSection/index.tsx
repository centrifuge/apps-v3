import { useEffect, useState, type ComponentType, type Dispatch } from 'react'
import { useChainId } from 'wagmi'
import { Flex, Heading, Stack, Text } from '@chakra-ui/react'
import type { Vault } from '@centrifuge/sdk'
import { usePoolNetworks, useVaults, useVaultsDetails } from '@centrifuge/shared'
import { useGeolocation } from '@hooks/useGeolocation'
import { ConnectionGuard } from '@components/ConnectionGuard'
import { Tabs } from '@components/Tabs'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import InvestTab from '@components/InvestRedeemSection/InvestTab/InvestTab'
import RedeemTab from '@components/InvestRedeemSection/RedeemTab/RedeemTab'
import type { PoolDetails, VaultDetails } from '@utils/types'

const RestrictedCountry = () => {
  return (
    <Flex direction="column" gap={2} mt={4} flex={1}>
      <Heading>Investor requirements</Heading>
      <InfoWrapper text="Unfortunately you are unable to invest at this time due to your location.  Geo restrictions apply to all US citizens and countries that are sanctioned." />
    </Flex>
  )
}

export function InvestRedeemSection({ pool: poolDetails }: { pool: PoolDetails }) {
  const { data: location } = useGeolocation()
  const [vault, setVault] = useState<Vault>()
  const [vaults, setVaults] = useState<Vault[]>()

  const kycCountries = poolDetails?.metadata?.onboarding?.kycRestrictedCountries ?? []
  const kybCountries = poolDetails?.metadata?.onboarding?.kybRestrictedCountries ?? []
  const restrictedCountries = [...kycCountries, ...kybCountries]
  const isRestrictedCountry = restrictedCountries.includes(location?.country_code)

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
                pool={poolDetails}
                tab={InvestTab}
                vault={vault}
                setVault={setVault}
                vaults={vaults}
                setVaults={setVaults}
              />
            ),
          },
          {
            label: 'Redeem',
            value: 'tab-redeem',
            body: isRestrictedCountry ? (
              <RestrictedCountry />
            ) : (
              <VaultGuard
                pool={poolDetails}
                tab={RedeemTab}
                vault={vault}
                setVault={setVault}
                vaults={vaults}
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
  pool: poolDetails,
  tab: Tab,
  vault,
  setVault,
  setVaults,
  vaults,
}: {
  pool: PoolDetails
  tab: ComponentType<{ vault: Vault; setVault: Dispatch<Vault>; vaults: Vault[] }>
  vault?: Vault
  setVault: Dispatch<Vault | undefined>
  setVaults: Dispatch<Vault[] | undefined>
  vaults?: Vault[]
}) {
  const connectedChainId = useChainId()
  // Assuming one share class per pool
  const scId = poolDetails?.shareClasses?.[0]?.details.id
  const { data: networks } = usePoolNetworks(poolDetails.id)
  const chainIds = networks?.map((network) => network.chainId) ?? []
  const network = networks?.find((n) => n.chainId === connectedChainId)
  const { data } = useVaults(network, scId)

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
          <Tab vault={vault} setVault={setVault} vaults={vaults ?? []} />
        </Stack>
      )}
    </ConnectionGuard>
  )
}
