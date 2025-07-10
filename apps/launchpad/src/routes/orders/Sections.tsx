import { BalanceInput } from '@centrifuge/forms'
import { Balance } from '@centrifuge/sdk'
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
            endAddon: section.currency,
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
  checkboxLabel,
  currency,
  decimals,
  label,
  onCheckedChange,
  title,
}: {
  checkboxLabel: string
  currency: string
  decimals: number
  label: string
  onCheckedChange: (checked: boolean) => void
  title: string
}) => {
  return (
    <Card>
      <Grid key={title} gridTemplateColumns="1fr 160px" gap={4} alignItems="center">
        <BalanceInput
          name={title}
          decimals={decimals}
          placeholder="0.00"
          inputGroupProps={{
            endAddon: currency,
          }}
          disabled
          displayDecimals={6}
          label={label}
        />
        <Box mt={6}>
          <Checkbox label={checkboxLabel} onCheckedChange={onCheckedChange} />
        </Box>
      </Grid>
    </Card>
  )
}
