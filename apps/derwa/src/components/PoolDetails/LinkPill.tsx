import { Button } from '@centrifuge/ui'

export const LinkPill = ({ label, styles }: { label: string; styles?: Record<string, string> }) => {
  return (
    <Button
      label={label}
      color="#91969B"
      border="1px solid #91969B"
      background="transparent"
      borderRadius="300px"
      height="32px"
      fontSize="14px"
      {...styles}
    />
  )
}
