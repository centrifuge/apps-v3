import { Box, Button, Grid, IconWallet, Text } from '@centrifuge/fabric'
import styled from 'styled-components'
import { LayoutSection } from '../components/LayoutBase/LayoutSection'

const StyledGrid = styled(Grid)`
  height: 80vh;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 4px;
  margin: 4px;
  border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.M}) {
    margin-left: 0;
    margin-right: 0;
  }
`

const PortfolioPage = () => {
  return (
    <Box mb={2} mx={2}>
      <LayoutSection alignItems="flex-start">
        <Text variant="heading1">Your portfolio</Text>
      </LayoutSection>
      <StyledGrid>
        <IconWallet size="iconMedium" />
        <Text variant="body2" color="textSecondary">
          Connect your wallet in order to view your portfolio.
        </Text>
        <Button variant="primary" onClick={() => {}} small>
          Connect wallet
        </Button>
      </StyledGrid>
    </Box>
  )
}

export default PortfolioPage
