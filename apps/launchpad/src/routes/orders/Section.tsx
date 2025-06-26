import { Card } from '@centrifuge/ui'
import { Grid, Heading, Input, InputGroup, Stack, Text } from '@chakra-ui/react'

export const Section = ({ sections }: { sections: { title: string; value: number; currency: string }[] }) => {
  return (
    <Grid gridTemplateColumns={`repeat(${sections.length}, 1fr)`} gap={4}>
      {sections.map((section) => (
        <Stack key={section.title}>
          <Heading size="sm">{section.title}</Heading>
          <InputGroup endElement={section.currency}>
            <Input disabled value={section.value} />
          </InputGroup>
        </Stack>
      ))}
    </Grid>
  )
}
