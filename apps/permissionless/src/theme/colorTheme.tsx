import { defineConfig } from '@chakra-ui/react'
import { gold, grayScale, yellowScale } from './colors'

export const colorConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Text
        textPrimary: { value: grayScale[800] },
        textSecondary: { value: grayScale[500] },
        textDisabled: { value: grayScale[600] },
        textInverted: { value: 'white' },
        textHighlight: { value: gold },

        // Backgrounds
        backgroundPrimary: { value: 'white' },
        backgroundSecondary: { value: grayScale[50] },
        backgroundTertiary: { value: grayScale[100] },
        backgroundAccentPrimary: { value: yellowScale[100] },
        backgroundPage: { value: 'white' },
        backgroundInput: { value: 'white' },
        backgroundThumbnail: { value: grayScale[500] },
        backgroundDisabled: { value: grayScale[100] },

        // Buttons
        backgroundButtonPrimary: { value: grayScale[100] },
        backgroundButtonHighlight: { value: gold },
        backgroundButtonSecondary: { value: grayScale[800] },

        // Borders
        borderPrimary: { value: grayScale[100] },
        borderSecondary: { value: 'rgba(207, 207, 207, 0.50)' },
        borderTertiary: { value: grayScale[10] },
        borderHighlight: { value: gold },

        // Status
        statusDefault: { value: grayScale[800] },
        statusInfo: { value: yellowScale[800] },
        statusOk: { value: '#277917' },
        statusWarning: { value: yellowScale[800] },
        statusCritical: { value: '#d43f2b' },
        statusPromote: { value: '#f81071' },
        statusDefaultBg: { value: grayScale[100] },
        statusInfoBg: { value: yellowScale[100] },
        statusOkBg: { value: '#DCEBCF' },
        statusWarningBg: { value: yellowScale[50] },
        statusCriticalBg: { value: '#fcf0ee' },
        statusPromoteBg: { value: '#f8107114' },
      },
    },
  },
})
