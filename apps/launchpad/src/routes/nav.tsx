import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import z from 'zod'
import { createBalanceSchema, Form, safeParse, SubmitButton, useForm } from '@centrifuge/forms'
import { Box, Card, Container, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import { formatBalance, formatBalanceToString, useCentrifugeTransaction, useNavPerNetwork } from '@centrifuge/shared'
import { NavForm } from '@components/nav/NavForm'
import { NavHoldings } from '@components/nav/NavHoldings'
import { usePoolProvider } from '@contexts/PoolProvider'
import { Price } from '@centrifuge/sdk'

export const handle = {
  hasSettings: false,
  hasTabs: false,
}

export default function Nav() {
  const { shareClassId } = useParams()
  const { poolDetails, shareClass, vaultsDetails } = usePoolProvider()
  const { execute, isPending } = useCentrifugeTransaction()
  const shareClassDetails = useMemo(() => shareClass?.details, [shareClass])
  const vaultDetails = useMemo(
    () => vaultsDetails?.find((vault) => vault.shareClass.id.raw === shareClassId),
    [vaultsDetails, shareClassId]
  )
  const { data: networksNavs } = useNavPerNetwork(vaultDetails?.shareClass)
  const currencySymbol = poolDetails?.currency.symbol ?? ''
  const tokenDecimals = shareClassDetails?.pricePerShare.decimals
  const navDecimals = shareClassDetails?.nav.decimals

  function updateSharePrice(pricePerShare: Price) {
    if (!shareClass?.shareClass || !pricePerShare) return
    execute(shareClass.shareClass.updateSharePrice(pricePerShare))
  }

  const schema = z.object({
    currentNav: createBalanceSchema(navDecimals ?? 18).optional(),
    currentTokenPrice: createBalanceSchema(tokenDecimals ?? 18).optional(),
    newNav: createBalanceSchema(navDecimals ?? 18).optional(),
    newTokenPrice: createBalanceSchema(tokenDecimals ?? 18),
  })

  const form = useForm({
    schema,
    defaultValues: {
      currentNav: '',
      currentTokenPrice: '',
      newNav: '',
      newTokenPrice: '',
    },
    mode: 'onChange',
    onSubmit: (values) => {
      updateSharePrice(values.newTokenPrice)
    },
    onSubmitError: (error) => console.error('Nav form submission error:', error),
  })

  const { watch, setValue } = form
  const [currentTokenPrice, newTokenPrice] = watch(['currentTokenPrice', 'newTokenPrice'])

  const parsedCurrentTokenPrice = useMemo(
    () => safeParse(schema.shape.currentTokenPrice, currentTokenPrice) ?? 0,
    [currentTokenPrice]
  )
  const parsedNewTokenPrice = useMemo(() => safeParse(schema.shape.newTokenPrice, newTokenPrice) ?? 0, [newTokenPrice])

  useEffect(() => {
    if (!shareClassDetails) return
    setValue('currentNav', formatBalanceToString(shareClassDetails.nav))
    setValue('currentTokenPrice', formatBalanceToString(shareClassDetails.pricePerShare))
  }, [shareClassDetails])

  return (
    <Container maxWidth="6xl">
      <Form form={form} style={{ height: '100%' }}>
        <Flex alignItems="center" justifyContent="space-between" my={8}>
          <Heading size="lg">Update NAV</Heading>
          <SubmitButton colorPalette="yellow" size="sm" disabled={isPending}>
            Save Changes
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
                <NavHoldings networksNavs={networksNavs} />
              </GridItem>
            </Grid>
            <Box border="1px solid" borderColor="gray.200" backgroundColor="gray.200" borderRadius="sm" p={2} mt={6}>
              <Text fontSize="xs" textAlign="center">
                {`This action will change the token price from ${formatBalance(parsedCurrentTokenPrice, currencySymbol, 2)} to ${formatBalance(parsedNewTokenPrice, currencySymbol, 2)}. Token prices will be propagated to all networks JTRSY is deployed to.`}
              </Text>
            </Box>
          </Card.Body>
        </Card.Root>
      </Form>
    </Container>
  )
}
