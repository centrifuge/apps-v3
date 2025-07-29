import { Flex, Heading, Loader, Stack } from '@chakra-ui/react'
import { LinkButton } from '@centrifuge/ui'
import { AccountPage } from '@components/account/AccountPage'
import { useMemo } from 'react'
import { formatUIBalance } from '@centrifuge/shared'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'

export default function Account() {
  const { shareClassDetails, isLoading, poolDetails, poolId } = useSelectedPool()
  const shareClassId = shareClassDetails?.id.raw ?? ''

  const totalNav = useMemo(() => {
    return shareClassDetails?.totalIssuance.mul(shareClassDetails?.pricePerShare)
  }, [shareClassDetails])

  if (isLoading) {
    return <Loader />
  }

  if (!shareClassDetails || !poolDetails) return

  return (
    <>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Stack gap={0}>
          <Heading size="sm">Total NAV</Heading>
          <Heading size="4xl">
            {formatUIBalance(totalNav, {
              precision: 2,
              currency: poolDetails?.currency.symbol,
              tokenDecimals: poolDetails?.currency.decimals,
            })}
          </Heading>
        </Stack>

        <LinkButton
          to={`/pool/${poolId?.toString()}/${shareClassId}/nav`}
          size="sm"
          width="150px"
          colorPalette="yellow"
        >
          Update NAV
        </LinkButton>
      </Flex>
      <AccountPage />
    </>
  )
}
