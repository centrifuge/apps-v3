import type { CSSProperties } from 'react'
import { Tabs as ChakraTabs } from '@chakra-ui/react'

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
    <ChakraTabs.Root
      lazyMount
      unmountOnExit
      defaultValue={elements[0].value}
      colorPalette="yellow"
      size="lg"
      variant="line"
      h="100%"
    >
      <ChakraTabs.List>
        {elements.map((element) => (
          <ChakraTabs.Trigger value={element.value} key={element.value} height="55px" alignItems="flex-end">
            {element.label}
          </ChakraTabs.Trigger>
        ))}
        <ChakraTabs.Indicator bg="text-highlight" height="2px" borderRadius="1px" bottom="0" />
      </ChakraTabs.List>

      {elements.map((element) => (
        <ChakraTabs.Content
          key={element.value}
          value={element.value}
          h="calc(100% - 55px)"
          bg="bg-accent"
          px={4}
          py={3}
          overflowY="hidden"
        >
          {element.body}
        </ChakraTabs.Content>
      ))}
    </ChakraTabs.Root>
  )
}
