import React, {Fragment} from 'react'
import { Stack, Text } from '@centrifuge/fabric'
import styled from 'styled-components'
import { InvestmentDisclaimerDialog } from '../Dialogs/InvestmentDisclaimerDialog'

export const Footer = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <Fragment>
      <InvestmentDisclaimerDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      <Stack as="footer" gap={1} width="100%">
        <UnstyledLink href="mailto:support@centrifuge.io">
          <Text textOverflow="ellipsis" variant="body4" color="textInverted">
            Need help?
          </Text>
        </UnstyledLink>
        <UnstyledLink href="https://docs.centrifuge.io/">
          <Text textOverflow="ellipsis" variant="body4" color="textInverted">
            Documentation
          </Text>
        </UnstyledLink>
        <UnstyledButton onClick={() => setIsDialogOpen(true)} >
          <Text textOverflow="ellipsis" variant="body4" color="textInverted">
            Investment disclaimer
          </Text>
        </UnstyledButton>
        <UnstyledLink target="_blank" href="https://centrifuge.io/data-privacy-policy/">
          <Text textOverflow="ellipsis" variant="body4" color="textInverted">
            Data privacy policy
          </Text>
        </UnstyledLink>
        <UnstyledLink target="_blank" href="https://centrifuge.io/imprint/">
          <Text textOverflow="ellipsis" variant="body4" color="textInverted">
            Imprint
          </Text>
        </UnstyledLink>
      </Stack>
    </Fragment>
  )
}

const UnstyledButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0;
`

const UnstyledLink = styled.a`
  background: transparent;
  cursor: pointer;
  text-decoration: none;
`
