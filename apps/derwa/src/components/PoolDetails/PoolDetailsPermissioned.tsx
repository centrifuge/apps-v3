import { PoolDetailsOverview } from './PoolDetailsOverview'
import { Flex, Heading } from '@chakra-ui/react'
import { ColumnDefinition, DataTable, LogoCentrifugeText, NetworkIcon } from '@centrifuge/ui'
import { getAgencyNormalisedName, RatingPill } from '@components/RatingPill'
import { PoolDetailsFacts } from './PoolDetailsFacts'
import { PoolDetails, ShareClassWithDetails, useHoldings } from '@centrifuge/shared'
import { PoolNetwork } from '@centrifuge/sdk'

type Row = {
  id: string
  cusip: string
  isin: string
  marketValue: string
  tradeQuantity: string
  maturityDate: string
  portfolioPercentage: string
}

export const PoolDetailsPermissioned = ({
  poolDetails,
  networks,
  shareClass,
}: {
  poolDetails: PoolDetails
  networks: PoolNetwork[]
  shareClass: ShareClassWithDetails
}) => {
  // TODO: Complains that shareClass.balances is not a function, check the hook as typing look weird
  // const sdkHoldings = useHoldings(shareClass.shareClass)

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

  const scId = shareClass?.details.id.toString()
  const token = scId && poolDetails.metadata?.shareClasses[scId]

  return (
    <>
      <PoolDetailsOverview
        heading="Overview"
        items={[
          { label: 'Asset type', value: poolDetails.metadata?.pool.asset.class },
          // TODO: missing data, need to wait for SDK updates and to type this correctly
          { label: '90-Day APY', value: '5.5%' },
          // TODO: Missing property in SDK returned type weightedAverageMaturity
          {
            label: 'Average asset maturity',
            value: Math.round(45.9) || 0,
          },
          // TODO: Format this to $50k etc
          { label: 'Min. investment', value: token?.minInitialInvestment || 0 },
          { label: 'Investor type', value: poolDetails.metadata?.pool.investorType || 'Non-US Professional' },
          {
            label: 'Available networks',
            value: <Flex>{networks?.map((network) => <NetworkIcon networkId={network.chainId} />)}</Flex>,
          },
          // TODO: missing data
          { label: 'Pool structure', value: 'Revolving' },
          {
            label: 'Rating',
            value: (
              <Flex>
                {poolDetails.metadata?.pool.poolRatings?.map((rating) => {
                  const agency = getAgencyNormalisedName(rating.agency)
                  const normalisedRating = {
                    ...rating,
                    agency,
                  }
                  return <RatingPill key={rating.agency} rating={normalisedRating} />
                })}
              </Flex>
            ),
          },
          // TODO: missing data
          { label: 'Expense ratio', value: '1%' },
        ]}
      />

      {/* TODO: Missing data */}
      <PoolDetailsFacts
        heading="Key facts"
        topRow={{
          logo: <LogoCentrifugeText fill="text-primary" />,
          links: [{ label: 'Website' }, { label: 'Forum' }, { label: 'Email' }, { label: 'Executive summary' }],
        }}
        bottomRow={{
          leftPanel: {
            heading: 'Anemoy Capital SPC Limited',
            text: 'Anemoy Liquid Treasury Fund 1 is a fully onchain, actively managed US Treasury Yield Fund. It is BVI-licensed and open to non-US Professional Investors. The fund balances monthly, offers daily redemptions, holds US T-Bills with a maximum maturity of 6-months, and focuses on maximizing interest rates and minimizing price and duration risks.',
          },
          rightPanel: {
            items: [
              { label: 'Historical default rate', value: '1.2%' },
              { label: 'Fund admin', value: 'Galaxy' },
              {
                label: 'Trustee',
                value: 'UMB Bank, N.A.',
              },
              {
                label: 'Pricing oracle provider',
                value: 'Anemoy',
              },
              { label: 'Auditor', value: 'Ernst & Young LLP' },
              { label: 'Custodian', value: 'Galaxy' },
              { label: 'Investment manager', value: 'UMB Bank, N.A.' },
              { label: 'Sub-advisor', value: 'Anemoy' },
              { label: 'Pool analysis', value: 'Universal Co.' },
            ],
          },
        }}
      />

      <Heading size="lg" mt={8} mb={4}>
        Holdings
      </Heading>

      <DataTable columns={columns} data={holdings as Row[]} size="sm" />
    </>
  )
}
