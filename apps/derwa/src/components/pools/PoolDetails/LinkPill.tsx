import { Button, type ButtonProps } from '@centrifuge/ui'

export const LinkPill = ({ label, ...rest }: ButtonProps) => {
  return (
    <Button
      label={label}
      color="gray.500"
      border="1px solid"
      borderColor="gray.500"
      background="transparent"
      borderRadius="full"
      height="2rem"
      fontSize="0.75rem"
      {...rest}
    />
  )
}
