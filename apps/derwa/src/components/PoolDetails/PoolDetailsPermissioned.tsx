import React from 'react'
import { PoolDetailsOverview } from './PoolDetailsOverview'
import { Flex, Heading } from '@chakra-ui/react'
import { ColumnDefinition, DataTable, LogoCentrifugeText, NetworkIcon } from '@centrifuge/ui'
import { RatingPill } from '@components/RatingPill'
import { PoolDetailsFacts } from './PoolDetailsFacts'

type Row = {
  id: string
  cusip: string
  isin: string
  marketValue: string
  tradeQuantity: string
  maturityDate: string
  portfolioPercentage: string
}

export const PoolDetailsPermissioned = () => {
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
      <PoolDetailsOverview
        heading="Overview"
        items={[
          { label: 'Asset type', value: 'Digital assets' },
          { label: '90-Day APY', value: '5.5%' },
          { label: 'Average asset maturity', value: '45 Days' },
          { label: 'Min. investment', value: '$20k - $500k' },
          { label: 'Investor type', value: 'Non-US Professional' },
          {
            label: 'Available networks',
            value: (
              <Flex>
                <NetworkIcon networkId={1} />
                <NetworkIcon networkId={42161} />
                <NetworkIcon networkId={42220} />
                <NetworkIcon networkId={8453} />
              </Flex>
            ),
          },
          { label: 'Pool structure', value: 'Revolving' },
          {
            label: 'Rating',
            value: (
              <Flex>
                <RatingPill rating={{ agency: 'moody', value: 'Aa' }} />
                <RatingPill rating={{ agency: 'sp', value: 'AA' }} />
                <RatingPill rating={{ agency: 'particula', value: 'BB' }} />
              </Flex>
            ),
          },
          { label: 'Expense ratio', value: '1%' },
        ]}
      />

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
