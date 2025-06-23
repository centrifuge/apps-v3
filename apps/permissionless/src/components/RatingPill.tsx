import { Badge, Icon, Image, Text } from '@chakra-ui/react'
import type { PoolMetadata } from '@centrifuge/sdk'

type RatingsArray = NonNullable<PoolMetadata['pool']['poolRatings']>

type FirstRating = RatingsArray[0]

import moodyLogo from '../assets/logos/moody.svg'
import spLogo from '../assets/logos/sp.svg'
import particulaLogo from '../assets/logos/particula.svg'

const logos = [
  {
    agency: 'moody',
    logo: moodyLogo,
  },
  {
    agency: 'sp',
    logo: spLogo,
  },
  {
    agency: 'particula',
    logo: particulaLogo,
  },
]

export const RatingPill = ({ rating }: { rating: FirstRating }) => {
  const logo = logos.find((logo) => rating.agency?.toLowerCase().includes(logo.agency))
  if (!rating) return null
  return (
    <Badge variant="outline">
      <Icon>
        <Image src={logo?.logo || spLogo} alt={rating.agency} />
      </Icon>
      <Text>{rating.value}</Text>
    </Badge>
  )
}
