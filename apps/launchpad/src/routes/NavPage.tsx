import { useMemo } from 'react'
import { Form, SubmitButton, useForm } from '@centrifuge/forms'
import { Box, Card, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import {
  formatUIBalance,
  useAddress,
  useCentrifugeTransaction,
  useIsPoolManager,
  useNavPerNetwork,
  useVaultsDetails,
} from '@centrifuge/shared'
import { NavForm } from '@components/nav/NavForm'
import { NavHoldings } from '@components/nav/NavHoldings'
import { Price } from '@centrifuge/sdk'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'

export default function NavPage() {
  const { address } = useAddress()
  const { execute, isPending } = useCentrifugeTransaction()
  const { poolDetails, shareClass, shareClassDetails, vaults, poolId } = useSelectedPool()
  const { data: vaultsDetails } = useVaultsDetails(vaults, { enabled: !!vaults })
  const isHubAdmin = useIsPoolManager(poolId, address ?? '')

  const shareClassId = shareClass?.id
  const poolCurrencySymbol = poolDetails?.currency.symbol ?? ''

  const vaultDetails = useMemo(
    () => vaultsDetails?.find((vault) => vault.shareClass.id.toString() === shareClassId?.toString()),
    [vaultsDetails, shareClassId]
  )

  const { data: networksNavs } = useNavPerNetwork(vaultDetails?.shareClass, { enabled: !!vaultDetails?.shareClass })

  // TODO: add schema for price which is different from Balance
  const form = useForm({
    defaultValues: {
      newTokenPrice: '',
    },
    mode: 'onChange',
    onSubmit: (values) => {
      if (!shareClass || !values.newTokenPrice) return
      const tokenPrice = Price.fromFloat(values.newTokenPrice)
      execute(shareClass.updateSharePrice(tokenPrice))
    },
    onSubmitError: (error) => console.error('Nav form submission error:', error),
  })

  const { watch } = form
  const [newTokenPrice] = watch(['newTokenPrice'])
  const tokenPrice = newTokenPrice ? Price.fromFloat(newTokenPrice) : 0

  return (
    <Form form={form}>
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Heading size="lg">Update NAV</Heading>
        <SubmitButton colorPalette="yellow" size="sm" disabled={isPending || !newTokenPrice || !isHubAdmin}>
          Save changes
        </SubmitButton>
      </Flex>
      <Card.Root>
        <Card.Body>
          <NavForm shareClassDetails={shareClassDetails} />
          <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(1, 1fr)" columnGap={6}>
            <GridItem colSpan={1} rowSpan={1}>
              <NavHoldings networksNavs={networksNavs} />
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <NavHoldings networksNavs={networksNavs} withNewNav />
            </GridItem>
          </Grid>
          <Box border="1px solid" borderColor="gray.200" backgroundColor="gray.200" borderRadius="sm" p={2} mt={6}>
            <Text fontSize="xs" textAlign="center">
              {`This action will change the token price from ${formatUIBalance(shareClassDetails?.pricePerShare ?? 0, {
                currency: poolCurrencySymbol,
                precision: 6,
                tokenDecimals: 18,
              })} to ${formatUIBalance(tokenPrice, {
                currency: poolCurrencySymbol,
                precision: 6,
                tokenDecimals: 18,
              })}. Token prices will be propagated to all networks JTRSY is deployed to.`}
            </Text>
          </Box>
        </Card.Body>
      </Card.Root>
    </Form>
  )
}
