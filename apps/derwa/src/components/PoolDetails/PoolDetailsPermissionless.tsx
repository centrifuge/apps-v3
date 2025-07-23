import React from 'react'
import { PoolDetailsOverview } from './PoolDetailsOverview'
import { Flex } from '@chakra-ui/react'
import { RatingPill } from '@components/RatingPill'

export const PoolDetailsPermissionless = () => {
  return (
    <>
      <PoolDetailsOverview
        heading="Underlying assets"
        items={[
          { label: 'Fund', value: 'Janus Henderson Anemoy Treasury Fund' },
          { label: 'Asset type', value: '6.5 - 20%' },
          { label: '90-Day APY', value: '5.5%' },
          { label: 'Investor type', value: 'Non-US Professional' },
          {
            label: 'Fund rating',
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
    </>
  )
}
