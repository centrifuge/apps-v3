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

export default function NavPage() {
  const { shareClassId } = useParams()
  const { poolDetails, shareClass, vaultsDetails } = usePoolProvider()
  const { execute, isPending } = useCentrifugeTransaction()
  const shareClassDetails = useMemo(() => shareClass?.details, [shareClass])
  const vaultDetails = useMemo(
    () => vaultsDetails?.find((vault) => vault.shareClass.id.raw === shareClassId),
    [vaultsDetails, shareClassId]
  )
  const { data: networksNavs } = vaultDetails?.shareClass
    ? useNavPerNetwork(vaultDetails.shareClass)
    : { data: undefined }
  const poolCurrencySymbol = poolDetails?.currency.symbol ?? ''
  const poolCurrencyDecimals = poolDetails?.currency.decimals ?? 18

  function updateSharePrice(pricePerShare: Price) {
    if (!shareClass?.shareClass || !pricePerShare) return
    execute(shareClass.shareClass.updateSharePrice(pricePerShare))
  }

  const schema = z.object({
    currentNav: createBalanceSchema(poolCurrencyDecimals).optional(),
    currentTokenPrice: createBalanceSchema(poolCurrencyDecimals).optional(),
    newNav: createBalanceSchema(poolCurrencyDecimals).optional(),
    newTokenPrice: createBalanceSchema(poolCurrencyDecimals),
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
    <Form form={form}>
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
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
              {`This action will change the token price from ${formatBalance(parsedCurrentTokenPrice, poolCurrencySymbol, 2)} to ${formatBalance(parsedNewTokenPrice, poolCurrencySymbol, 2)}. Token prices will be propagated to all networks JTRSY is deployed to.`}
            </Text>
          </Box>
        </Card.Body>
      </Card.Root>
    </Form>
  )
}
