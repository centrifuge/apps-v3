import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { usePoolDetails } from '@centrifuge/shared'
import { LandingPageSkeleton } from '@components/Skeletons/LandingPageSkeleton'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { routePaths } from '@routes/routePaths'
import { Button, LogoCentrifugeText, NetworkIcon } from '@centrifuge/ui'
import { DataTable, ColumnDefinition } from '@centrifuge/ui'
import { RatingPill } from '@components/RatingPill'
import { InvestRedeemSection } from '@components/InvestRedeemSection'

type Row = {
  id: string
  cusip: string
  isin: string
  marketValue: string
  tradeQuantity: string
  maturityDate: string
  portfolioPercentage: string
}

export default function PoolPage() {
  const { selectedPoolId, isLoading: isPoolsLoading } = usePoolsContext()
  const { data: pool, isLoading: isPoolDetailsLoading } = usePoolDetails(selectedPoolId as PoolId)

  if (isPoolsLoading || isPoolDetailsLoading) {
    return <LandingPageSkeleton />
  }

  const holdings = [
    {
      id: '912797PE1',
      cusip: '912797PE1',
      isin: 'US912797PE18',
      marketValue: '13,918,329.60 USD',
      tradeQuantity: '13,920,000.00',
      maturityDate: 'Oct 15, 2025',
      portfolioPercentage: '2.1%',
    },
    {
      id: '912797PE2',
      cusip: '912797PE2',
      isin: 'US912797PE19',
      marketValue: '13,918,329.60 USD',
      tradeQuantity: '13,920,000.00',
      maturityDate: 'Oct 15, 2025',
      portfolioPercentage: '2.1%',
    },
  ]

  const columns: ColumnDefinition<Row>[] = [
    {
      header: 'CUSIP',
      accessor: 'cusip',
    },
    {
      header: 'ISIN',
      accessor: 'isin',
    },
    {
      header: 'Market Value (Position...)',
      accessor: 'marketValue',
    },
    {
      header: 'Trade Date Quantity',
      accessor: 'tradeQuantity',
    },
    {
      header: 'Maturity Date',
      accessor: 'maturityDate',
    },
    {
      header: 'Portfolio %',
      accessor: 'portfolioPercentage',
    },
  ]

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Link to={routePaths.home}>
          <Flex alignItems="center">
            <IoArrowBack />
            <Heading size="2xl" ml={8}>
              {pool?.metadata?.pool.name}
            </Heading>
          </Flex>
        </Link>
        <Box mt={4}>
          <Text fontSize="12px" color="black" width="auto" textAlign="right">
            Your current holdings in {pool?.metadata?.pool.name}
          </Text>
          <Flex align={'flex-end'} justifyContent="flex-end">
            <Text fontSize="24px" fontWeight="bold" textAlign="right">
              145,984.87&nbsp;
            </Text>
            <Text fontSize="24px" textAlign="right">
              USD
            </Text>
          </Flex>
        </Box>
      </Flex>
      <Box marginTop={8}>
        <Grid templateColumns={{ base: '1fr', sm: '1fr', md: '1fr', lg: '6fr 4fr' }} gap={10}>
          <Box minW={0}>
            <Box
              bg="bg-primary"
              padding={6}
              borderRadius={10}
              border="1px solid"
              borderColor="border-primary"
              shadow="xs"
            >
              <Flex
                justifyContent={{ base: 'center', md: 'space-around' }}
                alignItems="center"
                flexDirection={{ base: 'column', md: 'row' }}
              >
                <Box padding={{ base: '1rem 0 0 0', md: '0' }}>
                  <Text fontSize="12px" color="black" width="auto" textAlign={{ base: 'center', md: 'left' }}>
                    TVL (USD)
                  </Text>
                  <Text fontSize="24px" fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
                    448,663,319
                  </Text>
                </Box>
                <Box
                  padding={{ base: '1rem 0 0 0', md: '0 0 0 1.5rem' }}
                  borderLeft={{ base: 'none', md: '1px solid' }}
                  borderColor={'#E7E7E7'}
                >
                  <Text fontSize="12px" color="black" width="auto" textAlign={{ base: 'center', md: 'left' }}>
                    Token price (USD)
                  </Text>
                  <Text fontSize="24px" fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
                    12,194.91
                  </Text>
                </Box>
                <Box
                  padding={{ base: '1rem 0 0 0', md: '0 0 0 1.5rem' }}
                  borderLeft={{ base: 'none', md: '1px solid' }}
                  borderColor={'#E7E7E7'}
                >
                  <Text fontSize="12px" color="black" width="auto" textAlign={{ base: 'center', md: 'left' }}>
                    APY
                  </Text>
                  <Text fontSize="24px" fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
                    2.54%
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Heading size="lg" mt={8} mb={4}>
              Overview
            </Heading>

            <Box
              bg="bg-primary"
              width="100%"
              padding={{ base: 6, md: 8, xl: 12 }}
              borderRadius={10}
              border="1px solid"
              borderColor="border-primary"
              shadow="xs"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  Asset type
                </Text>
                <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                  Digital assets
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  90-Day APY
                </Text>
                <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                  5.5%
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  Average asset maturity
                </Text>
                <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                  45 Days
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  Min. investment
                </Text>
                <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                  $20k - $500k
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  Investor type
                </Text>
                <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                  Non-US Professional
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  Available networks
                </Text>
                <Flex>
                  <NetworkIcon networkId={1} />
                  <NetworkIcon networkId={42161} />
                  <NetworkIcon networkId={42220} />
                  <NetworkIcon networkId={8453} />
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  Pool structure
                </Text>
                <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                  Revolving
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  Rating
                </Text>
                <Flex>
                  <RatingPill rating={{ agency: 'moody', value: 'Aa' }} />
                  <RatingPill rating={{ agency: 'sp', value: 'AA' }} />
                  <RatingPill rating={{ agency: 'particula', value: 'BB' }} />
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  Expense ratio
                </Text>
                <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                  1%
                </Text>
              </Flex>
            </Box>

            <Heading size="lg" mt={8} mb={4}>
              Key facts
            </Heading>

            <Box
              bg="bg-primary"
              width="100%"
              padding={6}
              borderRadius={10}
              border="1px solid"
              borderColor="border-primary"
              shadow="xs"
            >
              <Grid templateColumns={{ base: '1fr', md: '1fr 5fr' }} gap={2}>
                <Flex
                  justifyContent="flex-start"
                  alignItems="center"
                  gap={2}
                  flexDirection={{ base: 'column', md: 'row' }}
                >
                  <Box width={20} mb={{ base: 2, md: 0 }}>
                    <LogoCentrifugeText fill="text-primary" />
                  </Box>
                </Flex>

                <Flex
                  justifyContent="flex-end"
                  alignItems="center"
                  gap={2}
                  flexDirection={{ base: 'column', md: 'row' }}
                  wrap="wrap"
                >
                  <Button
                    label="Website"
                    color="#91969B"
                    border="1px solid #91969B"
                    background="transparent"
                    borderRadius="300px"
                    height="32px"
                    fontSize="14px"
                  />
                  <Button
                    label="Forum"
                    color="#91969B"
                    border="1px solid #91969B"
                    background="transparent"
                    borderRadius="300px"
                    height="32px"
                    fontSize="14px"
                  />
                  <Button
                    label="Email"
                    color="#91969B"
                    border="1px solid #91969B"
                    background="transparent"
                    borderRadius="300px"
                    height="32px"
                    fontSize="14px"
                  />
                  <Button
                    label="Executive summary"
                    color="#91969B"
                    border="1px solid #91969B"
                    background="transparent"
                    borderRadius="300px"
                    height="32px"
                    fontSize="14px"
                  />
                </Flex>
              </Grid>

              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={2} mt={8}>
                <Flex
                  flexDirection="column"
                  alignItems={{ base: 'center', md: 'flex-start' }}
                  justifyContent={{ base: 'center', md: 'flex-start' }}
                  gap={{ base: 0, md: 4 }}
                >
                  <Heading
                    fontWeight="600"
                    lineHeight={'125%'}
                    size="xl"
                    position="relative"
                    _after={{
                      content: '" "',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '54px',
                      height: '2px',
                      bg: '#FFC012',
                    }}
                  >
                    Anemoy Capital SPC Limited
                  </Heading>
                  <Text fontSize="14px" color="#91969B" mt={8} fontWeight={400} lineHeight={'160%'}>
                    Anemoy Liquid Treasury Fund 1 is a fully onchain, actively managed US Treasury Yield Fund. It is
                    BVI-licensed and open to non-US Professional Investors. The fund balances monthly, offers daily
                    redemptions, holds US T-Bills with a maximum maturity of 6-months, and focuses on maximizing
                    interest rates and minimizing price and duration risks.
                  </Text>
                </Flex>
                <Box bg="bg-primary" shadow="xs" boxShadow="none" mt={{ base: 6, md: 0 }}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                      Historical default rate
                    </Text>
                    <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                      1.2%
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                      Fund admin
                    </Text>
                    <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                      Galaxy
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                      Trustee
                    </Text>
                    <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                      UMB Bank, N.A.
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                      Pricing oracle provider
                    </Text>
                    <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                      Anemoy
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                      Auditor
                    </Text>
                    <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                      Ernst & Young LLP
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                      Custodian
                    </Text>
                    <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                      Galaxy
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                      Investment manager
                    </Text>
                    <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                      UMB Bank, N.A.
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                      Sub-advisor
                    </Text>
                    <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                      Anemoy
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                      Pool analysis
                    </Text>
                    <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                      Universal Co.
                    </Text>
                  </Flex>
                </Box>
              </Grid>
            </Box>

            <Heading size="lg" mt={8} mb={4}>
              Holdings
            </Heading>

            <DataTable columns={columns} data={holdings as Row[]} size="sm" />
          </Box>

          <Box maxHeight={'350px'} position={'sticky'} top={8}>
            <InvestRedeemSection pool={pool} />
          </Box>
        </Grid>
      </Box>
    </>
  )
}
