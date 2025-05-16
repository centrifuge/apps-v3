import { Box, Tooltip, Text, IconMoody, IconParticula, IconSp, Stack } from '@centrifuge/fabric'
import { FileType } from '@centrifuge/sdk'
import { useTheme } from 'styled-components'
import { ipfsToHttp } from '../../utils/IpfsToHttp'
import { RouterLinkButton } from '../RouterLinkButton'

type RatingProps = {
  agency?: string
  reportUrl?: string
  reportFile?: FileType | undefined | null
  value?: string
}

const ratingIcons: { [key: string]: JSX.Element } = {
  "Moody's": <IconMoody size={16} />,
  Particula: <IconParticula size={16} />,
  'S&P Global': <IconSp size={16} />,
}

const TooltipContent = ({ agency, reportUrl, reportFile }: RatingProps) => (
  <Stack>
    <Text variant="heading3" color="white">
      {agency}
    </Text>
    <RouterLinkButton to={reportUrl} newTab variant="tertiary" asText textProps={{ color: 'white' }}>
      {'View report >'}
    </RouterLinkButton>
    <RouterLinkButton
      to={ipfsToHttp(reportFile?.uri ?? '')}
      newTab
      variant="tertiary"
      asText
      textProps={{ color: 'white' }}
    >
      {'View pdf >'}
    </RouterLinkButton>
  </Stack>
)

export const RatingPill = ({ agency, reportUrl, reportFile, value }: RatingProps) => {
  const theme = useTheme()
  return (
    <Box key={`${agency}-${reportUrl}`}>
      <Tooltip
        triggerStyle={{ textDecoration: 'none' }}
        bodyWidth="maxContent"
        body={<TooltipContent agency={agency} reportUrl={reportUrl} reportFile={reportFile} value={value} />}
      >
        <Box
          border={`1px solid ${theme.colors.backgroundInverted}`}
          borderRadius={20}
          padding="2px 0px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pl={1}
          pr={1}
        >
          {agency && ratingIcons[agency] ? ratingIcons[agency] : null}
          <Text variant="body2" style={{ marginLeft: 4 }}>
            {value}
          </Text>
        </Box>
      </Tooltip>
    </Box>
  )
}
