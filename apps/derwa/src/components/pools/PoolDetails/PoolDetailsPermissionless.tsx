import React from 'react'
import { PoolDetailsOverview } from './PoolDetailsOverview'
import { Flex } from '@chakra-ui/react'
import { getAgencyNormalisedName, RatingPill } from '@components/RatingPill'
import { PoolDetails } from '@centrifuge/shared'

export const PoolDetailsPermissionless = ({ poolDetails }: { poolDetails: PoolDetails }) => {
  return (
    <>
      <PoolDetailsOverview
        heading="Underlying assets"
        items={[
          { label: 'Fund', value: poolDetails.metadata?.pool.name },
          // TODO: poolDetails.metadata.pool.asset.class? It looks like it in permissioned designs
          { label: 'Asset type', value: '6.5 - 20%' },
          // TODO: missing data, need to wait for SDK updates and to type this correctly
          { label: '90-Day APY', value: '5.5%' },
          { label: 'Investor type', value: poolDetails.metadata?.pool.investorType || 'Non-US Professional' },
          {
            label: 'Fund rating',
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
    </>
  )
}
