import { BalanceInput } from '@centrifuge/forms'
import { Card, Checkbox } from '@centrifuge/ui'
import { Box, Grid } from '@chakra-ui/react'

export const SectionWithBalanceInput = ({
  sections,
}: {
  sections: { title: string; value: number; currency: string; decimals: number }[]
}) => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gap={4}>
      {sections.map((section, index) => (
        <BalanceInput
          name={section.title}
          decimals={section.decimals}
          placeholder="0.00"
          inputGroupProps={{
            endAddon: 'USD',
          }}
          label={section.title}
          disabled
          key={`${section.title}-${index}`}
        />
      ))}
    </Grid>
  )
}

export const SectionWithCheckbox = ({
  sections,
}: {
  sections: { title: string; value: number; currency: string; decimals: number; checkboxLabel: string }[]
}) => {
  return (
    <Card>
      {sections.map((section) => (
        <Grid key={section.title} gridTemplateColumns="1fr 160px" gap={4} alignItems="center">
          <BalanceInput
            name={section.title}
            decimals={section.decimals}
            placeholder="0.00"
            inputGroupProps={{
              endAddon: 'USDC',
            }}
            label={section.title}
            disabled
          />
          <Box mt={6}>
            <Checkbox label={section.checkboxLabel} />
          </Box>
        </Grid>
      ))}
    </Card>
  )
}
