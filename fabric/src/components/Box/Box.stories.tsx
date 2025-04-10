import { Meta } from '@storybook/react'
import * as React from 'react'
import { useTheme } from 'styled-components'
import { Box } from '.'
import { Text } from '../Text'
import { OverlayProvider } from '@react-aria/overlays'

export default {
  title: 'Components/Box',
  component: Box,
} as Meta<typeof Box>

export function Body() {
  const [isOpen, setIsOpen] = React.useState(true)
  return (
    <Box backgroundColor="red" width={[80, 80, 36, 120, 120]} borderRadius={8}>
        <Text as="h3" color="textInverted" variant="heading4" >
          Lorem ipsum blah blah blah
        </Text>
      </Box>
  )
}