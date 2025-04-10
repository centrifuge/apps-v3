import { Meta } from '@storybook/react'
import * as React from 'react'
import { useTheme } from 'styled-components'
import { Banner } from '.'
import { Text } from '../Text'
import { OverlayProvider } from '@react-aria/overlays'

export default {
  title: 'Components/Banner',
  component: Banner,
} as Meta<typeof Banner>

export function Body() {
  const [isOpen, setIsOpen] = React.useState(true)
  return (
    <OverlayProvider>
      <Banner
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={
          <Text as="h3" color="textInverted" variant="heading4">
            Lorem ipsum blah blah blah
          </Text>
        }
      />
    </OverlayProvider>
  )
}
