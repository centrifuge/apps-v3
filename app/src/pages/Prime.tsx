import { Box, Grid, IconExternalLink, IconGlobe, Text, AnchorTextLink } from '@centrifuge/fabric'
import primePageImage from '../../assets/prime_page_image.svg'
import { LayoutSection } from '../components/LayoutBase/LayoutSection'

const PrimePage = () => {
  return (
    <>
      <LayoutSection alignItems="flex-start" pt={3} pb={3}>
        <Box display="flex" alignItems="center" ml={2}>
          <Box
            backgroundColor="backgroundSecondary"
            borderRadius={28}
            height={45}
            width={45}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <IconGlobe size={20} color="textPrimary" />
          </Box>
          <Text variant="heading1" style={{ marginLeft: 8 }}>
            Centrifuge Prime
          </Text>
        </Box>
        <Box borderBottom={`1px solid borderPrimary`} pb={2} mx={2} />
        <Grid
          gridTemplateColumns={['1fr', '1fr 1fr']}
          gap={6}
          mt={2}
          padding="0px 50px"
          style={{ placeItems: 'center' }}
        >
          <Box>
            <Text variant="body1" style={{ lineHeight: '25.6px' }}>
              Centrifuge Prime was built to meet the needs of large decentralized organizations and protocols. Through
              Centrifuge Prime, DeFi native organizations can integrate with the largest financial markets in the world
              and take advantage of real yields from real economic activity - all onchain. Assets tailored to your
              needs, processes adapted to your governance, and all through decentralized rails.
            </Text>
            <Box display="flex" alignItems="center" mt={4}>
              <AnchorTextLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://centrifuge.io/prime/"
                style={{ textDecoration: 'none', marginRight: 8 }}
              >
                Go to website
              </AnchorTextLink>
              <IconExternalLink size={20} />
            </Box>
          </Box>
          <Box>
            <Box as="img" src={primePageImage} />
          </Box>
        </Grid>
      </LayoutSection>
      <Box borderBottom='1px solid borderPrimary' pb={3} />
      <DaoPortfoliosTable />
    </>
  )
}

function DaoPortfoliosTable() {
  return (
    <Box mt={2}>
      <Text variant="heading4" style={{ marginBottom: 12 }}>
        Portfolios
      </Text>
      Data Table goes here
    </Box>
  )
}

export default PrimePage
