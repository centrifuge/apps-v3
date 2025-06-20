import { Flex, Box, Tabs as ChakraTabs } from '@chakra-ui/react'
import type { CSSProperties } from 'react'

interface TabsProps {
  elements: {
    label: string
    value: string
    body: React.ReactNode
    style?: CSSProperties
  }[]
}

export const Tabs = ({ elements }: TabsProps) => {
  return (
    <Flex direction="column" h="100%" borderRadius="10px" overflow="hidden">
      <ChakraTabs.Root
        lazyMount
        unmountOnExit
        defaultValue={elements[0].value}
        colorPalette="yellow"
        size="lg"
        variant="line"
        h="100%"
      >
        <Box>
          <ChakraTabs.List>
            {elements.map((element) => (
              <ChakraTabs.Trigger value={element.value} key={element.value}>
                {element.label}
              </ChakraTabs.Trigger>
            ))}
            <ChakraTabs.Indicator bg="text-highlight" height="2px" borderRadius="1px" bottom="0" />
          </ChakraTabs.List>
        </Box>

        <Flex flex="1" direction="column" h="100%">
          {elements.map((element) => (
            <ChakraTabs.Content
              key={element.value}
              value={element.value}
              flex="1"
              bg="bg-accent"
              px={4}
              py={3}
              overflowY="auto"
            >
              {element.body}
            </ChakraTabs.Content>
          ))}
        </Flex>
      </ChakraTabs.Root>
    </Flex>
  )
}
